export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string; 
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[]; 
  position?: { x: number; y: number }; 
  dueDate?: string; 
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
}

export type ViewMode = 'kanban' | 'flow';

