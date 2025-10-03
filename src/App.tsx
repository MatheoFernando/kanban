import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import BoardsPage from './pages/BoardsPage';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { driver } from 'driver.js';
import './styles/driver.css';
import { ensureBoardsSeeded, getBoards, storageKeyForColumns, storageKeyForTasks } from './lib/boards';
import { ensureWorkspacesSeeded, getWorkspaces } from './lib/workspaces';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const driverObj = driver();
    driverObj.drive();
  }, []);

  useEffect(() => {
    const firstKey = 'app_first_open_done';
    if (localStorage.getItem(firstKey)) return;
    const wsList = ensureWorkspacesSeeded();
    ensureBoardsSeeded();
    const wokhop = wsList.find(w => w.name.toLowerCase().includes('wokhop team front-end')) || getWorkspaces()[0];
    const testBoard = getBoards().find(b => b.name.toLowerCase() === 'teste' && (!wokhop || b.workspaceId === wokhop.id));
    if (testBoard && wokhop) {
      const tKey = storageKeyForTasks(testBoard.id);
      const cKey = storageKeyForColumns(testBoard.id);
      const currentTasks = (() => { try { return JSON.parse(localStorage.getItem(tKey) || '[]') } catch { return [] } })();
      if (!Array.isArray(currentTasks) || currentTasks.length === 0) {
        localStorage.setItem(tKey, JSON.stringify([
          { id: 't1', title: 'Configurar projeto', status: 'todo', priority: 'high', description: 'Inicializar repositório e configurações básicas.' },
          { id: 't2', title: 'Criar componentes UI', status: 'in-progress', priority: 'medium', description: 'Buttons, inputs, modais.' },
          { id: 't3', title: 'Integração i18n', status: 'done', priority: 'low', description: 'Português e Inglês.' }
        ]));
      }
      const currentCols = (() => { try { return JSON.parse(localStorage.getItem(cKey) || 'null') } catch { return null } })();
      if (!currentCols) {
        localStorage.setItem(cKey, JSON.stringify([
          { id: 'todo', title: 'A Fazer', status: 'todo' },
          { id: 'in-progress', title: 'Em Progresso', status: 'in-progress' },
          { id: 'done', title: 'Concluído', status: 'done' }
        ]));
      }
      navigate(`/w/${wokhop.id}/boards/${testBoard.id}`, { replace: true });
      localStorage.setItem(firstKey, '1');
    }
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/w/:wsId/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<TasksPage />} />
        <Route path="/w/:wsId/boards/:boardId" element={<TasksPage />} />
        <Route path="/" element={<Navigate to="/boards" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;