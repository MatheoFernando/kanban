import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { Link, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { Task } from '../types/task'
import { AnimatedCard } from './ui/animated-card'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  index?: number
}

const TaskCard = ({ task, isDragging = false, index = 0 }: TaskCardProps) => {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'todo':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    return t(`priority.${priority}`)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        layout: { duration: 0.3 }
      }}
      whileHover={!isDragging && !isSortableDragging ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!isDragging && !isSortableDragging ? { scale: 0.98 } : {}}
      className="cursor-grab active:cursor-grabbing"
    >
      <AnimatedCard
        className={`
          p-4 border-l-4 border-l-blue-500 dark:border-l-blue-400
          ${isDragging || isSortableDragging ? 'opacity-70 rotate-3 scale-105 shadow-xl z-50' : ''}
          transition-all duration-200
        `}
        isDragging={isDragging || isSortableDragging}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            {getStatusIcon(task.status)}
            <h4 className="font-semibold text-slate-900 dark:text-white leading-tight text-sm">
              {task.title}
            </h4>
          </div>
          <motion.span 
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getPriorityLabel(task.priority)}
          </motion.span>
        </div>
        
        {task.description && (
          <motion.p 
            className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {task.description}
          </motion.p>
        )}

        {task.dependencies && task.dependencies.length > 0 && (
          <motion.div 
            className="flex items-center gap-2 mt-3 px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-md"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {task.dependencies.length} {task.dependencies.length === 1 ? t('tasks.dependencies') : t('tasks.dependenciesPlural')}
            </span>
          </motion.div>
        )}

        {/* Progress indicator based on status */}
        <motion.div 
          className="mt-3 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className={`h-full rounded-full ${
              task.status === 'done' ? 'bg-green-500' :
              task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: task.status === 'done' ? '100%' : 
                     task.status === 'in-progress' ? '60%' : '20%' 
            }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>
      </AnimatedCard>
    </motion.div>
  )
}

export default TaskCard
