import { jsonResponse } from '../test/fixtures'
import { ApiError, buildUrl, getJson, isAbortError } from './http'

describe('getJson', () => {
  it('returns parsed JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse({ ok: 1 }))
    await expect(getJson('https://x.test/')).resolves.toEqual({ ok: 1 })
  })

  it('maps HTTP errors', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse({}, 503))
    await expect(getJson('https://x.test/')).rejects.toMatchObject({ kind: 'http', status: 503 })
  })

  it('maps network errors', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(getJson('https://x.test/')).rejects.toMatchObject({ kind: 'network' })
  })

  it('maps aborts', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    const error = await getJson('https://x.test/').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(isAbortError(error)).toBe(true)
  })

  it('maps unreadable bodies', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('<html>', { status: 200 }))
    await expect(getJson('https://x.test/')).rejects.toMatchObject({ kind: 'api' })
  })
})

describe('buildUrl', () => {
  it('skips empty params', () => {
    expect(buildUrl('https://x.test/a', { a: 1, b: '', c: undefined, d: null, e: 'two words' })).toBe(
      'https://x.test/a?a=1&e=two+words'
    )
  })
})

describe('isAbortError', () => {
  it('is false for other errors', () => {
    expect(isAbortError(new Error('x'))).toBe(false)
    expect(isAbortError(new ApiError('network', 'x'))).toBe(false)
  })
})
