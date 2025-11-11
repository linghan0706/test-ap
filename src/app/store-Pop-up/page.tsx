'use client'

import StoresTransactionResult from '@/components/stores_up/StoresTransactionResult'
import StoresTransactionCard from '@/components/stores_up/StoresTransactionCard'
import { useState } from 'react'
import NoStoresTransactionCard from '@/components/backpack_up/Nosesection'
import NosesectionResult from '@/components/backpack_up/NosesectionResult'
import GiftProps from '@/components/backpack_up/GiftProps'
import SelectCard from '@/components/backpackCard/SelectCard'
export default function StorePopupPage() {
  // const [activeIndex, setActiveIndex] = useState(0)
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string | undefined>(undefined)

  // const simulateLoad = async (index: number) => {
  //   setError(undefined)
  //   setLoading(true)
  //   setActiveIndex(index)
  //   await new Promise((r) => setTimeout(r, 500))
  //   setLoading(false)
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] flex flex-col items-center justify-center gap-4 p-6">
      {/* 测试Store组件 */}

      {/* 返回结果 */}
      {/* <StoresTransactionResult
        activeIndex={activeIndex}
        loading={loading}
        error={error}
      />  */}
      {/* 支付组件 */}
      {/* 支付组件 */}
      {/* Payment selection card preview */}
      {/* <StoresTransactionCard /> */}
      {/* 礼物属性组件 */}
      {/* Preview the SelectCard for visual verification */}
      <SelectCard />
      <GiftProps />
    </div>
  )
}
