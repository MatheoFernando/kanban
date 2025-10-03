import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'

interface AddColumnCardProps {
  onAddColumn: (title: string) => void
}

export const AddColumnCard = ({ onAddColumn }: AddColumnCardProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddColumn(title.trim())
      setTitle('')
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
  }

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da lista..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Adicionar
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <motion.button
        onClick={() => setIsAdding(true)}
        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-full">
            <Plus className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Adicionar nova lista
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Clique para criar uma nova coluna
            </p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  )
}

