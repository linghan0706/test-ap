'use client'

import { useState } from 'react'
import MotionDiv from '@/components/motion/MotionDiv'
import StageProgressCard from '@/components/backpackCard/StageProgressCard'
// import NoseSection from '@/components/backpack_up/nosesection'
import SelectCard from '@/components/backpackCard/SelectCard'
import backImage from '@/public/backImage.png'

export default function BackpackPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  return (
    <div className="min-h-screen relative overflow-hidden pb-20 pt-10 sm:pt-14 mt-[20px]">
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] bg-cover bg-contain"
        style={{ backgroundImage: `url(${backImage.src})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107,10,233,0.4) 0%, rgba(100,16,177,0.2) 40%, rgba(94,50,172,0.1) 80%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        ></div>
      </div>
      {/* 顶部标题 */}
      <div className="relative z-10 px-4 pt-6 max-w-[420px] mx-auto">
        <MotionDiv
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-jersey-10 font-normal text-[36px] text-white mx-auto"
            style={{ width: '120px', height: '23px', lineHeight: '23px' }}
          >
            Backpack
          </h1>
          <p
            className="font-exo2 font-medium text-[16px] mx-auto"
            style={{ height: '23px', lineHeight: '23px', color: '#90A1B9' }}
          >
            Check your props and collections
          </p>
        </MotionDiv>
      </div>

      {/* 内容区：卡片组件 */}
      <div className="relative z-10 px-4 mt-6 flex flex-col gap-4 items-center">
        <StageProgressCard
          showCornerLocks
          lockedPositions={[{ left: 40, top: 320 }]}
          data-testid="stage-progress-card"
        />
        {/* Nose Section 详情卡片预览 */}
        {/* <NoseSection /> */}
        <SelectCard value={selectedCategory} onChange={setSelectedCategory} />
      </div>
    </div>
  )
}
