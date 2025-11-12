'use client'

import Image from 'next/image'

type TostoreBuyProps = {
  visible?: boolean
  onCancel?: () => void
  onConfirm?: () => void
  className?: string
}

export default function TostoreBuy({
  visible = true,
  onCancel,
  onConfirm,
  className = '',
}: TostoreBuyProps) {
  if (!visible) return null
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="tostorebuy-title"
      className={[
        'relative w-[317px] h-[277px] rounded-[12px]',
        'flex flex-col items-center p-4 gap-[12px]',
        'bg-[#0F172B] overflow-hidden',
        className,
      ].join(' ')}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/Popup/taskupback.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center">
        <h2
          id="tostorebuy-title"
          className="font-jersey-10 text-white text-[20px] leading-[22px] text-center w-[288px] h-[22px]"
        >
          Are you going to the store to buy
        </h2>
      </div>

      <div className="relative z-10 flex-1 w-full flex items-center justify-center">
        <Image
          src="/backpack/buy/store_buy.svg"
          alt="Store Buy"
          width={157}
          height={157}
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-10 w-full px-2 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-row justify-center items-center font-jersey-10 py-1 px-[10px] gap-[4px] w-[138px] h-[30px] bg-white rounded-[8px] text-black text-[14px] font-medium"
        >
          cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex flex-row justify-center items-center font-jersey-10 rounded-[8px] text-white text-[14px] font-medium"
          style={{
            padding: '4px 10px',
            gap: '4px',
            width: '141px',
            height: '30px',
            background:
              'linear-gradient(156.71deg, #84D947 2.78%, #39A740 99.22%), linear-gradient(156.71deg, #1688EE 2.78%, #00B6DD 99.22%)',
          }}
        >
          Confirm
        </button>
      </div>
    </section>
  )
}
