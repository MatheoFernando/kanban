import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShimmerProps {
  children: ReactNode
  className?: string
}

export const Shimmer = ({ children, className }: ShimmerProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

export const ShimmerButton = ({ children, className }: ShimmerProps) => {
  return (
    <motion.button
      className={cn(
        "relative overflow-hidden rounded-lg px-4 py-2",
        "bg-gradient-to-r from-blue-500 to-purple-600",
        "text-white font-medium",
        "hover:from-blue-600 hover:to-purple-700",
        "transition-all duration-200",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  )
}

