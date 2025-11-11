'use client'

import { Card, Descriptions, Typography, Space, Button, Tag, Tooltip } from 'antd'
import { 
  CopyOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  WalletOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { TonAccount } from '@/services/ton'
import { formatTonAmount, formatAddress, formatTimestamp, copyToClipboard } from '@/utils'

const { Text, Title } = Typography

interface AccountInfoProps {
  account: TonAccount
  loading?: boolean
  onRefresh?: () => void
}

export default function AccountInfo({ account, loading = false, onRefresh }: AccountInfoProps) {
  
  const handleCopyAddress = async () => {
    const success = await copyToClipboard(account.address)
    if (success) {
      console.log('Address copied')
    }
  }

  const getAccountStatus = () => {
    if (account.status === 'active') {
      return <Tag color="green">活跃</Tag>
    } else if (account.status === 'uninitialized') {
      return <Tag color="orange">未初始化</Tag>
    } else {
      return <Tag color="red">非活跃</Tag>
    }
  }

  const getAccountType = () => {
    // 暂时移除 account_type 相关逻辑
    return <Tag color="default">未知</Tag>
  }

  return (
    <Card
      title={
        <Space>
          <WalletOutlined />
          <span>账户信息</span>
          {getAccountStatus()}
          {getAccountType()}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="刷新数据">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="导出数据">
            <Button
              type="text"
              icon={<ExportOutlined />}
              onClick={() => console.log('Export feature under development...')}
            />
          </Tooltip>
        </Space>
      }
      loading={loading}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item 
          label="地址"
          labelStyle={{ width: '120px' }}
        >
          <Space>
            <Text code copyable={{ text: account.address }}>
              {formatAddress(account.address)}
            </Text>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyAddress}
            />
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="余额">
          <Title level={4} className="!mb-0 text-green-600">
            {formatTonAmount(account.balance)} TON
          </Title>
        </Descriptions.Item>

        <Descriptions.Item label="状态">
          <Space>
            {getAccountStatus()}
            <Text type="secondary">
              {account.status === 'active' ? '账户已激活并可以进行交易' : 
               account.status === 'uninitialized' ? '账户尚未初始化' : 
               '账户当前非活跃状态'}
            </Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="更新时间">
          <Text>
            <ClockCircleOutlined className="mr-1" />
            {formatTimestamp(Date.now())}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}