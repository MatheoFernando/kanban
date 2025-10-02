import { Routes, Route, Navigate } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </Layout>
  )
}

export default App