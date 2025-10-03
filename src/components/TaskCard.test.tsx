import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import type { Task } from '../types/task'

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  priority: 'high',
  dependencies: ['2']
}

const renderWithDnd = (task: Task, props = {}) => {
  return render(
    <DndContext>
      <TaskCard task={task} {...props} />
    </DndContext>
  )
}

test('renders task title and description', () => {
  renderWithDnd(mockTask)
  
  expect(screen.getByText('Test Task')).toBeInTheDocument()
  expect(screen.getByText('Test description')).toBeInTheDocument()
})

test('renders priority badge', () => {
  renderWithDnd(mockTask)
  
  expect(screen.getByText('Alta')).toBeInTheDocument()
})

test('calls onEdit when edit button is clicked', () => {
  const mockOnEdit = jest.fn()
  renderWithDnd(mockTask, { onEdit: mockOnEdit })
  
  const editButton = screen.getByTitle('Editar')
  fireEvent.click(editButton)
  
  expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
})

test('calls onDelete when delete button is clicked', () => {
  const mockOnDelete = jest.fn()
  renderWithDnd(mockTask, { onDelete: mockOnDelete })
  
  const deleteButton = screen.getByTitle('Deletar')
  fireEvent.click(deleteButton)
  
  expect(mockOnDelete).toHaveBeenCalledWith('1')
})
