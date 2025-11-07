'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type TabKey = 'raffle' | 'collector'

export default function StoreTabs() {
  const router = useRouter()
  const search = useSearchParams()
  const pathname = usePathname()

  const current: TabKey = (search.get('tab') as TabKey) || 'raffle'

  const setTab = (key: TabKey) => {
    const params = new URLSearchParams(search.toString())
    params.set('tab', key)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between select-none w-full -mt-[3px]">
        <div
          onClick={() => setTab('raffle')}
          className={`font-jersey-10  font-[24px] uppercase leading-[22px] tracking-wide text-white ${
            current === 'raffle' ? 'opacity-100' : 'opacity-70 hover:opacity-90'
          }`}
          style={{ textShadow: '0 0 4px #6B0AE9' }}
        >
          <span className="ml-[24px] text-[22px] font-jersey-10 leading-[22px] whitespace-nowrap">Raffle Ticket</span>
        </div>
        <div
          onClick={() => setTab('collector')}
          className={`font-jersey-10  font-[24px] uppercase leading-[22px] tracking-wide text-white ${
            current === 'collector' ? 'opacity-100' : 'opacity-70 hover:opacity-90'
          }`}
          style={{ textShadow: '0 0 4px #6B0AE9' }}
        >
          <span className="ml-[40px] text-[20px] font-jersey-10 leading-[22px] whitespace-nowrap">Automatic Collector</span>
        </div>
      </div>
    </div>
  )
}