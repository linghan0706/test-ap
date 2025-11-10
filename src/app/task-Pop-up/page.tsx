"use client"

import TaskupCard from '@/components/task_up/TaskupCard'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskPopupPage() {
  const [activeId, setActiveId] = useState<number>(1)
  const handleClick = () => setActiveId((prev) => (prev >= 3 ? 1 : prev + 1))
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5E32AC] via-[#3D1A78] to-[#1A0B2E] flex flex-col items-center justify-center gap-4 p-6">
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white transition"
      >
        切换卡片（当前：{activeId}）
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <TaskupCard activeId={activeId} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}