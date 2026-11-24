import { useState } from 'react'
import { applyTheme, getTheme, nextTheme, type ThemeChoice } from '../lib/theme'
import { Icon } from './Icon'

const LABEL: Record<ThemeChoice, string> = { system: 'System', light: 'Light', dark: 'Dark' }
const ICON = { system: 'system', light: 'sun', dark: 'moon' } as const

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>(getTheme)
  const next = nextTheme(theme)
  return (
    <button
      type='button'
      className='icon-button'
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[theme]}`}
      onClick={() => {
        applyTheme(next)
        setTheme(next)
      }}>
      <Icon name={ICON[theme]} />
    </button>
  )
}
