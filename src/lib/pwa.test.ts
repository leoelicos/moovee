import { registerServiceWorker } from './pwa'

describe('registerServiceWorker', () => {
  it('does nothing outside production or without support', async () => {
    await expect(registerServiceWorker(navigator, false)).resolves.toBeNull()
    await expect(registerServiceWorker({} as Navigator, true)).resolves.toBeNull()
  })

  it('registers /sw.js and swallows failures', async () => {
    const register = vi.fn().mockResolvedValueOnce({ scope: '/' }).mockRejectedValueOnce(new Error('nope'))
    const nav = { serviceWorker: { register } } as unknown as Navigator
    await expect(registerServiceWorker(nav, true)).resolves.toEqual({ scope: '/' })
    expect(register).toHaveBeenCalledWith('/sw.js')
    await expect(registerServiceWorker(nav, true)).resolves.toBeNull()
  })
})
