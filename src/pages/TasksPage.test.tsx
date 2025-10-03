import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TasksPage from './TasksPage';

jest.mock('../i18n', () => ({
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <TasksPage />
    </BrowserRouter>
  );

test('renders tasks page', () => {
  renderPage();

  expect(screen.getByText('Kanban')).toBeInTheDocument();
});
