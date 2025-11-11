'use client'

import { Card, Button, Typography, Space, Tag, Tooltip } from 'antd'
import { 
  WalletOutlined, 
  CopyOutlined, 
  DisconnectOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import { formatAddress, formatTonAmount, copyToClipboard } from '@/utils'
import { WalletState } from '@/types'

const { Text, Title } = Typography

interface WalletCardProps {
  wallet: WalletState
  onDisconnect: () => void
  loading?: boolean
}

export default function WalletCard({ wallet, onDisconnect, loading = false }: WalletCardProps) {
  const [showFullAddress, setShowFullAddress] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  const handleCopyAddress = async () => {
    if (wallet.address) {
      const success = await copyToClipboard(wallet.address)
      if (success) {
        // 这里可以添加成功提示
        console.log('Address copied to clipboard')
      }
    }
  }

  const displayAddress = wallet.address 
    ? showFullAddress 
      ? wallet.address 
      : formatAddress(wallet.address)
    : ''

  const displayBalance = wallet.balance 
    ? showBalance 
      ? `${formatTonAmount(wallet.balance)} TON`
      : '****'
    : '0 TON'

  return (
    <Card
      className="w-full max-w-md"
      title={
        <Space>
          <WalletOutlined className="text-blue-500" />
          <span>我的钱包</span>
          <Tag color={wallet.network === 'mainnet' ? 'green' : 'orange'}>
            {wallet.network === 'mainnet' ? '主网' : '测试网'}
          </Tag>
        </Space>
      }
      extra={
        <Button
          type="text"
          danger
          icon={<DisconnectOutlined />}
          onClick={onDisconnect}
          loading={loading}
          size="small"
        >
          断开连接
        </Button>
      }
    >
      <Space direction="vertical" className="w-full">
        {/* 地址显示 */}
        <div>
          <Text type="secondary" className="text-sm">
            钱包地址
          </Text>
          <div className="flex items-center justify-between mt-1">
            <Text 
              code 
              className="flex-1 mr-2"
              style={{ fontSize: '12px' }}
            >
              {displayAddress}
            </Text>
            <Space size="small">
              <Tooltip title={showFullAddress ? '隐藏完整地址' : '显示完整地址'}>
                <Button
                  type="text"
                  size="small"
                  icon={showFullAddress ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => setShowFullAddress(!showFullAddress)}
                />
              </Tooltip>
              <Tooltip title="复制地址">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={handleCopyAddress}
                />
              </Tooltip>
            </Space>
          </div>
        </div>

        {/* 余额显示 */}
        <div>
          <Text type="secondary" className="text-sm">
            账户余额
          </Text>
          <div className="flex items-center justify-between mt-1">
            <Title level={4} className="!mb-0 !text-green-600">
              {displayBalance}
            </Title>
            <Tooltip title={showBalance ? '隐藏余额' : '显示余额'}>
              <Button
                type="text"
                size="small"
                icon={showBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowBalance(!showBalance)}
              />
            </Tooltip>
          </div>
        </div>

        {/* 连接状态 */}
        <div className="pt-2 border-t border-gray-100">
          <Space>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text type="secondary" className="text-sm">
              已连接
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  )
}