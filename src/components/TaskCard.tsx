import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { Link, AlertCircle, CheckCircle, Clock, Edit2, Trash2, Calendar, User } from 'lucide-react';
import type { Task } from '../types/task';
import { AnimatedCard } from './ui/animated-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  index?: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard = ({ task, isDragging = false, index = 0, onEdit, onDelete }: TaskCardProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'todo':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    return t(`priority.${priority}`);
  };

  return (
    <TooltipProvider>
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
          layout: { duration: 0.3 },
        }}
        whileHover={!isDragging && !isSortableDragging ? { scale: 1.02, y: -2, transition: { duration: 0.2 } } : {}}
        whileTap={!isDragging && !isSortableDragging ? { scale: 0.98 } : {}}
        className="cursor-grab active:cursor-grabbing"
      >
        <AnimatedCard
          className={`
            group relative p-4 border-l-4 border-l-blue-500 dark:border-l-blue-400
            ${isDragging || isSortableDragging ? 'opacity-70 rotate-3 scale-105 shadow-xl z-50' : ''}
            transition-all duration-200 rounded-xl shadow-sm hover:shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[110px] overflow-hidden p-3
            hover:border-blue-300 dark:hover:border-blue-600
          `}
          isDragging={isDragging || isSortableDragging}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {getStatusIcon(task.status)}
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="font-semibold text-slate-900 dark:text-white leading-tight text-sm truncate" title={task.title}>
                    {task.title}
                  </h4>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{task.title}</p>
                </TooltipContent>
              </Tooltip>
            </div>

              <div className="flex items-center gap-1 ml-2">
              <motion.span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getPriorityColor(task.priority)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getPriorityLabel(task.priority)}
              </motion.span>

              <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200">
                {onEdit && (
                  <motion.button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                {onDelete && (
                  <motion.button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Deletar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {task.description && (
            <motion.div
              className="mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-5 line-clamp-2" title={task.description}>
                    {task.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{task.description}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}

          {task.dependencies && task.dependencies.length > 0 && (
            <motion.div
              className="flex items-center gap-2 mb-3 px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-md"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {task.dependencies.length} dependência{task.dependencies.length !== 1 ? 's' : ''}
              </span>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sem data'}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-b-xl overflow-hidden"
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
    </TooltipProvider>
  );
};

export default TaskCard;