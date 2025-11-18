# 前端转发（代理）设计说明

## 背景与目标
- 统一通过前端路径 `/api/proxy` 访问后端 `/api`，隐藏后端地址并集中处理认证、错误与跨域。
- 登录接口遵循纯 JSON 契约；非登录接口自动携带 `Authorization`；401 进行统一处理（刷新或重登）。

## 架构与数据流
- 浏览器 → axios（基础地址 `'/api/proxy'`） → Next.js 路由处理器（服务端代理） → 上游后端 `API_BASE_URL + '/api/...'` → 返回响应。
- 路由处理器对转发路径做前缀归一化，并透传请求方法、头、查询与请求体。

## 关键实现

### Axios 基础地址与拦截器
- 基础地址：`test-ap/src/utils/http.ts:16`
- 请求拦截器：`test-ap/src/utils/http.ts:24–35`
  - 非登录接口自动注入 `Authorization: Bearer <token>`（`test-ap/src/utils/http.ts:32–35`）
  - GET 请求统一加 `_t` 时间戳避免缓存（`test-ap/src/utils/http.ts:38–43`）
- 响应拦截器：`test-ap/src/utils/http.ts:55–87, 94–141`
  - 标准后端结构 `{ code, message, data, success, timestamp }` 收敛为统一前端数据（`test-ap/src/utils/http.ts:63–76`）
  - 保留后端错误消息与 `x-proxy-upstream` 便于排查（`test-ap/src/utils/http.ts:129–140`）
  - 401 统一处理与令牌刷新（见下文）

### Next.js 代理路由
- 路径归一化：
  - 基于 `pathname` 前缀替换：`'^/api/proxy' → '/api'`（`test-ap/src/app/api/[...path]/route.ts:20`）
  - 基于段数组剔除 `'proxy'` 并构造 `/api/<trimmed>`（`test-ap/src/app/api/[...path]/route.ts:17–21`）
  - 二者择优生成最终 `finalPath` 与 `upstream`（`test-ap/src/app/api/[...path]/route.ts:21–22`）
- 响应头输出调试信息：
  - `x-proxy-upstream` 与 `x-proxy-debug`（包含 `base`、原始 `pathname`、`computed_upstream`），用于线上快速确认映射是否正确（`test-ap/src/app/api/[...path]/route.ts:49–53`）
- 透传请求方法、头、查询与体，并设置必要的 Cookie 与 Content-Type（`test-ap/src/app/api/[...path]/route.ts:23–39, 41–45`）

### 登录调用契约
- 纯 JSON 请求：`{"initData":"<string>"}`（`test-ap/src/utils/api.ts:80–84`）
- 登录接口不注入 `Authorization`（`test-ap/src/utils/http.ts:32`）
- 可同时携带 `X-Telegram-Init-Data` 头增强兼容性（`test-ap/src/utils/api.ts:80–84`）

### 401 刷新与重试（非登录端点）
- 独立 `authHttp`（无拦截器递归）用于 `/auth/refresh`（`test-ap/src/utils/http.ts:22–30`）
- 响应拦截器遇到非登录/刷新端点的 401：
  - 取本地 `refreshToken` 调用 `/auth/refresh`（`test-ap/src/utils/http.ts:102–118`）
  - 刷新成功则更新本地令牌并重放原请求（`test-ap/src/utils/http.ts:119–127`）
  - 刷新失败或无 `refreshToken` 则清理令牌并返回未授权（`test-ap/src/utils/http.ts:128–141`）

## 路径规则与示例
- 通用：前端写 `httpUtils.get('/tasks/center')` → 浏览器请求 `'/api/proxy/tasks/center'` → 代理映射到上游 `API_BASE_URL + '/api/tasks/center'`
- 登录：
  - 前端：`httpUtils.post('/auth/login', { initData }, { headers: { 'X-Telegram-Init-Data': initData } })`
  - 上游：`API_BASE_URL + '/api/auth/login'`

## 环境变量与部署
- 必须设置 `API_BASE_URL`（例如 `http://38.165.34.30:8080`）；未设置会返回 500 并阻断代理（`test-ap/src/app/api/[...path]/route.ts:8–13`）
- 部署后需确认响应头 `x-proxy-upstream` 是否为 `API_BASE_URL + '/api/...'`；若仍含 `'/api/proxy'`，说明代理逻辑未生效，需要重新构建与发布。

## 错误处理与排查
- 登录接口错误：
  - 415：仅发送 JSON（避免 text/plain 或 form-urlencoded）
  - 401/“缺少访问令牌”：若代理映射正确仍出现，可能后端要求额外网关令牌或签名，需要按后端契约补充
- 非登录接口 401：
  - 自动刷新令牌并重试；失败则清理令牌并引导重登录
- 调试项：
  - 查看响应头 `x-proxy-upstream` 与 `x-proxy-debug` 是否指向 `'/api/...’`
  - 确认 Request Headers 有 `Content-Type: application/json` 与 `Authorization`（非登录）

## 测试建议
- 单元测试（Jest）：拦截器的注入与响应处理分支、401 刷新重放逻辑
- 端到端验证：网络面板检查 `x-proxy-upstream` 与 `x-proxy-debug`，登录后令牌持久化与接口鉴权

## 监控与告警
- 前端错误上报携带 `x-proxy-upstream` 与接口路径，便于定位代理问题
- 设置 401 错误率阈值报警，触发时通知开发团队

## 常见问题（FAQ）
- 为什么 `x-proxy-upstream` 仍含 `/api/proxy`？
  - 多为代理逻辑未部署或被旧版本缓存，需要重新构建并发布
- 登录是否需要 `Authorization`？
  - 不需要；仅使用 JSON `initData`（并可同时加 `X-Telegram-Init-Data` 头）
- 仍返回“缺少访问令牌”怎么办？
  - 确认代理映射正确与环境变量已设置；若仍 401，核实后端是否需要额外的网关令牌/签名头并在请求中补充

## 代码参考
- 代理路由构造上游与调试头：`test-ap/src/app/api/[...path]/route.ts:20, 21, 22, 49, 50, 51, 52`
- Axios 基础地址与登录识别：`test-ap/src/utils/http.ts:16, 32`
- 登录 JSON 请求与头：`test-ap/src/utils/api.ts:80, 81, 82, 83, 84`
- 401 刷新并重试（非登录端点）：`test-ap/src/utils/http.ts:102–141`