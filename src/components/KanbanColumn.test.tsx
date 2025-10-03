import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DndContext } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import type { Task, KanbanColumn as KanbanColumnType } from '../types/task'

const mockColumn: KanbanColumnType = {
  id: 'todo',
  title: 'To Do',
  status: 'todo'
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    status: 'todo',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Task 2',
    status: 'todo',
    priority: 'medium'
  }
]

const renderWithDnd = (column: KanbanColumnType, tasks: Task[] = [], props = {}) => {
  return render(
    <DndContext>
      <KanbanColumn column={column} tasks={tasks} {...props} />
    </DndContext>
  )
}

test('renders column title and task count', () => {
  renderWithDnd(mockColumn, mockTasks)
  
  expect(screen.getByText('To Do')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument()
})

test('renders tasks in column', () => {
  renderWithDnd(mockColumn, mockTasks)
  
  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('Task 2')).toBeInTheDocument()
})

test('shows empty state when no tasks', () => {
  renderWithDnd(mockColumn, [])
  
  expect(screen.getByText(/Nenhuma tarefa/i)).toBeInTheDocument()
})

test('calls onCreateTask when add button is clicked', () => {
  const mockOnCreateTask = jest.fn()
  renderWithDnd(mockColumn, mockTasks, { onCreateTask: mockOnCreateTask })
  
  const addButton = screen.getByTitle('Adicionar')
  fireEvent.click(addButton)
  
  expect(mockOnCreateTask).toHaveBeenCalledWith('todo')
})

