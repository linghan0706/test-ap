import { TonClient, WalletContractV4, Address } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { TonApiClient } from '@ton-api/client'
import { tonApiConfig, networkConfig, DEFAULT_NETWORK } from './ton-config'

// TON API 客户端
export const createTonApiClient = () => {
  return new TonApiClient({ 
    baseUrl: tonApiConfig.baseUrl,
    apiKey: tonApiConfig.apiKey
  })
}

// TON 客户端
export const createTonClient = (
  network: keyof typeof networkConfig = DEFAULT_NETWORK
) => {
  const config = networkConfig[network]
  return new TonClient({
    endpoint: config.rpcEndpoint,
  })
}

// 钱包相关工具函数
export const createWalletFromMnemonic = async (
  mnemonic: string[],
  network: keyof typeof networkConfig = DEFAULT_NETWORK
) => {
  const key = await mnemonicToWalletKey(mnemonic)
  const client = createTonClient(network)
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: key.publicKey,
  })

  return {
    wallet,
    client,
    key,
  }
}

// 获取钱包地址
export const getWalletAddress = (wallet: WalletContractV4) => {
  return wallet.address.toString()
}

// 获取钱包余额
export const getWalletBalance = async (client: TonClient, address: string) => {
  const balance = await client.getBalance(Address.parse(address))
  return balance
}
