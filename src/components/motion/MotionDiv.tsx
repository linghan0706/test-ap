'use client'

import { motion } from 'framer-motion'
import type { HTMLAttributes } from 'react'
import type { MotionProps } from 'framer-motion'

export default function MotionDiv(
  props: MotionProps & HTMLAttributes<HTMLDivElement>
) {
  return <motion.div {...props} />
}
