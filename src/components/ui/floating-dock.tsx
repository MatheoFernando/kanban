import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface FloatingDockItem {
  id: string
  icon: ReactNode
  label: string
  onClick: () => void
  isActive?: boolean
}

interface FloatingDockProps {
  items: FloatingDockItem[]
  className?: string
}

export const FloatingDock = ({ items, className }: FloatingDockProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 p-2",
        "bg-white/80 dark:bg-slate-900/80",
        "backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50",
        "rounded-2xl shadow-lg",
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.id}
          className={cn(
            "relative flex items-center justify-center p-3 rounded-xl",
            "transition-colors duration-200",
            item.isActive 
              ? "bg-blue-500 text-white" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoveredItem(item.id)}
          onHoverEnd={() => setHoveredItem(null)}
          onClick={item.onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {item.icon}
          
          {/* Tooltip */}
          {hoveredItem === item.id && (
            <motion.div
              className={cn(
                "absolute -top-12 left-1/2 transform -translate-x-1/2",
                "bg-slate-900 dark:bg-slate-100",
                "text-white dark:text-slate-900",
                "text-xs font-medium px-2 py-1 rounded-md",
                "whitespace-nowrap"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </motion.div>
  )
}

