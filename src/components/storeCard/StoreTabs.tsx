'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

type TabKey = 'raffle' | 'collector'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'raffle', label: 'Raffle Ticket' },
  { key: 'collector', label: 'Automatic Collector' },
]

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
    <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto ">
      <div className="flex items-center justify-between select-none">
        {tabs.map((t) => {
          const active = current === t.key
          return (
            <motion.button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-jersey-10  font-[24px] uppercase leading-[22px] tracking-wide text-white ${
                active ? 'opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
              style={{
                textShadow: '0 0 4px #6B0AE9'
              }}
              whileHover={{ skewX: active ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-[24px] font-jersey-10 leading-[22px] whitespace-nowrap">{t.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}