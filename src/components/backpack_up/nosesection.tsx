"use client"

import React from 'react'
import Image from 'next/image'

type NoseSectionProps = {
  className?: string
  onGive?: () => void
  onSell?: () => void
  onUse?: () => void
}

const NoseSection: React.FC<NoseSectionProps> = ({ className, onGive, onSell, onUse }) => {
  return (
    <section
      className={[
        'relative w-[317px] h-[273px] rounded-[12px]',
        'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
        'border border-[#6B0AE9]',
        'flex flex-col items-center',
        // 星空背景：深色渐变 + 微网格星点
        'bg-[#151633]',
        className ?? '',
      ].join(' ')}
      aria-label="Nose Section"
    >
      {/* 背景层：使用 taskupback.svg */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage: 'url(/Popup/taskupback.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 星点轻纹理覆盖 */}


      {/* 顶部标题与帮助按钮 */}
      <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-1">
        <h2 className="font-jersey-10 text-white text-[28px] leading-[22px]">Nose Section</h2>
        {/* 右上角问号按钮 */}
        <button
          type="button"
          title="help"
          className="absolute right-3 top-3 w-[22px] h-[22px] rounded-[6px] flex items-center justify-center bg-[#2B2E5A] border border-white/20"
        >
          <Image
            src="/backpack/question/question.png"
            alt="Help"
            width={10}
            height={10}
            className="w-[10px] h-[10px] object-contain"
            priority
          />
        </button>
      </div>

      {/* 中心展示图 */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center">
        <Image
          src="/backpack/StageProgress.svg"
          alt="Nose section"
          width={157}
          height={157}
          className="object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
          priority
        />
      </div>

      {/* 底部操作按钮组 */}
      <div className="relative z-10 w-full px-4 pb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onGive}
          className={[
            'w-[87px] h-[36px] rounded-[12px]',
            'bg-[rgba(15,21,43,0.50)] text-white',
            'font-jersey-10 text-[18px] leading-[22px]',
          ].join(' ')}
        >
          Give
        </button>

        <button
          type="button"
          onClick={onSell}
          className={[
            'w-[87px] h-[36px] rounded-[12px]',
            'text-white',
            'font-jersey-10 text-[18px] leading-[22px]',
            'bg-[linear-gradient(156.71deg,#42CEF0_2.78%,#1E59E6_99.22%)]',
            'shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
          ].join(' ')}
        >
          Sell
        </button>

        <button
          type="button"
          onClick={onUse}
          className={[
            'w-[87px] h-[36px] rounded-[12px]',
            'bg-[rgba(15,21,43,0.50)] text-white',
            'font-jersey-10 text-[18px] leading-[22px]',
          ].join(' ')}
        >
          use
        </button>
      </div>
    </section>
  )
}

export default NoseSection