import React from 'react'

export type SelectOption = {
  label: string
  value: string
}

export type SelectItem = {
  name: string
  quantity: number
  icon?: React.ReactNode
}

export type CategoryValue = 'all' | 'stage' | 'collector' | 'other'

export type SelectCardProps = {
  options?: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

/**
 * SelectCard
 * - 结合 UI 设计的选择卡片，提供分段选择交互
 * - 默认选项：All / Stage / Collector / Other
 */
const defaultOptions: SelectOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Stage', value: 'stage' },
  { label: 'Collector', value: 'collector' },
  { label: 'Other', value: 'other' },
]

const defaultItemsByCategory: Record<CategoryValue, SelectItem[]> = {
  all: [
    { name: 'Nose Section', quantity: 1 },
    { name: 'Landing Gear', quantity: 1 },
    { name: 'Horizontal Stabilizer', quantity: 1 },
    { name: 'Propulsion System', quantity: 1 },
    { name: 'Vertical Stabilizer', quantity: 1 },
    { name: 'Wings', quantity: 1 },
    { name: 'PropulsionSystem', quantity: 1 },
    { name: 'Raffle Ticket', quantity: 1 },
    { name: 'Auto Collector', quantity: 1 },
  ],
  stage: [
    { name: 'Nose Section', quantity: 1 },
    { name: 'Landing Gear', quantity: 1 },
    { name: 'Horizontal Stabilizer', quantity: 1 },
  ],
  collector: [
    { name: 'Auto Collector', quantity: 1 },
    { name: 'Raffle Ticket', quantity: 1 },
  ],
  other: [
    { name: 'Propulsion System', quantity: 1 },
  ],
}

const SelectCard: React.FC<SelectCardProps> = ({
  options = defaultOptions,
  value = options[0]?.value,
  onChange,
  className,
  children,
}) => {
  // 当前选中的选项
  const [itemSelected, setItemSelected] = React.useState(false)
  const currentItem = React.useMemo(() => {
    const items = defaultItemsByCategory[(value as CategoryValue)] ?? []
    return items[0]
  }, [value])
  return (
    <section
      className={
        [
          'w-full max-w-[361px] rounded-[12px]',
          'flex flex-col gap-3',
          'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
          className ?? '',
        ].join(' ')
      }
   
      aria-label="Select card"
      data-testid="select-card"
    >
      {/* 选择器 */}
      <div
        role="tablist"
        aria-label="Select category"
        className="w-full max-w-[361px] h-[37px] rounded-[14px] bg-[rgba(15,21,43,0.5)] flex items-center justify-center gap-3"
        data-testid="select-category-tablist"
      >
        {options.map((opt) => {
          const selected = opt.value === value
          return (
            <button
              key={opt.value}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange?.(opt.value)}
              data-testid={`select-option-${opt.value}`}
              className={[
                // 基础样式：固定尺寸避免回流
                'min-w-[80px] h-[29px] rounded-[43px] inline-flex items-center justify-center font-exo2 font-medium text-[14px] leading-[23px] text-center',
                'transition-transform transition-opacity duration-300 ease-[cubic-bezier(.22,.61,.36,1)]',
                'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                selected
                  ? 'text-white bg-[linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)] scale-100 opacity-100'
                  : 'text-[#90A1B9] bg-transparent scale-95 opacity-90',
              ].join(' ')}
              style={{ willChange: 'transform, opacity', touchAction: 'manipulation' }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <div data-testid="select-card-items-parent" className="mt-[1px]">
        <div
          data-testid="select-card-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {(children || currentItem) && (
            <div
              role="button"
              tabIndex={0}
              aria-pressed={itemSelected}
              onClick={() => setItemSelected((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setItemSelected((v) => !v)
                }
              }}
              className={[
                'group w-[115px] h-[149px] rounded-[12px] bg-transparent',
                'flex flex-col items-center gap-[10px] select-none',
                'transition-transform duration-200 ease-[cubic-bezier(.22,.61,.36,1)]',
                'hover:translate-y-[1px] active:scale-[0.98]',
                itemSelected ? 'ring-2 ring-[#6B0AE9]/80 ring-offset-0' : 'ring-0',
              ].join(' ')}
              data-testid="select-card-item"
            >
              {/* 图标卡片 */}
              <div className="w-[99px] h-[100px] bg-[#221A4C] rounded-[12px] flex flex-col items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
                <div className="w-[64px] h-[64px] mt-[12px] overflow-hidden flex items-center justify-center">
                  {children ?? currentItem?.icon ?? null}
                </div>
                {/* 物品名称 */}
                <div className="mt-[6px] font-exo2 text-white text-[12px] leading-[18px] text-center" data-testid="select-card-item-name">
                  {typeof children === 'string' ? children : (currentItem?.name ?? 'Item')}
                </div>
              </div>
              <div
                className={[
                  'w-[99px] h-[32px] rounded-[8px] flex flex-col justify-center items-center p-[6px]',
                  'bg-[linear-gradient(156.71deg,#6B0AE9_2.78%,#6410B1_99.22%)]',
                  'shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-opacity duration-200',
                  itemSelected ? 'opacity-100' : 'opacity-95 group-hover:opacity-100',
                ].join(' ')}
                data-testid="select-card-quantity"
              >
                <span className="font-jersey-25 text-white text-[16px] leading-[22px] text-center">X{currentItem?.quantity ?? 1}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SelectCard