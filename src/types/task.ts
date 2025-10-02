export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[]; 
  position?: { x: number; y: number }; 
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
}

export type ViewMode = 'kanban' | 'flow';

