import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Menu, FolderPlus, Search, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { LanguageSelector } from './ui/language-selector';
import { Sheet, SheetContent, SheetHeader, SheetDescription, SheetTrigger } from './ui/sheet';
import { CommandSearchDialog } from './CommandSearchDialog';
import { LeftSidebar } from './LeftSidebar';
import { CreateBoardModal } from './CreateBoardModal';

export const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-40 bg-gradient-to-b from-white/90 to-white/70 dark:from-slate-900/90 dark:to-slate-900/70 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex items-center gap-4 ">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Voltar"
              title="Voltar"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger>
                <motion.button
                  aria-label={sidebarOpen ? t('header.closeMenu') : t('header.openMenu')}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 lg:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-tour="menu-button"
                >
                  {sidebarOpen ? (
                    <ArrowLeft className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-slate-900 min-h-screen shadow-xl w-full">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetDescription>{t('header.navigation')}</SheetDescription>
                    <button aria-label={t('header.closeMenu')} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setSidebarOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </SheetHeader>
                <div className="p-4 space-y-4">
                  <LeftSidebar
                    isMobile
                    onOpenCreateWs={() => {
                      try { window.dispatchEvent(new Event('open-create-workspace')) } catch {}
                      setSidebarOpen(false)
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3">
              <Link to="/boards" className="flex items-center gap-2" data-tour="logo">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{t('appName')}</h2>
              </Link>
            </div>
          </div>

          <motion.div
            className="flex items-center gap-3 "
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative hidden md:block w-full" data-tour="search">
              <input
                id="global-search-input"
                type="text"
                placeholder={t('header.searchBoardsAndTasks')}
                onChange={(e) => {
                  const event = new CustomEvent('global-search', { detail: e.target.value });
                  window.dispatchEvent(event);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white text-sm"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </div>
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Pesquisar"
              title="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-2 sm:px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={t('modals.createBoard')}
              data-tour="create-board"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('header.create')}</span>
            </motion.button>
            <div data-tour="language">
              <LanguageSelector />
            </div>

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/70 shadow-sm"
              aria-label={theme === 'light' ? t('header.switchToDark') : t('header.switchToLight')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-tour="theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
      <CommandSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <CreateBoardModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </motion.header>
  );
};