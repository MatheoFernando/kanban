import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/driver.css';
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
  const { t } = useTranslation();
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
    return () => (window as any).removeEventListener('open-delete-workspace', h);
  }, []);

  useEffect(() => {
    // Run guided tour only once per browser storage
    const hasRun = localStorage.getItem('app_tour_done');
    if (hasRun) return;
    const d = driver({
      showProgress: true,
      nextBtnText: '→',
      prevBtnText: '←',
      doneBtnText: 'OK'
    });
    d.setSteps([
      { element: 'body', popover: { title: t('appName'), description: t('tour.start') } },
      { element: '[data-tour="logo"]', popover: { title: t('appName'), description: t('tour.logo') } },
      { element: '[data-tour="menu-button"]', popover: { title: t('header.navigation'), description: t('tour.menuButton') } },
      { element: '[data-tour="sidebar"]', popover: { title: t('header.navigation'), description: t('tour.navigation') } },
      { element: '[data-tour="nav-home"]', popover: { title: t('navigation.home'), description: t('tour.home') } },
      { element: '[data-tour="nav-create-workspace"]', popover: { title: t('navigation.createWorkspace'), description: t('tour.createWorkspace') } },
      { element: '[data-tour="language"]', popover: { title: t('languages.en'), description: t('tour.language') } },
      { element: '[data-tour="theme"]', popover: { title: t('header.switchToDark'), description: t('tour.theme') } },
      { element: '[data-tour="create-board"]', popover: { title: t('modals.createBoard'), description: t('tour.createBoard') } },
      { element: '[data-tour="search"]', popover: { title: t('header.searchBoardsAndTasks'), description: t('tour.search') } }
    ]);
    d.drive();
    localStorage.setItem('app_tour_done', '1');
  }, [t]);

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