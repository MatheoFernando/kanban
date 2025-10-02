import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { Task } from '../types/task'

interface TaskNodeData {
  task: Task
}

const TaskNode = ({ data }: NodeProps<TaskNodeData>) => {
  const { task } = data

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-400'
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
      default:
        return 'border-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-400'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'todo':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'A Fazer'
      case 'in-progress':
        return 'Em Progresso'
      case 'done':
        return 'Concluído'
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta'
      case 'medium':
        return 'Média'
      case 'low':
        return 'Baixa'
      default:
        return priority
    }
  }

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white dark:bg-slate-800 min-w-[200px] max-w-[250px] ${getPriorityColor(task.priority)}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
            {task.title}
          </h4>
        </div>
        
        {task.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {task.description.length > 60 
              ? `${task.description.substring(0, 60)}...` 
              : task.description
            }
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority).replace('border-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>

        {task.dependencies && task.dependencies.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {task.dependencies.length} dep.
            </span>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default TaskNode
