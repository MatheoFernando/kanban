import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, Layers, Menu, X, Home, Calendar, Users, Settings, Plus } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { LanguageSelector } from './ui/language-selector'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="">
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 lg:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kanban</h2>
                 
                </div>
              </div>
              
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LanguageSelector />
                
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700"
                  aria-label={theme === 'light' ? t('switchToDark') : t('switchToLight')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
        </motion.header>
        
        <motion.main 
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default Layout
