import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Kanban, GitBranch, Filter, Search, Plus, Users, Calendar, BarChart3 } from 'lucide-react'
import KanbanView from '../components/KanbanView.tsx'
import FlowView from '../components/FlowView.tsx'
import { TaskModal } from '../components/TaskModal'
import type { Task, ViewMode, KanbanColumn } from '../types/task'
import { mockTasks, kanbanColumns } from '../data/mockTasks'

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [columns, setColumns] = useState<KanbanColumn[]>(kanbanColumns)
  const [currentView, setCurrentView] = useState<ViewMode>('kanban')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')

 

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedGroup === 'all') return matchesSearch
    if (['high', 'medium', 'low'].includes(selectedGroup)) {
      return matchesSearch && task.priority === selectedGroup
    }
    return matchesSearch && task.status === selectedGroup
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks')
    const savedColumns = localStorage.getItem('kanban-columns')
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(mockTasks)
    }
    
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns))
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns))
  }, [columns])

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const updateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const openCreateForStatus = (status: Task['status']) => {
    setEditingTask({ id: '', title: '', status, priority: 'medium' })
    setIsTaskModalOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const addColumn = (title: string) => {
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const newColumn: KanbanColumn = {
      id,
      title,
      status: id
    }
    setColumns(prev => [...prev, newColumn])
  }

  const renameColumn = (id: string, title: string) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, title } : col
    ))
  }

  const deleteColumn = (id: string) => {
    // Remove tasks from this column
    setTasks(prev => prev.filter(task => task.status !== id))
    // Remove the column
    setColumns(prev => prev.filter(col => col.id !== id))
  }


  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with search and actions */}
      <motion.div 
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
          </motion.button>
          
          <motion.button
            onClick={() => { setEditingTask(null); setIsTaskModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Nova Tarefa</span>
          </motion.button>
        </div>
      </motion.div>

   

      {/* View Tabs */}
      <motion.div 
        className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { id: 'kanban', icon: Kanban, label: 'Kanban' },
          { id: 'flow', icon: GitBranch, label: 'Fluxo' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as ViewMode)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentView === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>


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
                tasks={filteredTasks}
                columns={columns}
                onUpdateTask={updateTask}
                onUpdateTasks={updateTasks}
                onDeleteTask={deleteTask}
                onCreateTask={openCreateForStatus}
                onEditTask={openEditTask}
                onAddColumn={addColumn}
                onRenameColumn={renameColumn}
                onDeleteColumn={deleteColumn}
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
                tasks={filteredTasks} 
                onUpdateTask={updateTask}
                onUpdateTasks={updateTasks}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null) }}
        task={editingTask && editingTask.id ? editingTask : undefined}
        columns={columns}
        onSave={(saved) => {
          setTasks(prev => {
            const exists = prev.some(t => t.id === saved.id)
            return exists ? prev.map(t => (t.id === saved.id ? saved : t)) : [saved, ...prev]
          })
        }}
        onDelete={(id) => deleteTask(id)}
      />
    </motion.div>
  )
}

export default TasksPage
