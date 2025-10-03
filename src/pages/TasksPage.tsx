import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Kanban, GitBranch, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import KanbanView from '../components/KanbanView.tsx';
import FlowView from '../components/FlowView.tsx';
import { TaskModal } from '../components/TaskModal';
import type { Task, ViewMode, KanbanColumn } from '../types/task';
const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'A Fazer', status: 'todo' },
  { id: 'in-progress', title: 'Em Progresso', status: 'in-progress' },
  { id: 'done', title: 'Concluído', status: 'done' },
];
import { getBoardById } from '../lib/boards';
import { getWorkspaceById } from '../lib/workspaces';

const TasksPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [currentView, setCurrentView] = useState<ViewMode>('kanban');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup] = useState('all');
  const board = boardId ? getBoardById(boardId) : undefined;
  const workspaceName = board?.workspaceId ? getWorkspaceById(board.workspaceId)?.name : undefined;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedGroup === 'all') return matchesSearch;
    if (['high', 'medium', 'low'].includes(selectedGroup)) {
      return matchesSearch && task.priority === selectedGroup;
    }
    return matchesSearch && task.status === selectedGroup;
  });

  useEffect(() => {
    if (!boardId) {
      navigate('/boards', { replace: true });
      return;
    }
    const board = getBoardById(boardId);
    const isTest = boardId === 'teste' || (board?.name && board.name.toLowerCase() === 'teste');
    if (!board && !isTest) {
      navigate('/boards', { replace: true });
      return;
    }
    const tasksKey = `kanban-tasks:${boardId}`;
    const colsKey = `kanban-columns:${boardId}`;
    const savedTasks = localStorage.getItem(tasksKey);
    const savedColumns = localStorage.getItem(colsKey);
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : undefined;
    if (parsedTasks && Array.isArray(parsedTasks) && parsedTasks.length > 0) {
      setTasks(parsedTasks);
    } else if (isTest) {
      setTasks([
        { id: 't1', title: 'Configurar projeto', status: 'todo', priority: 'high', description: 'Inicializar repositório e configurações básicas.' },
        { id: 't2', title: 'Criar componentes UI', status: 'in-progress', priority: 'medium', description: 'Buttons, inputs, modais.', dependencies: ['t1'] },
        { id: 't3', title: 'Integração i18n', status: 'done', priority: 'low', description: 'Português e Inglês.', dependencies: ['t2'] },
      ]);
    } else {
      setTasks([]);
    }
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else if (isTest) {
      setColumns(defaultColumns);
    }
  }, [boardId, navigate]);

  useEffect(() => {
    if (!boardId) return;
    localStorage.setItem(`kanban-tasks:${boardId}`, JSON.stringify(tasks));
  }, [tasks, boardId]);

  useEffect(() => {
    if (!boardId) return;
    localStorage.setItem(`kanban-columns:${boardId}`, JSON.stringify(columns));
  }, [columns, boardId]);

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const updateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const openCreateForStatus = (status: Task['status']) => {
    setEditingTask({ id: '', title: '', status, priority: 'medium' });
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const addColumn = (title: string) => {
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newColumn: KanbanColumn = {
      id,
      title,
      status: id
    };
    setColumns(prev => [...prev, newColumn]);
  };

  const renameColumn = (id: string, title: string) => {
    setColumns(prev => prev.map(col =>
      col.id === id ? { ...col, title } : col
    ));
  };

  const deleteColumn = (id: string) => {
    setTasks(prev => prev.filter(task => task.status !== id));
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  useEffect(() => {
    const handler = (e: any) => {
      setSearchQuery(String(e.detail || ''));
    };
    window.addEventListener('global-search', handler);
    return () => window.removeEventListener('global-search', handler);
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => navigate('/boards')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold truncate max-w-[60vw]">{workspaceName ? `${workspaceName} · ` : ''}{board?.name || ' '}</h1>
        </div>
        <div className="flex-1 w-full" />


      </motion.div>



      <motion.div
        className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        data-tour="tabs"
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


      <div className="relative min-h-[600px] overflow-x-auto">
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
        defaultStatus={editingTask?.status}
        onSave={(saved) => {
          setTasks(prev => {
            const exists = prev.some(t => t.id === saved.id);
            return exists ? prev.map(t => (t.id === saved.id ? saved : t)) : [saved, ...prev];
          });
        }}
        onDelete={(id) => deleteTask(id)}
      />
    </motion.div>
  );
};

export default TasksPage;
