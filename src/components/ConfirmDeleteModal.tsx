import { motion } from 'framer-motion';

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, name }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; name: string }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl">
          <h3 className="font-medium mb-2">Remover workspace?</h3>
          <p className="text-sm text-slate-500 mb-4">{`"${name}" será removido. Os boards serão movidos para outro workspace.`}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">Cancelar</button>
            <button onClick={onConfirm} className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">Remover</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
