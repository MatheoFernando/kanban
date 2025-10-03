import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { getWorkspaces } from '../lib/workspaces';

function InlineWorkspaceEditor({ workspaceId, name }: { workspaceId: string; name: string }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(name);
  const [editing, setEditing] = useState(false);
  const startEdit = (e: React.MouseEvent) => { e.stopPropagation(); setEditing(true) };
  const commit = async () => {
    const newName = value.trim();
    if (!newName || newName === name) { setEditing(false); setValue(name); return }
    const m = await import('../lib/workspaces');
    m.renameWorkspace(workspaceId, newName);
    setEditing(false);
    // refresh without hard reload
    try { (window as any).dispatchEvent(new Event('storage')) } catch {}
  };
  return (
    <div className="flex items-center gap-2 w-full">
      {editing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setValue(name) } }}
          className="flex-1 bg-transparent border-b border-blue-500 focus:outline-none text-sm"
          autoFocus
        />
      ) : (
        <span className="font-medium text-sm truncate" onDoubleClick={startEdit}>{name}</span>
      )}
      <button onClick={startEdit} className="text-xs underline opacity-60 hover:opacity-100">{t('modals.edit')}</button>
      <button onClick={async (e) => { e.stopPropagation(); (window as any).dispatchEvent(new CustomEvent('open-delete-workspace', { detail: { id: workspaceId, name } })) }} className="text-xs text-red-600 underline opacity-60 hover:opacity-100">{t('modals.remove')}</button>
    </div>
  );
}

export function LeftSidebar({ onOpenCreateWs, isMobile = false }: { onOpenCreateWs: () => void, isMobile?: boolean }) {
  const { t } = useTranslation();
  const workspaces = getWorkspaces();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeWsMatch = pathname.match(/^\/w\/([^/]+)\/boards/);
  const activeWsId = activeWsMatch ? activeWsMatch[1] : null;
  const visibleWorkspaces = workspaces;
  return (
    <aside className={`${isMobile ? 'block' : 'hidden md:block'} w-64 shrink-0`} data-tour="sidebar">
      <div className="sticky top-20 space-y-4">
        <nav className="space-y-1">
          <button onClick={() => navigate('/boards')} className={`w-full text-left px-3 py-2 rounded-md text-sm ${pathname === '/boards' ? 'border-l-2 border-blue-500 bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`} data-tour="nav-home">
            {t('navigation.home')}
          </button>
          <button onClick={onOpenCreateWs} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm" data-tour="nav-create-workspace">
            {t('navigation.createWorkspace')}
          </button>
        </nav>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{t('navigation.workspaces')}</div>
          <ul className="space-y-1">
            {visibleWorkspaces.map(ws => {
              const isActive = ws.id === activeWsId;
              return (
                <li key={ws.id}>
                  <button
                    onClick={() => navigate(`/w/${ws.id}/boards`)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition
                      ${isActive ? 'border-l-2 border-blue-500 bg-slate-100 dark:bg-slate-800' : 'border-l-2 border-transparent hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <InlineWorkspaceEditor workspaceId={ws.id} name={ws.name} />
                  </button>
                </li>
              );
            })}
            {visibleWorkspaces.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-slate-500">{t('navigation.noWorkspaces')}</li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}
