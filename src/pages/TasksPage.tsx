import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Kanban, GitBranch } from 'lucide-react'
import { FloatingDock } from '../components/ui/floating-dock'
import KanbanView from '../components/KanbanView.tsx'
import FlowView from '../components/FlowView.tsx'
import type { Task, ViewMode } from '../types/task'
import { mockTasks } from '../data/mockTasks'

const TasksPage = () => {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentView, setCurrentView] = useState<ViewMode>('kanban')

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(mockTasks)
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const updateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
  }

  const dockItems = [
    {
      id: 'kanban',
      icon: <Kanban className="w-5 h-5" />,
      label: t('kanbanView'),
      onClick: () => setCurrentView('kanban'),
      isActive: currentView === 'kanban'
    },
    {
      id: 'flow',
      icon: <GitBranch className="w-5 h-5" />,
      label: t('flowView'),
      onClick: () => setCurrentView('flow'),
      isActive: currentView === 'flow'
    }
  ]

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-end justify-end w-fll gap-4">
        
          <motion.div
            className="hidden sm:flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {tasks.length} tarefas
            </span>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
            <span className="font-medium">{t('priority.high')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="font-medium">{t('priority.medium')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
            <span className="font-medium">{t('priority.low')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Dock Navigation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <FloatingDock items={dockItems} />
      </motion.div>

      {/* Views Container */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {currentView === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            >
              <KanbanView 
                tasks={tasks} 
                onUpdateTask={updateTask}
                onUpdateTasks={updateTasks}
              />
            </motion.div>
          )}
          
          {currentView === 'flow' && (
            <motion.div
              key="flow"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            >
              <FlowView 
                tasks={tasks} 
                onUpdateTask={updateTask}
                onUpdateTasks={updateTasks}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TasksPage
