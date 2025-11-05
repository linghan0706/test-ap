'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import backImage from '@/public/backImage.png'
import storeImage from '@/public/storeImage.png'
import AssetRedemption from '@/components/storeCard/AssetRedemption'
import StoreTabs from '@/components/storeCard/StoreTabs'
import RaffleTicketGrid from '@/components/storeCard/RaffleTicketGrid'
import AutomaticCollectorGrid from '@/components/storeCard/AutomaticCollectorGrid'

export default function StorePage() {
  const search = useSearchParams()
  const tab = (search.get('tab') as 'raffle' | 'collector') || 'raffle'

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
            WebkitBackdropFilter: 'blur(15px)'
          }}
        ></div>
      </div>

      <div className="relative z-10 px-4">
        <div className="flex flex-col items-center pt-3 sm:pt-6 space-y-2 sm:space-y-3">
          <h1 className="font-jersey-25 text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] text-white font-normal tracking-wide text-center">
            store
          </h1>
          <p className="font-jersey-25 text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-center text-[#B2B2B2] font-normal">
            redeem props and resources
          </p>
        </div>
          {/* 资产兑换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4"
        >
          <AssetRedemption />
        </motion.div>
 
        <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto mt-6 sm:mt-8">
          <div className="font-jersey-10 text-white text-[36px] leading-[22px] sm:text-[24px] text-center">Prop Store</div>
        </div>
          {/* 外层包裹 */}
        <div
          className=" w-[361px]  max-w-[380px] sm:max-w-[400px] mx-auto mt-[20px] sm:mt-3 p-5 sm:p-6 bg-[linear-gradient(112.89deg,#6B0AE9_17.11%,#6410B1_83.06%)] overflow-y-auto max-h-[calc(100vh-260px)] sm:max-h-[calc(100vh-280px)]"
          style={{
            // backgroundImage: `linear-gradient(112.89deg, rgba(107,10,233,0.85) 17.11%, rgba(100,16,177,0.85) 83.06%), url(${storeImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0px 4px 9.6px rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.10)'
          }}
        >
          {/* 导航栏切换 */}
          <div className="flex flex-col items-center">
            <StoreTabs />
          </div>


          <div className="mt-4 sm:mt-6">
            {tab === 'raffle' ? <RaffleTicketGrid /> : <AutomaticCollectorGrid />}
          </div>
        </div>
      </div>
    </div>
  )
}