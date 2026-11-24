import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react'
import { wrapFocus } from '../lib/dom'

interface DialogProps {
  labelledBy: string
  onClose: () => void
  className?: string
  children: ReactNode
}

/**
 * Native modal <dialog>: the browser traps focus, makes the page inert and closes on Esc.
 * We add backdrop-click closing and put focus back where it was.
 */
export function Dialog({ labelledBy, onClose, className = '', children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const requestClose = useEffectEvent(() => onClose())

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!dialog.open) dialog.showModal()
    document.documentElement.classList.add('has-dialog')
    const onCancel = (event: Event) => {
      event.preventDefault()
      requestClose()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      document.documentElement.classList.remove('has-dialog')
      if (dialog.open) dialog.close()
      if (opener?.isConnected) opener.focus()
    }
  }, [])

  return (
    // Clicking the ::backdrop targets the dialog itself; Esc is handled by the native cancel event.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby={labelledBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') wrapFocus(event.currentTarget, event)
      }}>
      <div className='dialog__surface'>{children}</div>
    </dialog>
  )
}
