'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AssetRedemption() {
  return (
    <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto ">
      <div className="flex-col  rounded-[12px] border py-5 px-3  shadow-lg bg-[#221A4C]">
        <div className="mx-auto text-center text-white font-jersey-10 text-[22px] sm:text-[20px] mb-3 w-[136px] height-[22px]">
          asset redemption
        </div>
        {/* 游戏物品兑换区 */}
        <div className="flex items-center justify-center gap-3 mb-4">
           {/* Powers */}
          <div className="flex items-center gap-[10px] border py-[8px] px-[12px] border-rounded-[8px] bg-[#4A3A44] border-[#7C5F30] rounded-lg">
            <span className="text-lg">
              <Image src="/currency/power.svg" alt="powers" width={16} height={16} />
            </span>
            <span className="font-exo2 text-[18px]  leading-[22px] text-white">100</span>
          </div>
          <span className="text-white/70 text-xl">=</span>
          <div className="flex items-center gap-[10px] border py-[8px] px-[12px] border-rounded-[8px] bg-[#4A3A44] border-[#7C5F30] rounded-lg">
           {/* Stars */}
            <span className="text-yellow-300 text-lg">
              <Image src="/currency/stars.svg" alt="nova" width={16} height={16} />
              </span>
            <span className="font-exo2 text-[18px]  leading-[22px] text-white">1</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-[42px] rounded-[8px] flex-col align-center justify-center bg-[linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)] text-white font-jersey-10 text-[16px] leading-[20px] "
        >
          exchange
        </motion.button>
      </div>
    </div>
  )
}