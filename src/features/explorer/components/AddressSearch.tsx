'use client'

import { useState } from 'react'
import { Input, Button, Space, message, AutoComplete } from 'antd'
import { SearchOutlined, ScanOutlined } from '@ant-design/icons'
import { isValidTonAddress, isValidTransactionHash } from '@/utils'

const { Search } = Input

interface AddressSearchProps {
  onSearch: (query: string, type: 'address' | 'transaction' | 'block') => void
  loading?: boolean
  placeholder?: string
}

export default function AddressSearch({ 
  onSearch, 
  loading = false, 
  placeholder = "输入TON地址、交易哈希或区块号..." 
}: AddressSearchProps) {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState<{ value: string; label: string }[]>([])

  // 检测搜索类型
  const detectSearchType = (query: string): 'address' | 'transaction' | 'block' => {
    const trimmedQuery = query.trim()
    
    // 检查是否为TON地址
    if (isValidTonAddress(trimmedQuery)) {
      return 'address'
    }
    
    // 检查是否为交易哈希
    if (isValidTransactionHash(trimmedQuery)) {
      return 'transaction'
    }
    
    // 检查是否为区块号（纯数字）
    if (/^\d+$/.test(trimmedQuery)) {
      return 'block'
    }
    
    // 默认按地址处理
    return 'address'
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    const trimmedValue = value.trim()
    
    if (!trimmedValue) {
      message.warning('请输入搜索内容')
      return
    }

    const searchType = detectSearchType(trimmedValue)
    
    // 验证输入格式
    if (searchType === 'address' && !isValidTonAddress(trimmedValue)) {
      message.error('请输入有效的TON地址格式')
      return
    }
    
    if (searchType === 'transaction' && !isValidTransactionHash(trimmedValue)) {
      message.error('请输入有效的交易哈希格式')
      return
    }

    onSearch(trimmedValue, searchType)
  }

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setSearchValue(value)
    
    // 生成搜索建议
    if (value.length > 2) {
      const newSuggestions = []
      
      // 如果输入看起来像地址
      if (value.startsWith('EQ') || value.startsWith('UQ')) {
        newSuggestions.push({
          value: value,
          label: `🏠 搜索地址: ${value}`
        })
      }
      
      // 如果输入看起来像哈希
      if (/^[a-fA-F0-9]{10,}$/.test(value)) {
        newSuggestions.push({
          value: value,
          label: `📄 搜索交易: ${value}`
        })
      }
      
      // 如果输入是纯数字
      if (/^\d+$/.test(value)) {
        newSuggestions.push({
          value: value,
          label: `🧱 搜索区块: ${value}`
        })
      }
      
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }

  // 处理扫码（预留功能）
  const handleScan = () => {
    message.info('扫码功能开发中...')
  }

  return (
    <div className="w-full max-w-2xl">
      <Space.Compact className="w-full">
        <AutoComplete
          className="flex-1"
          options={suggestions}
          value={searchValue}
          onChange={handleInputChange}
          onSelect={(value) => {
            setSearchValue(value)
            handleSearch(value)
          }}
        >
          <Search
            placeholder={placeholder}
            enterButton={
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                loading={loading}
              >
                搜索
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            loading={loading}
          />
        </AutoComplete>
        
        <Button
          size="large"
          icon={<ScanOutlined />}
          onClick={handleScan}
          title="扫码搜索"
        />
      </Space.Compact>
      
      {/* 搜索提示 */}
      <div className="mt-2 text-sm text-gray-500">
        <Space split="•" size="small">
          <span>支持TON地址</span>
          <span>交易哈希</span>
          <span>区块号</span>
        </Space>
      </div>
    </div>
  )
}