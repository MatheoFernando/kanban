import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ensureBoardsSeeded, migrateBoardsToDefaultWorkspace, cleanupExampleBoards } from '../lib/boards';
import { ensureWorkspacesSeeded, deleteWorkspace } from '../lib/workspaces';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { CreateBoardModal } from './CreateBoardModal';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    ensureWorkspacesSeeded();
    ensureBoardsSeeded();
    migrateBoardsToDefaultWorkspace();
    cleanupExampleBoards();
  }, []);

  const location = useLocation();
  const pathname = location.pathname;
  const showSidebar = /^\/boards$/.test(pathname) || /^\/w\/[^/]+\/boards$/.test(pathname);

  useEffect(() => {
    const h = (e: any) => setConfirmDel({ id: e.detail.id, name: e.detail.name });
    (window as any).addEventListener('open-delete-workspace', h);
    const hc = () => setCreateWsOpen(true)
    ;(window as any).addEventListener('open-create-workspace', hc)
    return () => {
      (window as any).removeEventListener('open-delete-workspace', h)
      ;(window as any).removeEventListener('open-create-workspace', hc)
    }
  }, []);

  // Tour removido para simplificar a aplicação

  const handleConfirmDelete = async () => {
    if (confirmDel) {
      await deleteWorkspace(confirmDel.id);
      setConfirmDel(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      <motion.main
        className="px-4 sm:px-6 py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto flex gap-6">
          {showSidebar && <div className="hidden lg:block"><LeftSidebar onOpenCreateWs={() => setCreateWsOpen(true)} /></div>}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </motion.main>
      <CreateBoardModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <CreateWorkspaceModal isOpen={createWsOpen} onClose={() => setCreateWsOpen(false)} />
      <ConfirmDeleteModal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleConfirmDelete}
        name={confirmDel?.name || ''}
      />
    </div>
  );
};

export default Layout;