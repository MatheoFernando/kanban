import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Save, Trash2, Plus, X, Calendar, Tag, Users, 
  Paperclip, CheckSquare, MessageSquare, Activity,
  MoreHorizontal, Archive
} from 'lucide-react'
import type { Task } from '../types/task'
import Modal from './ui/modal'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSave: (task: Task) => void
  onDelete?: (taskId: string) => void
  columns?: Array<{ id: string; title: string; status: string }>
}

export const TaskModal = ({ isOpen, onClose, task, onSave, onDelete, columns = [] }: TaskModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dependencies: [] as string[]
  })

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dependencies: task.dependencies || []
      })
    } else {
      setFormData({
        id: Date.now().toString(),
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dependencies: []
      })
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const newTask: Task = {
      id: formData.id,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dependencies: formData.dependencies.length > 0 ? formData.dependencies : undefined,
      position: task?.position || { x: Math.random() * 300, y: Math.random() * 200 }
    }

    onSave(newTask)
    onClose()
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onClose()
    }
  }

  const isEditing = !!task

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Digite o título da tarefa..."
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Descreva a tarefa..."
          />
        </div>

        {/* Status e Prioridade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {columns.map(column => (
                <option key={column.id} value={column.status}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">{t('priority.low')}</option>
              <option value="medium">{t('priority.medium')}</option>
              <option value="high">{t('priority.high')}</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          {isEditing && onDelete && (
            <motion.button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Deletar
            </motion.button>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('cancel')}
            </motion.button>
            
            <motion.button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Salvar' : 'Criar'}
            </motion.button>
          </div>
        </div>
        </form>
    </Modal>
  )
}
