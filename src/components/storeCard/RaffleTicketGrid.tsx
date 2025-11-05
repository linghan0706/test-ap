'use client'

import { PropCard } from './PropCard'

interface GridItem { title: string; validity_period?: number; ceiling?: number; icon?: string }
interface RaffleTicketGridProps {
  items?: GridItem[]
  loading?: boolean
  emptyMessage?: string
}

export default function RaffleTicketGrid({
  items = [
    { title: 'Primary', validity_period: 3, ceiling: 50, icon: '/automaticcollector/primary.png' },
    { title: 'Intermediate', validity_period: 3, ceiling: 50, icon: '/automaticcollector/intermediate.png' },
    { title: 'Advanced', validity_period: 3, ceiling: 50, icon: '/automaticcollector/advanced.png' },
    { title: 'Super', validity_period: 3, ceiling: 50, icon: '/automaticcollector/super.png' },
  ],
  loading = false,
  emptyMessage = 'No tickets available'
}: RaffleTicketGridProps) {
  return (
    <div
      role="grid"
      aria-busy={loading}
      className="grid grid-cols-2 justify-items-center gap-x-4 sm:gap-x-6 gap-y-5 sm:gap-y-8 w-full max-w-[380px] sm:max-w-[400px] mx-auto px-1"
    >
      {loading && (
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="w-full h-[170px] sm:h-[180px] rounded-[16px] border border-white/10 bg-white/10 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            aria-hidden
          />
        ))
      )}

      {!loading && items.length === 0 && (
        <div className="col-span-full text-center text-white/85 font-jersey-25 text-[16px] sm:text-[18px] py-5 rounded-[12px] border border-white/10 bg-gradient-to-br from-[#2A215D]/60 to-[#221A4C]/60">
          {emptyMessage}
        </div>
      )}

      {!loading && items.length > 0 && (
        items.map((item) => (
          <PropCard
            key={item.title}
            title={item.title}
            validity={`Validity: ${item.validity_period ?? 3} Days`}
            dailyCap={`Daily Energy Cap +${item.ceiling ?? 50}%`}
            icon={item.icon}
          />
        ))
      )}
    </div>
  )
}