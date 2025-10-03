// import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Save, Trash2, Plus
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
  defaultStatus?: Task['status']
}

export const TaskModal = ({ isOpen, onClose, task, onSave, onDelete, columns = [], defaultStatus }: TaskModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dependencies: [] as string[],
    dueDate: '' as string
  })

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dependencies: task.dependencies || [],
        dueDate: task.dueDate || ''
      })
    } else {
      setFormData({
        id: Date.now().toString(),
        title: '',
        description: '',
        status: (defaultStatus || 'todo') as Task['status'],
        priority: 'medium',
        dependencies: [],
        dueDate: ''
      })
    }
  }, [task, isOpen, defaultStatus])

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
      position: task?.position || { x: Math.random() * 300, y: Math.random() * 200 },
      dueDate: formData.dueDate || undefined
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar tarefa' : 'Criar tarefa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition"
          placeholder="Título da tarefa"
          autoFocus
          required
        />

        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition resize-none"
          placeholder="Descrição (opcional)"
        />

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            {columns.map(column => (
              <option key={column.id} value={column.status}>{column.title}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            {[{id:'low',lbl:t('priority.low')},{id:'medium',lbl:t('priority.medium')},{id:'high',lbl:t('priority.high')}].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: p.id as Task['priority'] }))}
                className={`px-3 py-1.5 rounded-full text-xs border ${formData.priority===p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'}`}
              >{p.lbl}</button>
            ))}
          </div>

          <div className="ml-auto">
            <label className="text-xs block mb-1">Data</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isEditing && onDelete && (
            <button type="button" onClick={handleDelete} className="text-red-600 text-sm inline-flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm inline-flex items-center gap-2">
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
