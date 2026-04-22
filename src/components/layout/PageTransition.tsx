import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeIn, ZERO_DURATION } from '@/lib/motion'

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={shouldReduceMotion ? ZERO_DURATION : undefined}
    >
      {children}
    </motion.div>
  )
}
