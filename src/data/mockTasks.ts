import type { Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Instalar dependências e configurar ferramentas de desenvolvimento',
    status: 'done',
    priority: 'high',
    position: { x: 100, y: 100 }
  },
  {
    id: '2',
    title: 'Criar estrutura de componentes',
    description: 'Definir a arquitetura de componentes da aplicação',
    status: 'done',
    priority: 'high',
    dependencies: ['1'],
    position: { x: 300, y: 100 }
  },
  {
    id: '3',
    title: 'Implementar autenticação',
    description: 'Sistema de login e registro de usuários',
    status: 'in-progress',
    priority: 'high',
    dependencies: ['2'],
    position: { x: 500, y: 100 }
  },
  {
    id: '4',
    title: 'Criar dashboard principal',
    description: 'Interface principal com métricas e navegação',
    status: 'in-progress',
    priority: 'medium',
    dependencies: ['2'],
    position: { x: 300, y: 250 }
  },
  {
    id: '5',
    title: 'Implementar sistema de notificações',
    description: 'Notificações em tempo real para usuários',
    status: 'todo',
    priority: 'medium',
    dependencies: ['3'],
    position: { x: 700, y: 100 }
  },
  {
    id: '6',
    title: 'Configurar testes unitários',
    description: 'Setup do Jest e React Testing Library',
    status: 'todo',
    priority: 'low',
    dependencies: ['2'],
    position: { x: 500, y: 250 }
  },
  {
    id: '7',
    title: 'Otimizar performance',
    description: 'Implementar lazy loading e memoização',
    status: 'todo',
    priority: 'medium',
    dependencies: ['4', '5'],
    position: { x: 700, y: 250 }
  },
  {
    id: '8',
    title: 'Documentação final',
    description: 'Criar documentação completa do projeto',
    status: 'todo',
    priority: 'low',
    dependencies: ['6', '7'],
    position: { x: 900, y: 200 }
  }
];

export const kanbanColumns = [
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' as const },
  { id: 'done', title: 'Done', status: 'done' as const }
];
