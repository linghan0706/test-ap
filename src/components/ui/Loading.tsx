'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useLayoutManager } from '@/hooks/Guider'

// 引导页面样式配置接口
interface StyleConfig {
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  color?: string
  background?: string
  backgroundClip?: string
  WebkitBackgroundClip?: string
  WebkitTextFillColor?: string
  width?: string
  height?: string
  display?: string
  alignItems?: string
  textAlign?: string
  textFillColor?: string
  flex?: string
  order?: number
  flexGrow?: number
}

// 引导页面数据接口
interface GuidancePageData {
  id: number
  icon: string
  title: string
  subtitle?: string
  description: string
  styles?: {
    mainTitle?: StyleConfig
    subTitle?: StyleConfig
  }
}

// 引导页面数据
const guidancePages: GuidancePageData[] = [
  {
    id: 1,
    icon: '/LoadingIcon/CionOne.png',
    title: 'Welcome to',
    subtitle: 'NovaExplorer',
    description: 'Collect energy and search for spaceship parts',
    styles: {
      mainTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '58px',
        color: '#FFFFFF',
        width: '298px',
        height: '29px',
      },
      subTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '48px',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%), #FFFFFF',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        width: '258px',
        height: '48px',
      },
    },
  },
  {
    id: 2,
    icon: '/LoadingIcon/CionTwo.png',
    title: '',
    subtitle: 'Blue Star',
    description: 'Collect energy and search for spaceship parts',
    styles: {
      subTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '58px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), #FFFFFF',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        width: '174px',
        height: '58px',
        flex: 'none',
        order: 0,
        flexGrow: 0,
      },
    },
  },
  {
    id: 3,
    icon: '/LoadingIcon/CionThree.png',
    title: '',
    subtitle: 'Solar System',
    description: 'Roam the planets and explore the mysteries',
    styles: {
      subTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '58px',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%), #FFFFFF',
        width: '246px',
        height: '58px',
      },
    },
  },
  {
    id: 4,
    icon: '/LoadingIcon/CionFour.png',
    title: '',
    subtitle: 'Galaxy',
    description: 'Traverse the wormholes and challenge the unknown',
    styles: {
      subTitle: {
        fontFamily: "'Jersey 25', monospace",
        fontSize: '54px',
        lineHeight: '54px',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%), #FFFFFF',
        width: '143px',
        height: '54px',
      },
    },
  },
  {
    id: 5,
    icon: '/LoadingIcon/CionFive.png',
    title: '',
    subtitle: 'Infinite Universe',
    description: 'Time-space Jump, Become a Legend',
    styles: {
      subTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '58px',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%), #FFFFFF',
        width: '307px',
        height: '58px',
      },
    },
  },
  {
    id: 6,
    icon: '/LoadingIcon/CionSix.png',
    title: 'Star—Universe',
    subtitle: 'UNI Heart NFT',
    description: 'your legend, eternally written in the cosmos',
    styles: {
      mainTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '58px',
        color: '#FFFFFF',
        width: '298px',
        height: '29px',
      },
      subTitle: {
        fontFamily: "'Jersey 10', monospace",
        fontSize: '54px',
        lineHeight: '48px',
        background:
          'linear-gradient(90deg, #1EDDD6 0%, #34E37A 19.8%, #47F04F 36.43%, #81E73B 52.69%, #BAE25B 75.48%, #E377DA 94.23%), linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%), #FFFFFF',
        width: '255px',
        height: '48px',
      },
    },
  },
]
{
  /**
   *加载获取用户数据
   *
   *
   */
}

// 样式映射函数
const getStyleForElement = (
  pageData: GuidancePageData,
  elementType: 'mainTitle' | 'subTitle'
) => {
  const styleConfig = pageData.styles?.[elementType]
  if (!styleConfig) return {}

  const baseStyle: React.CSSProperties = {
    fontFamily: styleConfig.fontFamily,
    fontSize: styleConfig.fontSize,
    lineHeight: styleConfig.lineHeight,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center' as const,
  }

  // 处理背景渐变样式
  if (styleConfig.background) {
    return {
      ...baseStyle,
      background: styleConfig.background,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }
  }

  // 处理纯色样式
  if (styleConfig.color) {
    return {
      ...baseStyle,
      color: styleConfig.color,
    }
  }

  return baseStyle
}

interface LoadingProps {
  onComplete?: () => void
}

export default function Loading({ onComplete }: LoadingProps) {
  // 初始化为1，这样第二个进度条（index=1）会在进入时点亮
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 布局管理器的ref引用
  const containerRef = useRef<HTMLDivElement>(null)
  const mainIconRef = useRef<HTMLDivElement>(null)
  const titleAreaRef = useRef<HTMLDivElement>(null)
  const svgElementRef = useRef<SVGSVGElement>(null)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const touchStartTimeRef = useRef(0)

  // 使用布局管理器 - 目前仅用于ref管理
  useLayoutManager({
    containerRef,
    mainIconRef,
    titleAreaRef,
    svgElementRef,
  })

  // 确保从id为1的数据开始加载引导页内容
  // currentPage为1时显示第一个引导页数据（guidancePages[0]）
  const currentData = guidancePages[currentPage - 1]

  const handleNext = () => {
    // currentPage从1开始，最大值为6（对应guidancePages.length）
    if (currentPage < guidancePages.length && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsTransitioning(false)
      }, 500) // 增加过渡时间以配合CSS动画
    } else if (currentPage === guidancePages.length) {
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const handleDotClick = (index: number) => {
    // 不允许点击第一个进度条（index=0），因为它代表InitialLoading
    // 只允许点击从第二个开始的进度条（index>=1）
    if (index >= 1 && index !== currentPage && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(index)
        setIsTransitioning(false)
      }, 500) // 增加过渡时间以配合CSS动画
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    touchStartXRef.current = t.clientX
    touchStartYRef.current = t.clientY
    touchStartTimeRef.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartXRef.current
    const dy = t.clientY - touchStartYRef.current
    const dt = Date.now() - touchStartTimeRef.current
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60 && dt < 1000) {
      if (dx < 0) handleNext()
      else handlePrev()
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden"
      data-layout-key="main-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 背景装饰星星 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 73) % 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* 主要内容容器 */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center">
        {/* 主图标区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            ref={mainIconRef}
            className="relative mb-8"
            data-layout-key="element-0"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* 主图标容器 - 只包含图标，确保横向居中 */}
            <div className="relative w-80 h-64 flex items-center justify-center mx-auto ">
              <motion.div
                className="relative"
                style={{ marginTop: '28px' }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src={currentData.icon}
                  alt={currentData.title}
                  width={320}
                  height={240}
                  className="object-contain drop-shadow-2xl"
                  style={{
                    width: 'auto',
                    height: 'auto',
                  }}
                  priority
                />
              </motion.div>
            </div>

            {/* 底盘容器（用于左右箭头定位） */}
            <div
              className="relative flex justify-center mt-3 mb-4 h-10"
              style={{ width: '361px' }}
            >
              <motion.button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-80 hover:opacity-100 transition"
                onClick={handlePrev}
                disabled={currentPage === 1}
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                aria-label="Previous"
              >
                <Image
                  src="/button/right.svg"
                  alt="Previous"
                  width={19}
                  height={19}
                  style={{ transform: 'scaleX(-1)' }}
                />
              </motion.button>

              <motion.button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-80 hover:opacity-100 transition"
                onClick={handleNext}
                aria-label="Next"
              >
                <Image
                  src="/button/right.svg"
                  alt="Next"
                  width={19}
                  height={19}
                />
              </motion.button>
            </div>

            <Image
              src="/button/footer.svg"
              alt="Footer"
              width={378}
              height={40}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* 标题区域 - 固定高度容器 */}
        <div
          ref={titleAreaRef}
          className="text-center mb-6 relative"
          data-layout-key="element-1"
          style={{ height: '140px' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${currentPage}`}
              className="absolute inset-0 flex flex-col justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* 主标题和副标题组合容器 - 固定高度 */}
              <div
                className="flex flex-col justify-center items-center"
                style={{ height: '80px', marginBottom: '12px' }}
              >
                {/* 主标题 */}
                {currentData.title && (
                  <motion.h1
                    style={getStyleForElement(currentData, 'mainTitle')}
                    className="flex justify-center items-center leading-none mb-1 whitespace-nowrap"
                  >
                    {currentData.title}
                  </motion.h1>
                )}

                {/* 副标题 */}
                {currentData.subtitle && (
                  <motion.h2
                    style={getStyleForElement(currentData, 'subTitle')}
                    className="flex justify-center items-center leading-none whitespace-nowrap"
                  >
                    {currentData.subtitle}
                  </motion.h2>
                )}
              </div>

              {/* 描述文本容器 - 固定高度，支持换行 */}
              <div
                className="flex justify-center items-start px-4"
                style={{ height: '48px', width: '285px' }}
              >
                <motion.p
                  className="text-gray-300 text-sm leading-relaxed text-center break-words"
                  style={{
                    maxWidth: '285px',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentData.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 页面指示器 */}
        <motion.div
          className="flex justify-center items-center space-x-2.5 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            width: '106px',
            height: '6px',
            gap: '10px',
          }}
        >
          {/* 创建7个进度条：1个InitialLoading + 6个引导页 */}
          {Array.from({ length: 7 }, (_, index) => {
            // 第一个进度条代表InitialLoading，永远保持灰色圆点状态
            if (index === 0) {
              return (
                <div
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#878787',
                    flex: 'none',
                    transform: 'scale(1)',
                  }}
                />
              )
            }
            // 当前激活的进度条显示为长条样式
            else if (index === currentPage) {
              return (
                <div
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '26px',
                    height: '6px',
                    background:
                      'linear-gradient(172.02deg, #EE3BA7 -21.97%, #B448FB 99.02%)',
                    borderRadius: '20px',
                    flex: 'none',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                  }}
                />
              )
            }
            // 其他进度条为圆形样式
            else {
              return (
                <motion.button
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '6px',
                    height: '6px',
                    // 已经完成的页面显示为激活的粉色圆点，未完成的显示为灰色
                    background: currentPage > index ? '#EE3BA7' : '#878787',
                    flex: 'none',
                    cursor: 'pointer',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                  }}
                  onClick={() => handleDotClick(index)}
                  whileHover={{
                    scale: 1.3,
                    transition: { duration: 0.2, ease: 'easeOut' },
                  }}
                  whileTap={{
                    scale: 0.8,
                    transition: { duration: 0.1, ease: 'easeOut' },
                  }}
                  animate={{
                    scale: currentPage > index ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                />
              )
            }
          })}
        </motion.div>

        {/* 底部按钮区域 */}
        <motion.div
          className="flex justify-center w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* id：6，显示Enter按钮 */}
          {currentData.id === 6 ? (
            <motion.button
              className="text-white font-medium text-sm transition-all duration-300"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px 10px',
                gap: '4px',
                width: '141px',
                height: '30px',
                background:
                  'linear-gradient(156.71deg, #6B0AE9 2.78%, #6410B1 99.22%)',
                borderRadius: '8px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Enter
            </motion.button>
          ) : null}
        </motion.div>
      </div>

      {/* 装饰性粒子效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 2) % 20}px`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + (i % 2),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  )
}
