import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en-US', name: 'English' },
]

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => 
    lang.code === i18n.language || lang.code.startsWith(i18n.language)
  ) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-slate-100 dark:bg-slate-800",
          "text-slate-700 dark:text-slate-300",
          "hover:bg-slate-200 dark:hover:bg-slate-700",
          "transition-colors duration-200",
          "border border-slate-200 dark:border-slate-700"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
           {currentLanguage.name}
        </span>
      
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 top-full mt-2 z-50",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "rounded-lg shadow-lg",
              "min-w-[160px]",
              "py-2"
            )}
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2",
                  "text-left text-sm",
                  "hover:bg-slate-100 dark:hover:bg-slate-700",
                  "transition-colors duration-150",
                  currentLanguage.code === language.code && 
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                )}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.1 }}
              >
                <span className="font-medium">{language.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar o menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

