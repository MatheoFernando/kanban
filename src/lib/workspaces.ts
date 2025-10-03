export interface Workspace {
  id: string
  name: string
  createdAt: number
}

const STORAGE_KEY = 'kanban-workspaces'

export function getWorkspaces(): Workspace[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed as Workspace[] : [] } catch { return [] }
}

export function saveWorkspaces(workspaces: Workspace[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces))
}

export function createWorkspace(name: string): Workspace {
  const id = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `ws-${Date.now()}`
  const ws: Workspace = { id, name, createdAt: Date.now() }
  const list = getWorkspaces()
  if (!list.some(w => w.id === ws.id)) { list.push(ws); saveWorkspaces(list) }
  return ws
}

export function getWorkspaceById(id: string): Workspace | undefined {
  return getWorkspaces().find(w => w.id === id)
}

export function ensureWorkspacesSeeded(): Workspace[] {
  let list = getWorkspaces()
  if (list.length === 0) {
    list = [createWorkspace('Wokhop Team Front-end')]
  }
  return list
}


export function renameWorkspace(id: string, newName: string): Workspace | undefined {
  const workspaces = getWorkspaces()
  const idx = workspaces.findIndex(w => w.id === id)
  if (idx < 0) return undefined
  const cleanId = newName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const updated: Workspace = {
    ...workspaces[idx],
    id: cleanId || workspaces[idx].id,
    name: newName.trim() || workspaces[idx].name,
  }
  const oldId = workspaces[idx].id
  workspaces[idx] = updated
  saveWorkspaces(workspaces)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getBoards, saveBoards } = require('./boards') as typeof import('./boards')
    if (updated.id !== oldId) {
      const boards = getBoards().map(b => (b.workspaceId === oldId ? { ...b, workspaceId: updated.id } : b))
      saveBoards(boards)
    }
  } catch {}
  return updated
}

export function deleteWorkspace(id: string): void {
  const list = getWorkspaces().filter(w => w.id !== id)
  saveWorkspaces(list)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getBoards, saveBoards } = require('./boards') as typeof import('./boards')
    const fallbackWsId = list[0]?.id
    if (!fallbackWsId) return
    const boards = getBoards().map(b => (b.workspaceId === id ? { ...b, workspaceId: fallbackWsId } : b))
    saveBoards(boards)
  } catch {}
}

