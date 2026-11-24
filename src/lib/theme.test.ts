import { applyTheme, getTheme, nextTheme, THEME_KEY } from './theme'

describe('theme', () => {
  it('defaults to system', () => {
    expect(getTheme()).toBe('system')
    localStorage.setItem(THEME_KEY, 'neon')
    expect(getTheme()).toBe('system')
  })

  it('applies and stores an explicit choice, and clears it for system', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(getTheme()).toBe('dark')
    applyTheme('system')
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(localStorage.getItem(THEME_KEY)).toBeNull()
  })

  it('cycles system → light → dark', () => {
    expect(nextTheme('system')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('system')
  })

  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getTheme()).toBe('system')
    expect(() => applyTheme('light')).not.toThrow()
  })
})
