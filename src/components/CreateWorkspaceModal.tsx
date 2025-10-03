import { motion } from 'framer-motion';
import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { createWorkspace } from '../lib/workspaces';
import { useNavigate } from 'react-router-dom';

export function CreateWorkspaceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [createWsName, setCreateWsName] = useState('');
  const navigate = useNavigate();

  const handleCreateWorkspace = () => {
    const name = createWsName.trim();
    if (!name) return;
    const ws = createWorkspace(name);
    onClose();
    setCreateWsName('');
    navigate(`/w/${ws.id}/boards`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <FolderPlus className="w-5 h-5 text-slate-500" />
            <h3 className="font-medium">Criar novo workspace</h3>
          </div>
          <div className="space-y-3">
            <input
              autoFocus
              value={createWsName}
              onChange={(e) => setCreateWsName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateWorkspace();
                }
              }}
              placeholder="Nome do workspace"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateWorkspace}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
