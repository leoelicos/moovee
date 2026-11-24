import { useEffect, useState } from 'react'
import { applyTheme, getTheme, nextTheme, THEME_EVENT, type ThemeChoice } from '../lib/theme'
import { Icon } from './Icon'

const LABEL: Record<ThemeChoice, string> = { system: 'System', light: 'Light', dark: 'Dark' }
const ICON = { system: 'system', light: 'sun', dark: 'moon' } as const

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>(getTheme)
  const next = nextTheme(theme)
  useEffect(() => {
    const sync = () => setTheme(getTheme())
    window.addEventListener(THEME_EVENT, sync)
    return () => window.removeEventListener(THEME_EVENT, sync)
  }, [])
  return (
    <button
      type='button'
      className='icon-button'
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[theme]}`}
      onClick={() => {
        applyTheme(next)
      }}>
      <Icon name={ICON[theme]} />
    </button>
  )
}
