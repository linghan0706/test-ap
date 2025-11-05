'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PropCardProps {
  title: string
  validity?: string
  dailyCap?: string
  icon?: string
  onPurchase?: () => void
}

export function PropCard({ title, validity = 'Validity: 3 Days', dailyCap = 'Daily Energy Cap +50%', icon, onPurchase }: PropCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-[160px] h-[208px] rounded-[12px]"
    >
      <div
        className="absolute inset-0 rounded-[12px]"
        style={{
          background: '#432A85',
          border: '1px solid #6E6E6E'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-between h-full p-3 w-full">
      <div className='w-[144px] h-[154px] flex flex-col items-center rounded-[12px]  bg-[linear-gradient(0deg,#221A4C,#221A4C),linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)]'>
          <div className="w-16 h-16  flex items-center justify-center text-2xl overflow-hidden">
          {icon ? (
            <Image src={icon} alt={title} width={64} height={64} />
          ) : (
            <span role="img" aria-label="gift">道具</span>
          )}
        </div>

        <div className="text-center">
          <div className="text-white font-jersey-10 text-[20px]">{title}</div>
          <div className="text-[#B2B2B2] font-exo2 text-[10px]  mt-1">{validity}</div>
          <div className="text-[#B2B2B2] font-exo2 text-[10px]">{dailyCap}</div>
        </div>
      </div>

        <button
          className="mt-2 w-[144px] h-[34px] rounded-[8px] bg-[linear-gradient(0deg,#221A4C,#221A4C),linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)]  text-white font-jersey-25 text-[16px] transition-all shadow-lg"
          onClick={onPurchase}
        >
          purchase
        </button>
      </div>
    </motion.div>
  )
}