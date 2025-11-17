# 接口转发实现说明

## 概览
- 前端以同源相对路径 `'/api/*'` 发起请求，Axios `baseURL` 为空，确保命中 Next 路由。
- 统一代理位于 `src/app/api/[...path]/route.ts`，运行时为 `nodejs`，通过环境变量 `API_BASE_URL` 拼接上游地址并转发。
- 代理对关键端点执行鉴权校验，响应附带诊断头以便在 Telegram 环境确认实际转发。

## 关键实现
- 运行时与上游拼接：`3:15:src/app/api/[...path]/route.ts`
  - 运行时：`export const runtime = 'nodejs'`
  - 读取后端地址：`const base = (process.env.API_BASE_URL || '').replace(/\/$/, '')`
  - 空值保护：未设置时返回 500 且消息 `API_BASE_URL not set`
  - 上游 URL：`const upstream = \`${base}${u.pathname}${u.search}\``
- 方法与请求体转发：`19:23:src/app/api/[...path]/route.ts`
  - 非 `GET/HEAD` 读取原始文本体并原样转发
  - 绑定 `GET/POST/PUT/PATCH/DELETE`：`39:57:src/app/api/[...path]/route.ts`
- 头部处理与鉴权：`16:26:src/app/api/[...path]/route.ts`
  - 删除 `host` 头，保留其余头部转发
  - 需要鉴权的路径：`/api/store/*` 与 `/api/auth/logout`
  - 缺少 `Authorization` 时返回 401：`{ success: false, message: 'Unauthorized' }`
- 诊断头：`27:36:src/app/api/[...path]/route.ts`
  - `x-proxy-runtime: nodejs`
  - `x-proxy-upstream: <最终上游URL>`

## 前端请求与令牌注入
- Axios 实例：`15:21:src/utils/http.ts`
  - `baseURL: ''`，同源命中 `/api/*`
  - 默认 `Content-Type: application/json`
- 请求拦截器注入令牌：`29:33:src/utils/http.ts`
  - 优先读取 `localStorage.telegram_auth_token`，兼容旧键名 `token`
  - 注入头：`Authorization: Bearer <token>`
- 登录请求：`81:84:src/utils/api.ts`
  - `httpUtils.post('/api/auth/login', { initData })`
  - 登录成功后保存令牌：`141:159:src/utils/api.ts`

## 环境变量与部署要求
- 配置文件路径：`c:\Users\lingh\Desktop\test-front\test-ap\.env`
- `.env` 必须设置 `API_BASE_URL`（Production 环境作用域），示例：
  - `API_BASE_URL=http://38.165.34.30:8080`
- 部署需重新构建以应用 `nodejs` 运行时与代理改动。
- 推荐后端地址使用域名与 HTTPS；如使用 IP，在 `nodejs` 运行时下可正常工作。

## 响应与错误处理
- 统一响应处理：`52:147:src/utils/http.ts`
  - 支持 `{ code, message, data, success, timestamp }` 结构
  - 映射常见 HTTP 错误为用户友好消息
- 典型行为：
  - 未配置 `API_BASE_URL`：返回 500 并提示 `API_BASE_URL not set`
  - 未携带令牌访问受保护端点：返回 401 `Unauthorized`
  - 业务错误（如签名失败）：返回 200，`success: false` 与具体消息

## 验证方法
- 在 Telegram WebApp 中调用任意接口后检查响应头：
  - 存在 `x-proxy-runtime: nodejs` → 已脱离 Edge 限制
  - `x-proxy-upstream` 显示具体上游地址，应为 `API_BASE_URL + 路径 + 查询`
- 直接上游验证（开发机）：
  - `POST http://38.165.34.30:8080/api/auth/login` 应返回 200（业务体为签名校验结果）

## 拓展与维护
- 新增需要鉴权的端点：在 `src/app/api/[...path]/route.ts` 扩展前缀判断，例如：`path.startsWith('/api/user')`
- 前端仅在 `src/utils/api/**` 中维护接口方法；无需在 `app/api/**` 为每个接口单独建文件。