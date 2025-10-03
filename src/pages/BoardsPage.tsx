import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createBoard, storageKeyForTasks, storageKeyForColumns, getBoards, saveBoards, renameBoard, togglePin, deleteBoard, type Board } from '../lib/boards'
import { ensureWorkspacesSeeded, getWorkspaceById, getWorkspaces } from '../lib/workspaces'
import { FolderKanban, Edit3, Pin, PinOff, Trash2 } from 'lucide-react'

export default function BoardsPage() {
  const navigate = useNavigate()
  const { wsId } = useParams()
  const [version, setVersion] = useState(0)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const boards = useMemo(() => {
    const all = getBoards().sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.createdAt - a.createdAt)
    if (all.length === 0) {
      return [{ id: 'teste', name: 'Teste', category: 'work', createdAt: Date.now(), pinned: true, description: 'Board de testes com tarefas de exemplo', workspaceId: 'wokhop-team-front-end', icon: '🧪' } as any]
    }
    return wsId ? all.filter(b => b.workspaceId === wsId) : all
  }, [version, wsId])
  const workspaces = useMemo(() => getWorkspaces(), [version])

  const startRename = (b: Board) => { setRenameId(b.id); setRenameValue(b.name) }
  const confirmRename = () => { if (renameId && renameValue.trim()) { renameBoard(renameId, renameValue.trim()); setVersion(v=>v+1) } setRenameId(null); setRenameValue('') }
  const cancelRename = () => { setRenameId(null); setRenameValue('') }
  const confirmDelete = () => { if (deleteId) { deleteBoard(deleteId); setVersion(v=>v+1) } setDeleteId(null) }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-slate-500" />
          <h1 className="text-xl font-semibold">{wsId ? `Boards · ${getWorkspaceById(wsId)?.name ?? ''}` : 'Boards'}</h1>
        </div>
      </div>

      {wsId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((b: Board) => (
            <div key={b.id} className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
              <Link to={`/boards/${b.id}`} className="flex items-center gap-3">
                <div className="h-10 w-14 rounded bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  {b.icon === 'Building2' ? <span className="text-xs">B2</span> : b.icon === 'Globe' ? <span className="text-xs">G</span> : <span className="text-xs">Br</span>}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.name}</div>
                  {b.description && <div className="text-xs text-slate-500 truncate">{b.description}</div>}
                </div>
              </Link>
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button title={b.pinned ? 'Desafixar' : 'Fixar'} onClick={() => { togglePin(b.id); setVersion(v => v + 1) }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                  {b.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
                <button title="Renomear" onClick={() => startRename(b)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button title="Remover" onClick={() => setDeleteId(b.id)} className="p-1 rounded hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {boards.length === 0 && (
            <div className="col-span-full text-center text-slate-500">Nenhum board neste workspace. Crie o primeiro no botão Criar acima.</div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {workspaces.length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Wokhop Team Front-end</h2>
                <button onClick={() => navigate(`/w/wokhop-team-front-end/boards`)} className="text-sm px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">Ver todos</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
                  <button
                    onClick={() => {
                      const ws = ensureWorkspacesSeeded()[0]
                      const existing = getBoards().find(b => b.id === 'teste')
                      const board = existing || createBoard('Teste', 'work', 'Board de testes com tarefas de exemplo', '🧪', ws?.id)
                      // Pin it
                      const boards = getBoards().map(b => (b.id === board.id ? { ...b, pinned: true } : b))
                      saveBoards(boards)
                      // Seed tasks/columns if missing
                      const tKey = storageKeyForTasks(board.id)
                      const cKey = storageKeyForColumns(board.id)
                      try {
                        const cur = JSON.parse(localStorage.getItem(tKey) || '[]')
                        if (!Array.isArray(cur) || cur.length === 0) {
                          localStorage.setItem(tKey, JSON.stringify([
                            { id: 't1', title: 'Configurar projeto', status: 'todo', priority: 'high', description: 'Inicializar repositório e configurações básicas.' },
                            { id: 't2', title: 'Criar componentes UI', status: 'in-progress', priority: 'medium', description: 'Buttons, inputs, modais.', dependencies: ['t1'] },
                            { id: 't3', title: 'Integração i18n', status: 'done', priority: 'low', description: 'Português e Inglês.', dependencies: ['t2'] },
                          ]))
                        }
                      } catch {}
                      try {
                        const curC = JSON.parse(localStorage.getItem(cKey) || 'null')
                        if (!curC) {
                          localStorage.setItem(cKey, JSON.stringify([
                            { id: 'todo', title: 'A Fazer', status: 'todo' },
                            { id: 'in-progress', title: 'Em Progresso', status: 'in-progress' },
                            { id: 'done', title: 'Concluído', status: 'done' }
                          ]))
                        }
                      } catch {}
                      navigate(`/w/${ws?.id}/boards/${board.id}`)
                    }}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className="h-10 w-14 rounded bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">🧪</div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">Teste</div>
                      <div className="text-xs text-slate-500 truncate">Board de testes com tarefas de exemplo</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : workspaces.map(ws => {
            const wsBoards = boards.filter(b => b.workspaceId === ws.id)
            return (
              <div key={ws.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{ws.name}</h2>
                  <button onClick={() => navigate(`/w/${ws.id}/boards`)} className="text-sm px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">Ver todos</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wsBoards.map((b: Board) => (
                    <div key={b.id} className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition">
                      <Link to={`/boards/${b.id}`} className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                          {b.icon === 'Building2' ? <span className="text-xs">B2</span> : b.icon === 'Globe' ? <span className="text-xs">G</span> : <span className="text-xs">Br</span>}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{b.name}</div>
                          {b.description && <div className="text-xs text-slate-500 truncate">{b.description}</div>}
                        </div>
                      </Link>
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button title={b.pinned ? 'Desafixar' : 'Fixar'} onClick={() => { togglePin(b.id); setVersion(v => v + 1) }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                          {b.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </button>
                        <button title="Renomear" onClick={() => startRename(b)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button title="Remover" onClick={() => setDeleteId(b.id)} className="p-1 rounded hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {wsBoards.length === 0 && (
                    <div className="col-span-full text-center text-slate-500">Sem boards neste workspace.</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {renameId && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={cancelRename} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <h3 className="font-medium mb-3">Renomear board</h3>
              <input value={renameValue} onChange={e=>setRenameValue(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={cancelRename} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">Cancelar</button>
                <button onClick={confirmRename} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Salvar</button>
              </div>
            </div>
          </div>
        </>
      )}

      {deleteId && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={()=>setDeleteId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <h3 className="font-medium mb-3">Remover board?</h3>
              <p className="text-sm text-slate-500 mb-3">Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-2">
                <button onClick={()=>setDeleteId(null)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">Cancelar</button>
                <button onClick={confirmDelete} className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">Remover</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}



