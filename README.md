# 📋 Task Manager - Kanban + Flow

Aplicação para gestão de tarefas com duas visões: Kanban e Fluxo. Interface padrão em Português, busca global, tour guiado e seed automático na primeira execução.

## 🚀 O que está pronto

- Kanban: 3 colunas (A Fazer, Em Progresso, Concluído) com drag & drop (@dnd-kit)
- Fluxo (React Flow): nós de tarefas, linhas por dependências e posicionamento persistente
- Tema claro/escuro, i18n (pt-BR e en-US via JSON), busca global (apenas itens existentes)
- Tour inicial (driver.js) e fechamento do menu mobile por overlay/ícone
- Seed automático: Workspace “Wokhop Team Front-end”, board “Teste”, tarefas de exemplo e redirecionamento

## ▶️ Como rodar

```bash
npm install
npm run dev
# http://localhost:5173

# build e preview
npm run build
npm run preview
```

## 🧭 Primeira execução (seed)

- Cria workspace “Wokhop Team Front-end” e board “Teste”
- Cria tarefas exemplo (3) e abre o board “Teste”
- Para reexecutar: limpe no localStorage as chaves `app_first_open_done`, `app_tour_done`, `kanban-tasks:teste`, `kanban-columns:teste`

## 🔎 Busca global

- Atalho no header; mostra apenas boards e tarefas existentes
- Placeholders e mensagens traduzidas (pt/en)

## 🌍 Traduções

- Arquivos JSON em `src/i18n/locales/{pt,en}/translation.json`
- Idioma padrão: pt-BR (armazenado em `localStorage.i18nextLng`)

## 🔧 Fluxo (React Flow)

- Nós: 1 por tarefa; posição salvo por board
- Linhas: criadas se `dependencies` contiver IDs válidos de outras tarefas
- Aparência: `defaultEdgeOptions` + classes utilitárias para linhas/nós

## 🧩 Kanban (Dnd Kit)

- Colunas com ordenação e movimentação entre listas
- Melhorias de colisão/cursor e overlay de drag

## 📦 Tech

React 19, TypeScript 5, Vite 7, Tailwind 4, Framer Motion, @dnd-kit, React Flow, i18next, React Router.

## 🐞 Dúvidas comuns

- Fluxo sem linhas: adicione `dependencies` nas tarefas (ex.: `['t1']`) referindo IDs existentes
- Tour “No steps to drive through”: aviso inofensivo quando não há passos; pode ignorar
- Re-semeadura: limpe as chaves do localStorage listadas acima e recarregue

## 📁 Estrutura rápida

```
src/
  components/         # Layout, Header, Kanban, Flow, UI
  pages/              # BoardsPage, TasksPage
  i18n/               # JSON de traduções
  lib/                # boards/workspaces (localStorage)
  contexts/           # Tema
```

## 🧪 Scripts úteis

```bash
npm run test     # Jest + RTL
npm run lint     # ESLint
```

## 🧹 Limpeza de dependências

- Removido: `i18next-http-backend` (não usamos carregamento HTTP)
- Mantidos: `@radix-ui/react-dialog`, `@radix-ui/react-tooltip` (usados em UI), `cmdk` (paleta de busca)

---

Desenvolvido com ❤️ para o Desafio Frontend - BTT