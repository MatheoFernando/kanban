import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TasksPage from './TasksPage'

const renderPage = () => render(
  <BrowserRouter>
    <TasksPage />
  </BrowserRouter>
)

test('render page title', () => {
  renderPage()
  expect(screen.getByText(/Gestão de Tarefas/i)).toBeInTheDocument()
})



