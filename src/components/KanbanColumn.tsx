import { motion } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import type { Task, KanbanColumn as KanbanColumnType } from '../types/task'
import TaskCard from './TaskCard.tsx'
import { Shimmer } from './ui/shimmer'

interface KanbanColumnProps {
  column: KanbanColumnType
  tasks: Task[]
}

const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'border-red-200/60 bg-gradient-to-b from-red-50 to-red-100/50 dark:border-red-800/60 dark:from-red-950/50 dark:to-red-900/30'
      case 'in-progress':
        return 'border-yellow-200/60 bg-gradient-to-b from-yellow-50 to-yellow-100/50 dark:border-yellow-800/60 dark:from-yellow-950/50 dark:to-yellow-900/30'
      case 'done':
        return 'border-green-200/60 bg-gradient-to-b from-green-50 to-green-100/50 dark:border-green-800/60 dark:from-green-950/50 dark:to-green-900/30'
      default:
        return 'border-slate-200/60 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:border-slate-700/60 dark:from-slate-800/50 dark:to-slate-700/30'
    }
  }

  const getHeaderColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'text-red-800 dark:text-red-200'
      case 'in-progress':
        return 'text-yellow-800 dark:text-yellow-200'
      case 'done':
        return 'text-green-800 dark:text-green-200'
      default:
        return 'text-slate-800 dark:text-slate-200'
    }
  }

  const getStatusTitle = (status: Task['status']) => {
    return t(`columns.${status === 'in-progress' ? 'inProgress' : status}`)
  }

  return (
    <motion.div 
      className={`
        rounded-xl border-2 border-dashed p-4 md:p-6 min-h-[500px] transition-all duration-300
        ${getColumnColor(column.status)}
        ${isOver ? 'border-solid scale-[1.02] shadow-lg' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      layout
    >
      <motion.div 
        className="flex items-center justify-between mb-4 md:mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Shimmer>
          <h3 className={`font-bold text-lg md:text-xl ${getHeaderColor(column.status)}`}>
            {getStatusTitle(column.status)}
          </h3>
        </Shimmer>
        
        <div className="flex items-center gap-2">
          <motion.span 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            key={tasks.length}
          >
            {tasks.length}
          </motion.span>
          
          <motion.button
            className="p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Adicionar tarefa"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        ref={setNodeRef} 
        className="space-y-3 custom-scrollbar overflow-y-auto max-h-[400px] lg:max-h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Nenhuma tarefa
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Arraste tarefas aqui
              </p>
            </motion.div>
          ) : (
            tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))
          )}
        </SortableContext>
      </motion.div>
    </motion.div>
  )
}

export default KanbanColumn
