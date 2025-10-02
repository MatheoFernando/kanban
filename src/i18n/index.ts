import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções em português
const ptBR = {
  translation: {
    // Header
    switchToLight: 'Alternar para modo claro',
    switchToDark: 'Alternar para modo escuro',
    
    // Navigation
    kanbanView: 'Visualização Kanban',
    flowView: 'Visualização Flow',
    
    // Priority
    priority: {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    },
    
    // Status
    status: {
      todo: 'A Fazer',
      'in-progress': 'Em Progresso',
      done: 'Concluído'
    },
    
    // Columns
    columns: {
      todo: 'A Fazer',
      inProgress: 'Em Progresso',
      done: 'Concluído'
    },
    
    // Tasks
    tasks: {
      dependencies: 'dependência',
      dependenciesPlural: 'dependências',
      noDependencies: 'Sem dependências'
    },
    
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    
    // Languages
    languages: {
      pt: 'Português',
      en: 'English',
    }
  }
};

// Traduções em inglês
const enUS = {
  translation: {
    // Header
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    
    // Navigation
    kanbanView: 'Kanban View',
    flowView: 'Flow View',
    
    // Priority
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    
    // Status
    status: {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done'
    },
    
    // Columns
    columns: {
      todo: 'To Do',
      inProgress: 'In Progress',
      done: 'Done'
    },
    
    // Tasks
    tasks: {
      dependencies: 'dependency',
      dependenciesPlural: 'dependencies',
      noDependencies: 'No dependencies'
    },
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Languages
    languages: {
      pt: 'Português',
      en: 'English',
    }
  }
};



i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': ptBR,
      'pt': ptBR,
      'en-US': enUS,
      'en': enUS,
      
    },
    fallbackLng: 'pt-BR',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

