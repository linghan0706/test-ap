'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'


import Image from 'next/image'

interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { id: 'task', label: '待办事项', path: '/task', icon: '/components/layout/NavIcon/TaskIcon.png' },
  { id: 'store', label: '购物袋', path: '/store', icon: '/components/layout/NavIcon/StoreIcon.png' },
  { id: 'base', label: '火箭', path: '/base', icon: '/components/layout/NavIcon/RocketIcon.png', isCenter: true },
  { id: 'backpack', label: '包裹', path: '/backpack', icon: '/components/layout/NavIcon/Backpack.png' },
  { id: 'home', label: '个人中心', path: '/home', icon: '/components/layout/NavIcon/HomeIcon.png' },
]
export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div 
      className="w-full h-[60px] flex items-center px-6 relative"
    >
      {/* SVG 背景 */}
      <svg 
        className="absolute inset-0 w-full h-full z-0" 
        viewBox="0 0 393 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <foreignObject x="-4" y="-4" width="401" height="68">
          <div 
            style={{
              backdropFilter: 'blur(2px)',
              clipPath: 'url(#bgblur_0_2824_15_clip_path)',
              height: '100%',
              width: '100%'
            }}
          />
        </foreignObject>
        <path 
          data-figma-bg-blur-radius="4" 
          d="M155.386 0C160.414 0.000211198 164 4.97163 164 10C164 28.2254 178.775 43 197 43C215.225 43 230 28.2254 230 10C230 4.97163 233.586 0.000221256 238.614 0H385C389.418 0 393 3.58172 393 8V52C393 56.4183 389.418 60 385 60H8C3.58172 60 0 56.4183 0 52V8C0 3.58172 3.58172 0 8 0H155.386Z" 
          fill="url(#paint0_linear_2824_15)" 
          fillOpacity="0.8"
        /> 
        <defs> 
          <clipPath id="bgblur_0_2824_15_clip_path" transform="translate(4 4)">
            <path d="M155.386 0C160.414 0.000211198 164 4.97163 164 10C164 28.2254 178.775 43 197 43C215.225 43 230 28.2254 230 10C230 4.97163 233.586 0.000221256 238.614 0H385C389.418 0 393 3.58172 393 8V52C393 56.4183 389.418 60 385 60H8C3.58172 60 0 56.4183 0 52V8C0 3.58172 3.58172 0 8 0H155.386Z"/> 
          </clipPath>
          <linearGradient id="paint0_linear_2824_15" x1="384.79" y1="50" x2="94.2339" y2="-139.69" gradientUnits="userSpaceOnUse"> 
            <stop stopColor="#182253"/> 
            <stop offset="1" stopColor="#2B1753"/> 
          </linearGradient> 
        </defs> 
      </svg>
      <div className="flex items-center justify-between h-full w-full relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/base' && pathname === '/')
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex items-center justify-center transition-all duration-300 ${
                item.isCenter 
                  ? 'w-[49px] h-[49px] rounded-full -translate-y-5' 
                  : 'w-12 h-12'
              }`}
              style={item.isCenter ? {
                background: 'linear-gradient(275.69deg, #182253 3.41%, #2B1753 99.3%)'
              } : {}}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {/* 图标容器 */}
              <div className={`relative flex items-center justify-center ${
                item.isCenter ? 'w-10 h-10' : 'w-10 h-10'
              }`}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={40}
                  height={40}
                  className={`
                    transition-all duration-300 ease-in-out
                    ${isActive 
                      ? 'brightness-100 saturate-100' 
                      : 'brightness-50 saturate-50 hover:brightness-75 hover:saturate-75'
                    }
                    ${item.isCenter ? 'filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
                  `}
                  style={{ 
                    width: 'auto',
                    height: 'auto'
                  }}
                />
                
                {/* 激活状态的光晕效果 
                *采用径向渐变和模糊滤镜来实现
                */}
                {isActive && !item.isCenter && (
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(29, 78, 216, 0.1) 100%)',
                      filter: 'blur(6px)',
                      zIndex: -1,
                      transform: 'scale(1.2)'
                    }}
                    animate={{ 
                      opacity: [0.6, 0.9, 0.6],
                      scale: [1.1, 1.3, 1.1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>
              
              {/* 中心火箭图标的蓝色光晕效果 */}
              {item.isCenter && (
                <>
                  {/* 底部蓝色光晕渐变 */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded-full opacity-60"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 50%, transparent 100%)',
                      filter: 'blur(8px)'
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* 圆形容器的呼吸效果 */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-slate-500/30 "
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.4)',
                        '0 0 0 8px rgba(59, 130, 246, 0.1)',
                        '0 0 0 0 rgba(59, 130, 246, 0.4)'
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}