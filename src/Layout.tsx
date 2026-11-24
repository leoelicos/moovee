import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Footer } from './components/Footer'
import { CommandPalette } from './components/CommandPalette'
import { Header } from './components/Header'
import { MovieDialog } from './components/MovieDialog'
import { OfflineBanner } from './components/OfflineBanner'
import { ShortcutsDialog } from './components/ShortcutsDialog'
import { useMovieDialog } from './hooks/useMovieDialog'
import { focusSearch, isTypingTarget } from './lib/dom'

export function Layout() {
  const { openId, close } = useMovieDialog()
  const [shortcuts, setShortcuts] = useState(false)
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (!document.querySelector('dialog[open]')) setPalette(true)
        return
      }
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target) || document.querySelector('dialog[open]')) return
      if (event.key === '/') {
        event.preventDefault()
        focusSearch()
      } else if (event.key === '?') {
        event.preventDefault()
        setShortcuts(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a className='skip-link' href='#main'>
        Skip to content
      </a>
      <Header onShowShortcuts={() => setShortcuts(true)} onShowPalette={() => setPalette(true)} />
      <OfflineBanner />
      <main id='main' tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {openId ? <MovieDialog key={openId} id={openId} onClose={close} /> : null}
      {shortcuts ? <ShortcutsDialog onClose={() => setShortcuts(false)} /> : null}
      {palette ? <CommandPalette onClose={() => setPalette(false)} onShortcuts={() => setShortcuts(true)} /> : null}
    </>
  )
}
