## 技术栈

### 核心框架

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**

### UI 与样式

- **Ant Design** - UI 组件库
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

### 状态管理与数据

- **Zustand** - 轻量化状态管理
- **SWR** - 数据获取和缓存

### TON 区块链集成

- **@ton/ton** - TON 核心库
- **@ton/crypto** - 加密功能库
- **@tonconnect/sdk** - TON Connect SDK
- **@tonconnect/ui-react** - TON Connect React UI
- **@ton-api/client** - TON API 客户端

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Jest** - 测试框架
- **Testing Library** - React 组件测试

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

在项目根目录编辑 `.env` 文件，填入必要的配置：

```env
# TON API 配置
NEXT_PUBLIC_TON_API_KEY=your_ton_api_key_here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nova Explorer Bot

# 网络配置
NEXT_PUBLIC_NETWORK=mainnet

# 统一后端基础地址（代理仅使用 .env 的 API_BASE_URL）
API_BASE_URL=http://localhost:8081
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式
- `npm run test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 生成测试覆盖率报告

## 项目结构

```
src/
├── app/                         # 页面路由（App Router）
│   ├── api/                     # 前端通用代理（统一隐藏后端路径）
│   │   └── [...path]/route.ts   # 统一代理转发 /api/*
│   ├── home/                    # 个人首页
│   ├── store/                   # 商店页面
│   ├── task/                    # 任务页面
│   ├── backpack/                # 背包页面
│   ├── base/                    # 基础页面
│   └── layout.tsx               # 全局布局
├── components/                 # UI 组件
│   ├── backpackCard/           # 背包卡片组件
│   └── backpack_up/            # 背包弹窗组件
├── stores/                     # Zustand 状态管理
├── types/                      # TypeScript 类型定义
├── utils/                      # 工具与接口模块
│   ├── http.ts                 # Axios 实例（统一 Token 与响应格式）
│   └── api/                    # 按模块划分的接口文件
│       └── store/api.ts        # 商店接口集合
└── styles/                     # 全局样式（globals.css）
```

## 接口调用规范

- 统一通过同源路径 `'/api/*'` 调用后端，通用代理会转发至 `.env` 配置的 `API_BASE_URL`（未设置时返回 500 明确提示）。
- 代理运行时为 `nodejs`，避免 Edge 环境对直连 IP 的限制；`/api/vitals` 保持 `edge`。
- 仅在 `src/utils/api/**` 下按模块维护接口方法，写相对路径，例如：
  - `http.get('/api/store/items')`
  - `http.post('/api/store/purchase/submit', payload)`
- 认证：`src/utils/http.ts` 请求拦截器自动注入 `Authorization: Bearer <token>`（优先从 `localStorage.telegram_auth_token` 读取，兼容 `token`）。
- 统一鉴权：代理层对 `'/api/store/*'` 与 `'/api/auth/logout'` 缺少 `Authorization` 的请求返回 401。
- 响应：统一处理 `{ code, message, data, success, timestamp }` 格式，返回前端友好结构。
- 诊断头：代理响应附带 `x-proxy-runtime` 与 `x-proxy-upstream`，便于在 Telegram 环境验证运行时与上游地址。

### 示例（商店接口）

```
import { fetchStoreItems, fetchStoreOrders, submitStorePurchase, submitStoreExchange } from '@/utils/api/store/api'

// 获取物品列表
const items = await fetchStoreItems()

// 获取订单列表
const orders = await fetchStoreOrders()

// 根据订单号查询订单
const order = await fetchStoreOrderByNumber('ORD202401010001')

// 提交购买
await submitStorePurchase({ itemId: 1, assetId: 3, quantity: 1, paymentMethod: 'TON', transactionHash: '0x...', walletAddress: '0x...', rawTransactionData: {} })

// 资产兑换
await submitStoreExchange({ sourceAssetId: 1, targetAssetId: 3, sourceAmount: 100 })
```

## 开发规范提示

- 模块导入大小写必须与文件名完全一致，避免在大小写敏感环境下构建失败。
- 接口仅在 `utils/api/**` 中新增；无需在 `app/api/**` 为每个接口单独建转发文件。
- 变更 `.env` 后需重启开发服务器使配置生效。

# test-ap
