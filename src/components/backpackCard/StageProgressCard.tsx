import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'


type Size2D = { w: number; h: number }
type OrbitRadii = { rx: number; ry: number }
type PartBoxCoord = { x: number; y: number }

function computePartBoxSizes(
  parts: Array<{ installed?: boolean }>,
  installedSize: Size2D = { w: 48, h: 65 },
  uninstalledSize: Size2D = { w: 48, h: 48 }
): Size2D[] {
  return parts.map((p) => (p?.installed ? installedSize : uninstalledSize))
}


function maxBoxSize(sizes: Size2D[], partBoxSize: { width: number; height: number }): Size2D {
  const maxW = Math.max(...sizes.map((s) => s.w), partBoxSize.width)
  const maxH = Math.max(...sizes.map((s) => s.h), partBoxSize.height)
  return { w: maxW, h: maxH }
}

/**
 * Compute orbit radii based on plane and box sizes and ring padding.
 * Pure function.
 */
function computeOrbitRadii(
  planeSize: { width: number; height: number },
  maxBox: Size2D,
  ringPadding: number
): OrbitRadii {
  return {
    rx: planeSize.width / 2 + maxBox.w / 2 + ringPadding,
    ry: planeSize.height / 2 + maxBox.h / 2 + ringPadding,
  }
}


function angleForIndex(i: number, startAngleDeg: number, N: number): number {
  const rad = Math.PI / 180
  return (startAngleDeg + (i * 360) / N) * rad
}


function clampToContainer(
  left: number,
  top: number,
  w: number,
  h: number,
  cw: number,
  ch: number
): { left: number; top: number } {
  const clampedLeft = Math.max(0, Math.min(cw - w, Math.round(left)))
  const clampedTop = Math.max(0, Math.min(ch - h, Math.round(top)))
  return { left: clampedLeft, top: clampedTop }
}


function computePartCoordinates(params: {
  cardWidth: number
  cardHeight: number
  planeSize: { width: number; height: number }
  sizes: Size2D[]
  startAngleDeg: number
  radii: OrbitRadii
}): PartBoxCoord[] {
  const { cardWidth: cw, cardHeight: ch, sizes, startAngleDeg, radii } = params
  const cx = cw / 2
  const cy = ch / 2
  const N = sizes.length
  return sizes.map((s, i) => {
    const angle = angleForIndex(i, startAngleDeg, N)
    const centerX = cx + radii.rx * Math.cos(angle)
    const centerY = cy + radii.ry * Math.sin(angle)
    const left = centerX - s.w / 2
    const top = centerY - s.h / 2
    const clamped = clampToContainer(left, top, s.w, s.h, cw, ch)
    return { x: clamped.left, y: clamped.top }
  })
}

/** Runtime validation helpers */
function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

function validateCoordinates(coords: PartBoxCoord[], cw: number, ch: number): PartBoxCoord[] {
  return coords.map((p) => {
    const x = isFiniteNumber(p.x) ? p.x : 0
    const y = isFiniteNumber(p.y) ? p.y : 0
    return {
      x: Math.max(0, Math.min(cw, Math.round(x))),
      y: Math.max(0, Math.min(ch, Math.round(y))),
    }
  })
}

function toLeftTop(coords: PartBoxCoord[]): Array<{ left: number; top: number }> {
  return coords.map((c) => ({ left: c.x, top: c.y }))
}

export type StageProgressCardProps = {
  title?: string
  imageSrc?: string
  className?: string
  children?: React.ReactNode
  /** 顶部右侧徽章文本（Frame 429） */
  badgeText?: string
  /** 是否显示顶部右侧徽章 */
  showBadge?: boolean
  /** 零件盒子数据：用于环绕飞机主体均匀分布 */
  parts?: Array<{ label: string; iconSrc?: string; installed?: boolean }>
  /** 零件盒子尺寸（默认：112×112） */
  partBoxSize?: { width: number; height: number }
  /** 起始角度（度），默认 -90 从顶部开始，随后均匀分布 */
  startAngleDeg?: number
  /** 飞机外扩的环形间距（避免与飞机相交），默认 12 */
  ringPadding?: number
}

// Stable default parts to avoid new array creation each render
const DEFAULT_PARTS: Array<{ label: string; iconSrc?: string; installed?: boolean }> = [
  { label: 'Horizontal\nStabilizer' },
  { label: 'Vertical\nStabilizer' },
  { label: 'Landing\nGear' },
]

// 零件盒子图标元数据
type PartItemMeta = { iconSrc: string; label: string }
const PART_ITEM_META: Record<number, PartItemMeta> = {
  // Known asset present in public/backpack/Part/verticalstabilizer.svg
  1: { iconSrc: '/backpack/part/vertical_stabilizer.svg', label: 'Vertical Stabilizer' },
}

function getPartItemMeta(
  id: number | undefined,
  fallback: { iconSrc?: string; label?: string }
): { iconSrc?: string; label: string } {
  if (!id) return { iconSrc: fallback.iconSrc, label: fallback.label ?? 'Unknown' }
  const meta = PART_ITEM_META[id]
  if (meta) return meta
  return { iconSrc: fallback.iconSrc, label: fallback.label ?? 'Unknown' }
}

const StageProgressCard: React.FC<StageProgressCardProps> = ({
  title = 'Stage Progress',
  imageSrc = '/backpack/StageProgress.svg',
  className,
  children,
  badgeText = 'Blue Star',
  showBadge = true,
  parts = DEFAULT_PARTS,
  partBoxSize = { width: 112, height: 112 },
  startAngleDeg = -90,
  ringPadding = 12,
}) => {
  // 通过容器宽度实现横向响应式缩放，使绝对定位在不同屏幕下保持比例
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [cardWidth, setCardWidth] = useState<number>(336)
  const [cardHeight, setCardHeight] = useState<number>(345)
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const update = () => {
      setCardWidth(el.clientWidth || 361)
      setCardHeight(el.clientHeight || 413)
    }
    update()
    // 监听容器尺寸变化
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
 
 // 零件盒子坐标（绝对定位），按每个盒子尺寸独立计算
 const PartCoordinate=[
  {id:1,x:200,y:10,active:true},
  {id:2,x:200,y:280,active:false},
  {id:3,x:0,y:0,active:false},
 ]
  // 零件盒子坐标（绝对定位），按每个盒子尺寸独立计算
  const partsInstalledSignature = useMemo(
    () => parts.map((p) => (p?.installed ? '1' : '0')).join('|'),
    // 如果父组件每次返回新数组，但 installed 不变，则 signature 稳定
    // 只在 installed 状态或长度变化时重新计算
    [parts]
  )

  const partRenderData = useMemo(() => {
    // 改为仅由 PartCoordinate 数组驱动数量与定位，并进行运行时校验
    const cw = cardWidth
    const ch = cardHeight
    const coords = PartCoordinate.map((c) => ({ x: c.x, y: c.y }))
    const safeCoords = validateCoordinates(coords, cw, ch)
    return toLeftTop(safeCoords)
  }, [cardWidth, cardHeight])
  return (
    <section
      className={[
        'flex flex-col items-center justify-center text-center',
        'w-full max-w-[361px] h-[413px]',
        'py-4 px-3 gap-[10px] rounded-[12px]',
        'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
        'bg-[#191A3F]',
        'border border-[#6B0AE9]',
        className ?? '',
      ].join(' ')}
      aria-label={title}
    >
      {/* 顶部左右布局：左侧标题 + 右侧徽章 */}
      <div className="w-full flex items-center justify-between box-border">
        <div className="w-[132px] h-[20px] font-jersey-10 font-normal text-[24px] leading-[20px] text-center text-white">
          {title}
        </div>
        {showBadge && (
          <div className="box-border flex flex-col justify-center items-center px-[8px] py-[6px] w-[75px] h-[26px] bg-[#5C17A6] rounded-[8px] flex-none order-1 font-exo2 font-medium text-[13px] leading-[14px] text-center text-white items-end">
            {badgeText}
          </div>
        )}
      </div>

      {/* 主体拼图容器 */}
      <div
        ref={cardRef}
        className="relative flex-1 flex items-center justify-center box-border w-[336px] h-[345px] rounded-[12px] border-3 b border-[#6B0AE9]"
      >
        {/* 飞机主体 */}
        <Image
          src={imageSrc}
          alt="Stage progress"
          width={220}
          height={226}
          priority
          className="w-[220px] h-[226px] rounded-[12px] object-contain"
        />

        {/* 零件盒子 */}
        {partRenderData.map((pos, idx) => {
          const item = parts[idx]
          const installed = !!PartCoordinate[idx]?.active
          if (installed) {
            const meta = getPartItemMeta(PartCoordinate[idx]?.id, { iconSrc: item?.iconSrc, label: item?.label })
            // 已存放零件：采用 installed 样式
            return (
              <div
                key={`part-${PartCoordinate[idx]?.id ?? idx}`}
                className="absolute box-border bg-[#1A242D] border border-[#A34CFF] shadow-[0px_4px_10.1px_8px_rgba(81,42,255,0.25),_inset_12px_12px_41.2px_rgba(102,13,197,0.25)] rounded-none rounded-tr-[8px] rounded-bl-[8px] flex items-center justify-center w-[48px] h-[65px] md:w-[50px] md:h-[69px]"
                style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
                data-testid={`part-box-installed-${PartCoordinate[idx]?.id ?? idx}`}
              >
                <div className="flex flex-col items-center p-0 gap-[2px] w-[40px] h-[53px]">
                  <div className="flex flex-row items-center p-0 w-[27px] h-[27px]">
                    {meta?.iconSrc ? (
                      <Image src={meta.iconSrc!} alt={meta.label} width={27} height={27} className="w-[27px] h-[27px] object-contain" />
                    ) : null}
                  </div>
                  <div className="w-[40px] h-[24px] font-jersey-10 font-normal text-[10px] leading-[12px] text-center text-white flex-none order-1 self-stretch grow-0 whitespace-pre-line">
                    {meta?.label}
                  </div>
                </div>
              </div>
            )
          }
          // 未存放：采用当前 Locked 样式
          return (
            <div
              key={`part-${PartCoordinate[idx]?.id ?? idx}`}
              className="group400-outer absolute w-[48px] h-[48px] md:w-[50px] md:h-[50px] bg-[rgba(26,36,45,0.6)] shadow-[0px_4px_10.1px_8px_rgba(81,42,255,0.25),_inset_12px_12px_41.2px_rgba(102,13,197,0.25)] rounded-none rounded-tr-[8px] rounded-bl-[8px] flex flex-col items-center justify-start"
              style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
              data-testid={`part-box-locked-${PartCoordinate[idx]?.id ?? idx}`}
            >
              {/* Vertical layout: icon top + text bottom; strict pixel sizes per spec */}
              {/* Icon area: 21x23 with #57378E background to match design tone */}
              <div
                className="locked-icon-area mt-[6px] w-[21px] h-[23px] rounded-[3px] flex items-center justify-center"
                aria-hidden="true"
              >
                <Image
                  src="/backpack/lock/locked.svg"
                  alt="Locked icon"
                  width={21}
                  height={23}
                  className="w-[21px] h-[23px] object-contain"
                />
              </div>

              {/* Text area: 29x12, Jersey 10, centered, color #57378E */}
              <div
                className="locked-text-area font-jersey-10 font-normal text-[12px] leading-[12px] text-[#57378E] w-[29px] h-[12px] mt-[4px] flex items-center justify-center text-center"
                aria-label="Locked"
              >
                Locked
              </div>
              <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="lockGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M0.5 0.5 H 39.5 A 8 8 0 0 1 47.5 8.5 V 47.5 H 8.5 A 8 8 0 0 1 0.5 39.5 V 0.5 Z"
                  fill="none"
                  stroke="#A34CFF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="18 12"
                  filter="url(#lockGlow)"
                />
              </svg>
            </div>
          )
        })}
      </div>

      {children}
    </section>
  )
}

export default StageProgressCard