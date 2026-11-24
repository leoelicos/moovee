export type ThemeChoice = 'system' | 'light' | 'dark'
export const THEME_KEY = 'moovee:theme'
export const THEME_EVENT = 'moovee:theme'
export const THEME_ORDER: ThemeChoice[] = ['system', 'light', 'dark']

export function getTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

/** `data-theme` is only set for an explicit choice; otherwise CSS follows prefers-color-scheme. */
export function applyTheme(choice: ThemeChoice, root: HTMLElement = document.documentElement): void {
  if (choice === 'system') delete root.dataset.theme
  else root.dataset.theme = choice
  try {
    if (choice === 'system') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, choice)
  } catch {
    // Ignore storage failures.
  }
  window.dispatchEvent(new Event(THEME_EVENT))
}

export const nextTheme = (choice: ThemeChoice): ThemeChoice =>
  THEME_ORDER[(THEME_ORDER.indexOf(choice) + 1) % THEME_ORDER.length] ?? 'system'
