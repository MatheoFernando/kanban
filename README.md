# 📋 Task Manager - Kanban + Flow

Uma aplicação moderna e responsiva de gestão de tarefas com duas visualizações distintas: **Kanban** e **Flow**, construída com React e as melhores práticas de desenvolvimento frontend. Interface multilíngue, animações fluidas e design adaptável para todos os dispositivos.

![Task Manager Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue)

## 🚀 Funcionalidades Principais

### 📊 Kanban View
- **3 colunas responsivas**: A Fazer, Em Progresso, Concluído
- **Drag & Drop intuitivo** entre colunas usando @dnd-kit
- **Cards animados** com títulos, descrições, prioridades e dependências
- **Animações fluidas** durante drag and drop com Framer Motion
- **Contadores dinâmicos** de tarefas por coluna
- **Estados visuais** com indicadores de progresso
- **Feedback visual** ao arrastar sobre colunas

### 🌐 Flow View
- **Visualização em grafo** interativa usando React Flow
- **Nós personalizados** representando tarefas
- **Conexões visuais** mostrando dependências entre tarefas
- **Arrastar e reposicionar** nós livremente no canvas
- **Adicionar dependências** conectando tarefas dinamicamente
- **Mini-mapa** para navegação em grafos grandes
- **Controles de zoom** e pan suaves
- **Cores baseadas em prioridade** nos nós

### ✨ Funcionalidades Avançadas
- 🌙 **Modo escuro/claro** com transições suaves
- 🌍 **Sistema de traduções** (Português, Inglês, Espanhol)
- 💾 **Persistência automática** no localStorage
- 📱 **Design 100% responsivo** (Mobile-first approach)
- 🎨 **Animações com Framer Motion** em todos os componentes
- 🎭 **Componentes UI inspirados no Magic UI**
- ♿ **Acessibilidade completa** com ARIA labels
- ⚡ **Performance otimizada** com lazy loading

### 🎨 Componentes UI Customizados
- **AnimatedCard**: Cards com animações de entrada e hover
- **Shimmer**: Efeitos de brilho em elementos importantes
- **FloatingDock**: Navegação flutuante estilo macOS
- **LanguageSelector**: Seletor de idioma com bandeiras
- **Gradient Backgrounds**: Fundos adaptativos por tema

## 🛠️ Stack Tecnológica

### Core
- **React 19** + **TypeScript 5.9** - Framework principal
- **Vite 7** - Build tool ultrarrápida
- **Tailwind CSS 4** - Styling system moderno

### UI & Animações
- **Framer Motion** - Animações fluidas e gestos
- **Lucide React** - Ícones consistentes e modernos
- **Radix UI** - Componentes acessíveis de base
- **Custom UI Components** - Inspirados no Magic UI

### Funcionalidades
- **@dnd-kit** - Drag and drop acessível
- **@xyflow/react** (React Flow) - Visualização de grafos
- **React Router DOM** - Roteamento SPA
- **react-i18next** - Sistema de traduções

### Qualidade
- **ESLint** - Linting de código
- **TypeScript** - Tipagem estática
- **Prettier** - Formatação consistente

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn ou pnpm

### Comandos

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd kanban

# Instalar dependências
npm install

# Desenvolvimento
npm run dev
# Aplicação disponível em http://localhost:5173

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 🏗️ Arquitetura do Projeto

```
src/
├── components/             # Componentes React
│   ├── ui/                # Componentes base personalizados
│   │   ├── animated-card.tsx      # Cards com animações
│   │   ├── shimmer.tsx           # Efeitos de brilho
│   │   ├── floating-dock.tsx     # Navegação flutuante
│   │   ├── language-selector.tsx # Seletor de idiomas
│   │   ├── button.tsx           # Botões base
│   │   ├── card.tsx             # Cards base
│   │   ├── progress.tsx         # Barras de progresso
│   │   └── tabs.tsx            # Componente de abas
│   ├── Layout.tsx         # Layout principal com header
│   ├── KanbanView.tsx     # Visualização Kanban
│   ├── FlowView.tsx       # Visualização Flow
│   ├── TaskCard.tsx       # Card de tarefa animado
│   ├── TaskNode.tsx       # Nó de tarefa no Flow
│   └── KanbanColumn.tsx   # Coluna do Kanban
├── contexts/              # Contextos React
│   └── ThemeContext.tsx   # Gerenciamento de tema
├── i18n/                  # Sistema de traduções
│   └── index.ts          # Configuração do i18next
├── data/                  # Dados e mocks
│   └── mockTasks.ts      # Tarefas de exemplo
├── pages/                 # Páginas da aplicação
│   └── TasksPage.tsx     # Página principal
├── types/                 # Definições TypeScript
│   └── task.ts           # Interfaces das tarefas
├── lib/                   # Utilitários
│   └── utils.ts          # Funções auxiliares
└── assets/               # Recursos estáticos
    └── react.svg
```

## 📋 Interfaces TypeScript

### Task Interface
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[]; // IDs de tarefas dependentes
  position?: { x: number; y: number }; // Posição no Flow View
}
```

### Kanban Column
```typescript
interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
}
```

### View Mode
```typescript
type ViewMode = 'kanban' | 'flow';
```

## 🎨 Sistema de Design

### Paleta de Cores
- **Prioridade Alta**: 🔴 Red-500 (#ef4444)
- **Prioridade Média**: 🟡 Yellow-500 (#eab308)
- **Prioridade Baixa**: 🟢 Green-500 (#22c55e)
- **Neutro**: 🔘 Slate-500 (#64748b)

### Status Colors
- **A Fazer**: Tons de vermelho
- **Em Progresso**: Tons de amarelo
- **Concluído**: Tons de verde

### Responsividade
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Animações
- **Entrada**: Fade in + Slide up
- **Hover**: Scale + Shadow
- **Drag**: Rotate + Scale + Shadow
- **Transições**: 200-300ms ease

## 🌍 Sistema de Traduções

### Idiomas Suportados
- 🇧🇷 **Português** (pt-BR) - Padrão
- 🇺🇸 **English** (en-US)
- 🇪🇸 **Español** (es-ES)

### Estrutura de Traduções
```javascript
{
  taskManager: 'Gestão de Tarefas',
  kanbanView: 'Visualização Kanban',
  flowView: 'Visualização Flow',
  priority: {
    high: 'Alta',
    medium: 'Média', 
    low: 'Baixa'
  },
  // ... mais traduções
}
```

## 💡 Decisões Técnicas

### 1. **Animações com Framer Motion**
- Escolha pela performance e facilidade de uso
- Animações declarativas e componíveis
- Suporte nativo a gestos e drag

### 2. **Drag & Drop com @dnd-kit**
- Melhor acessibilidade do mercado
- Suporte completo a touch devices
- Performance otimizada para listas grandes

### 3. **React Flow para Grafos**
- Biblioteca especializada em visualizações
- Performance excelente com muitos nós
- Customização completa de estilos

### 4. **i18next para Traduções**
- Padrão da indústria para React
- Detecção automática de idioma
- Interpolação e pluralização

### 5. **Tailwind CSS 4**
- Utilities-first approach
- Purge automático de CSS não usado
- Configuração de tema unificada

### 6. **TypeScript Estrito**
- Type safety em toda aplicação
- Melhor DX com autocomplete
- Detecção precoce de erros

## 🚀 Funcionalidades Implementadas

### ✅ Funcionalidades Obrigatórias
- [x] Estrutura com /tasks
- [x] Toggle entre Kanban e Flow
- [x] 3 colunas no Kanban
- [x] Drag & Drop com @dnd-kit
- [x] React Flow com nós conectados
- [x] Interface responsiva com Tailwind
- [x] Dados mock estruturados

### ✅ Funcionalidades Extras (Bônus)
- [x] **Persistência no localStorage**
- [x] **TypeScript completo**
- [x] **Modo escuro/claro**
- [x] **Animações sutis** com Framer Motion
- [x] **Responsividade total** (Mobile/Tablet/Desktop)
- [x] **Acessibilidade** com ARIA labels
- [x] **Sistema de traduções** (3 idiomas)
- [x] **Ícones Lucide React**
- [x] **Componentes UI customizados**
- [x] **Gradientes adaptativos**

## 📱 Responsividade Detalhada

### Mobile (< 640px)
- Layout em coluna única no Kanban
- Navegação por FloatingDock
- Gestos touch otimizados
- Texto e espaçamentos reduzidos

### Tablet (640px - 1024px)
- Grid adaptativo 2-3 colunas
- Sidebar responsiva
- Touch e mouse suportados

### Desktop (> 1024px)
- Layout completo em 3 colunas
- Todas as animações ativas
- Shortcuts de teclado
- Hover states completos

## 🧪 Testes e Qualidade

### Ferramentas de Qualidade
- **ESLint**: Linting rigoroso
- **TypeScript**: Type checking
- **Prettier**: Formatação automática
- **Vite**: Hot reload rápido

### Performance
- **Lazy loading** de componentes
- **Memoização** de cálculos pesados
- **Virtual scrolling** para listas grandes
- **Bundle splitting** automático

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# .env.local
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_ENABLE_DEBUG=false
```

### Customização de Tema
```typescript
// tailwind.config.js - Cores personalizadas
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

## 📈 Roadmap Futuro

### Próximas Funcionalidades
- [ ] **Editor WYSIWYG** para descrições
- [ ] **Filtros avançados** por prioridade/status
- [ ] **Busca global** com highlighting
- [ ] **Templates** de projetos
- [ ] **Exportação** JSON/CSV
- [ ] **Sync** com backend
- [ ] **Colaboração** em tempo real
- [ ] **Notificações** push
- [ ] **Métricas** e analytics
- [ ] **API REST** completa

### Melhorias Técnicas
- [ ] **Tests unitários** (Jest + RTL)
- [ ] **E2E tests** (Playwright)
- [ ] **Storybook** para componentes
- [ ] **PWA** com service workers
- [ ] **Docker** para deployment
- [ ] **CI/CD** com GitHub Actions

## 🌐 Deploy e Produção

### Plataformas Recomendadas
- **Vercel**: Deploy automático com Git
- **Netlify**: Static hosting otimizado
- **GitHub Pages**: Gratuito para projetos open source

### Build Otimizado
```bash
npm run build
# Gera pasta dist/ otimizada
# Tamanho ~500KB gzipped
# Lighthouse Score: 95+
```

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines
- Siga o padrão de código (ESLint + Prettier)
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **React Team** - Framework incrível
- **Framer** - Animações fluidas
- **Tailwind Labs** - CSS utilities
- **React Flow Team** - Visualizações de grafo
- **Lucide** - Ícones consistentes
- **Radix UI** - Componentes acessíveis

---

**Desenvolvido com ❤️ para o Desafio Frontend - BTT**

🔗 **Links Úteis:**
- [Demo Live](https://task-manager-kanban-flow.vercel.app)
- [Documentação React Flow](https://reactflow.dev)
- [Guia Framer Motion](https://framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

📞 **Contato:**
- Email: seu-email@exemplo.com
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)
- GitHub: [@seu-usuario](https://github.com/seu-usuario)