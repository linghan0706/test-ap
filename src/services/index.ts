// 导出所有服务
export * from './api'
export * from './ton'

// 创建服务实例
import { TonService } from './ton'

// 根据环境变量或配置创建服务实例
const network = (process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet') || 'mainnet'

export const tonService = new TonService(network)
