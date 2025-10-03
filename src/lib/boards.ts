export type BoardCategory = 'work' | 'personal' | 'study' | 'other'

export interface Board {
  id: string
  name: string
  category: BoardCategory
  createdAt: number
  pinned?: boolean
  description?: string
  icon?: string
  workspaceId?: string
}

const STORAGE_KEY = 'kanban-boards'

export function getBoards(): Board[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as Board[] : []
  } catch {
    return []
  }
}

export function saveBoards(boards: Board[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
}

export function getBoardById(boardId: string): Board | undefined {
  return getBoards().find(b => b.id === boardId)
}

export function createBoard(name: string, category: BoardCategory = 'other', description?: string, icon?: string, workspaceId?: string): Board {
  const id = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `board-${Date.now()}`
  const board: Board = { id, name, category, createdAt: Date.now(), description, icon, workspaceId }
  const boards = getBoards()
  if (!boards.some(b => b.id === board.id)) {
    boards.push(board)
    saveBoards(boards)
  }
  return board
}

export function deleteBoard(boardId: string): void {
  const boards = getBoards().filter(b => b.id !== boardId)
  saveBoards(boards)
  localStorage.removeItem(storageKeyForTasks(boardId))
  localStorage.removeItem(storageKeyForColumns(boardId))
}

export function storageKeyForTasks(boardId: string): string {
  return `kanban-tasks:${boardId}`
}

export function storageKeyForColumns(boardId: string): string {
  return `kanban-columns:${boardId}`
}

export function togglePin(boardId: string): void {
  const boards = getBoards()
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx >= 0) {
    boards[idx] = { ...boards[idx], pinned: !boards[idx].pinned }
    saveBoards(boards)
  }
}

export function ensureBoardsSeeded(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ensureWorkspacesSeeded } = require('./workspaces') as typeof import('./workspaces')
    const wsList = ensureWorkspacesSeeded()
    const wsId = wsList[0]?.id
    if (!wsId) return
    const boards = getBoards()
    const hasTest = boards.some(b => b.name === 'Teste' && b.workspaceId === wsId)
    if (!hasTest) {
      createBoard('Teste', 'work', 'Board de testes com tarefas de exemplo', '🧪', wsId)
    }
  } catch {}
}

export function renameBoard(boardId: string, newName: string): void {
  const boards = getBoards()
  const idx = boards.findIndex(b => b.id === boardId)
  if (idx >= 0) {
    boards[idx] = { ...boards[idx], name: newName }
    saveBoards(boards)
  }
}

// Ensure all boards are attached to some workspace. If a board is missing a
// workspaceId, attach it to the first available workspace.
export function migrateBoardsToDefaultWorkspace(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ensureWorkspacesSeeded } = require('./workspaces')
    const wsList = ensureWorkspacesSeeded()
    const defaultWsId = wsList[0]?.id
    if (!defaultWsId) return
    const boards = getBoards()
    let changed = false
    for (let i = 0; i < boards.length; i++) {
      if (!boards[i].workspaceId) {
        boards[i] = { ...boards[i], workspaceId: defaultWsId }
        changed = true
      }
    }
    if (changed) saveBoards(boards)
  } catch {}
}

// Remove legacy example boards if they exist without a workspaceId
export function cleanupExampleBoards(): void {
  const examples = new Set(['BackOffice', 'Corporate', 'Teramed', 'Corporate', 'Baika Pay'])
  const boards = getBoards()
  const filtered = boards.filter(b => b.workspaceId || !examples.has(b.name))
  if (filtered.length !== boards.length) saveBoards(filtered)
}



