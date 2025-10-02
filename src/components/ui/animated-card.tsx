import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  isDragging?: boolean
  onClick?: () => void
}

export const AnimatedCard = ({ 
  children, 
  className, 
  delay = 0, 
  isDragging = false,
  onClick 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={!isDragging ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!isDragging ? { scale: 0.98 } : {}}
      className={cn(
        "relative overflow-hidden rounded-lg bg-white dark:bg-slate-800",
        "border border-slate-200 dark:border-slate-700",
        "shadow-sm hover:shadow-md dark:hover:shadow-slate-900/25",
        "transition-all duration-200 cursor-pointer",
        isDragging && "shadow-lg scale-105 rotate-2 z-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

