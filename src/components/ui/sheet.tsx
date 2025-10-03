import { createContext, useContext, useEffect, useRef, useState, cloneElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SheetContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
}

const SheetCtx = createContext<SheetContextValue | null>(null)

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Sheet({ open: openProp, defaultOpen, onOpenChange, children }: SheetProps) {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(!!defaultOpen)
  const open = isControlled ? !!openProp : uncontrolledOpen
  const setOpen = (v: boolean) => {
    if (!isControlled) setUncontrolledOpen(v)
    onOpenChange?.(v)
  }
  return <SheetCtx.Provider value={{ open, setOpen }}>{children}</SheetCtx.Provider>
}

interface SheetTriggerProps {
  children: ReactNode
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const ctx = useContext(SheetCtx)
  if (!ctx) return null
  const { setOpen } = ctx
  if (isValidElement(children)) {
    return cloneElement(children as any, {
      onClick: (e: any) => {
        try { (children as any).props?.onClick?.(e) } catch {}
        setOpen(true)
      },
    })
  }
  return null
}

interface SheetContentProps {
  children: ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export function SheetContent({ children, side = 'right', className = '' }: SheetContentProps) {
  const ctx = useContext(SheetCtx)
  if (!ctx) return null
  const { open, setOpen } = ctx
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const variants: Record<string, any> = {
    left: { initial: { x: '-100%' }, animate: { x: 0 } },
    right: { initial: { x: '100%' }, animate: { x: 0 } },
    top: { initial: { y: '-100%' }, animate: { y: 0 } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 } },
  }

  const sizeClass = side === 'left' || side === 'right' ? 'w-80 max-w-[85vw] h-full' : 'h-80 max-h-[85vh] w-full'
  const positionClass = side === 'left' ? 'left-0 top-0' : side === 'right' ? 'right-0 top-0' : side === 'top' ? 'top-0 left-0' : 'bottom-0 left-0'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={ref}
            className={`fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${sizeClass} ${positionClass} ${className}`}
            initial={variants[side].initial}
            animate={variants[side].animate}
            exit={variants[side].initial}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            role="dialog"
            aria-modal
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">{children}</div>
}

export function SheetTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold">{children}</h3>
}

export function SheetDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{children}</p>
}
