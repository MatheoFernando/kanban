import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Task, KanbanColumn as KanbanColumnType } from '../types/task';
import TaskCard from './TaskCard.tsx';
import { Shimmer } from './ui/shimmer';
import { useState } from 'react';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: Task[];
  onCreateTask?: (status: Task['status']) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onRenameColumn?: (title: string) => void;
  onDeleteColumn?: () => void;
}

const KanbanColumn = ({ column, tasks, onCreateTask, onEditTask, onDeleteTask, onRenameColumn, onDeleteColumn }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'border-red-200/60 bg-gradient-to-b from-red-50 to-red-100/50 dark:border-red-800/60 dark:from-red-950/50 dark:to-red-900/30';
      case 'in-progress':
        return 'border-yellow-200/60 bg-gradient-to-b from-yellow-50 to-yellow-100/50 dark:border-yellow-800/60 dark:from-yellow-950/50 dark:to-yellow-900/30';
      case 'done':
        return 'border-green-200/60 bg-gradient-to-b from-green-50 to-green-100/50 dark:border-green-800/60 dark:from-green-950/50 dark:to-green-900/30';
      default:
        return 'border-slate-200/60 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:border-slate-700/60 dark:from-slate-800/50 dark:to-slate-700/30';
    }
  };

  const getHeaderColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'text-red-800 dark:text-red-200';
      case 'in-progress':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'done':
        return 'text-green-800 dark:text-green-200';
      default:
        return 'text-slate-800 dark:text-slate-200';
    }
  };

  const getStatusTitle = () => column.title;

  return (
    <motion.div
      className={`
        rounded-xl border-2 border-dashed p-4 md:p-6 min-h-[500px] w-full transition-all duration-300
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
        <div className="flex items-center gap-2">
          <Shimmer>
            {isEditingTitle ? (
              <form
                onSubmit={(e) => { e.preventDefault(); onRenameColumn?.(titleDraft.trim() || column.title); setIsEditingTitle(false) }}
              >
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="px-2 py-1 rounded border bg-white dark:bg-slate-800"
                  autoFocus
                  onBlur={() => setIsEditingTitle(false)}
                />
              </form>
            ) : (
              <h3
                onDoubleClick={() => setIsEditingTitle(true)}
                className={`font-bold text-lg md:text-xl ${getHeaderColor(column.status)}`}
              >
                {getStatusTitle()}
              </h3>
            )}
          </Shimmer>
          <span className="text-sm font-normal text-slate-500">{tasks.length}</span>
        </div>

        <div className="flex items-center gap-2">


          <motion.button
            onClick={() => onCreateTask?.(column.status)}
            className="p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Adicionar"
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          {onRenameColumn && (
            <motion.button
              onClick={() => setIsEditingTitle(true)}
              className="p-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Renomear lista"
            >
              <Pencil className="w-4 h-4" />
            </motion.button>
          )}

          {onDeleteColumn && (
            <motion.button
              onClick={onDeleteColumn}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Remover lista"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
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
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>
      </motion.div>
    </motion.div>
  );
};

export default KanbanColumn;