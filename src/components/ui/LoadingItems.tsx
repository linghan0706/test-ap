'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

interface LoadingItemProps {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

const LoadingItems = memo(function LoadingItems({ 
  id, 
  icon, 
  title, 
  description, 
  delay = 0 
}: LoadingItemProps) {
  return (
    <motion.div
      key={id}
      className="flex flex-col items-center text-center space-y-2 p-4"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {/* 图标容器 - 增强动画效果 */}
      <motion.div
        className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)',
          borderColor: 'rgba(255,255,255,0.3)'
        }}
        animate={{
          boxShadow: [
            '0 0 10px rgba(147, 51, 234, 0.2)',
            '0 0 20px rgba(59, 130, 246, 0.3)',
            '0 0 10px rgba(147, 51, 234, 0.2)',
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity },
          default: { duration: 0.2 }
        }}
      >
        <motion.div 
          className="text-2xl"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      {/* 标题 - 渐入动画 */}
      <motion.h3
        className="text-white text-lg font-semibold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        whileHover={{ 
          color: '#60A5FA',
          transition: { duration: 0.2 }
        }}
      >
        {title}
      </motion.h3>
      
      {/* 描述 - 渐入动画 */}
      <motion.p
        className="text-slate-300 text-sm max-w-xs leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4, duration: 0.4 }}
        whileHover={{ 
          color: '#CBD5E1',
          transition: { duration: 0.2 }
        }}
      >
        {description}
      </motion.p>

      {/* 底部装饰线 */}
      <motion.div
        className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 32, opacity: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.5 }}
        whileHover={{ 
          width: 48,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  )
})

export default LoadingItems