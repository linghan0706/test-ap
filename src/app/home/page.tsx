'use client'

import { motion } from 'framer-motion'

export default function HomePage() {


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden pb-20">
      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6">
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-2xl font-bold mb-4">个人中心</h1>
          <p className="text-gray-400">个人中心功能开发中...</p>
        </motion.div>
      </div>
    </div>
  )
}