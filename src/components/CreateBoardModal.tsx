import { motion } from 'framer-motion';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderPlus, Briefcase, Building2, Globe } from 'lucide-react';
import { createBoard } from '../lib/boards';
import { useNavigate } from 'react-router-dom';

export function CreateBoardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createIcon, setCreateIcon] = useState<'Briefcase' | 'Building2' | 'Globe'>('Briefcase');
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    const name = createName.trim();
    if (!name) return;
    const m = window.location.pathname.match(/^\/w\/([^/]+)\/boards/);
    const wsId = m ? m[1] : undefined;
    const b = createBoard(name, 'other', createDesc.trim() || undefined, createIcon, wsId);
    onClose();
    setCreateName('');
    setCreateDesc('');
    navigate(`/boards/${b.id}`);
  };

  if (!isOpen) return null;

  return createPortal(
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
            <h3 className="font-medium">Criar novo board</h3>
          </div>
          <div className="space-y-3">
            <input
              autoFocus
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateBoard();
                }
              }}
              placeholder="Nome do board"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <textarea
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              placeholder="Descrição (opcional)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Ícone:</span>
              <button onClick={() => setCreateIcon('Briefcase')} className={`p-2 rounded-lg border ${createIcon === 'Briefcase' ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}>{<Briefcase className="w-4 h-4" />}</button>
              <button onClick={() => setCreateIcon('Building2')} className={`p-2 rounded-lg border ${createIcon === 'Building2' ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}>{<Building2 className="w-4 h-4" />}</button>
              <button onClick={() => setCreateIcon('Globe')} className={`p-2 rounded-lg border ${createIcon === 'Globe' ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}>{<Globe className="w-4 h-4" />}</button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
