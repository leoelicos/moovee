import { act, renderHook, waitFor } from '@testing-library/react'
import { jsonResponse, mockFetch, searchItem, searchResponse } from '../test/fixtures'
import { useSearchResults, type SearchInput } from './useSearchResults'

const input: SearchInput = { query: 'up', type: undefined, year: '' }

describe('useSearchResults', () => {
  it('is idle without input', () => {
    const { result } = renderHook(() => useSearchResults(null, 'k'))
    expect(result.current).toMatchObject({ status: 'idle', items: [], hasMore: false })
  })

  it('keeps page-one results when a later page fails, and retries that page', async () => {
    let fail = false
    mockFetch({
      'www.omdbapi.com': (url) => {
        const page = Number(url.searchParams.get('page'))
        if (page === 2 && fail) return jsonResponse({}, 500)
        return jsonResponse(searchResponse([searchItem(page * 10), searchItem(page * 10 + 1)], 30))
      }
    })
    const { result } = renderHook(() => useSearchResults(input, 'k'))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.hasMore).toBe(true)
    fail = true
    act(() => result.current.loadMore())
    expect(result.current.loadingMore).toBe(true)
    await waitFor(() => expect(result.current.error?.message).toMatch('500'))
    expect(result.current).toMatchObject({ status: 'success', loadingMore: false, hasMore: false })
    expect(result.current.items).toHaveLength(2)
    fail = false
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.items).toHaveLength(4))
    expect(result.current.error).toBeNull()
  })

  it('drops duplicate titles across pages and reports network failures', async () => {
    let throwString = false
    mockFetch({
      'www.omdbapi.com': () => {
        if (throwString) throw 'boom'
        return jsonResponse(searchResponse([searchItem(1)], 30))
      }
    })
    const { result, rerender } = renderHook(({ value }) => useSearchResults(value, 'k'), {
      initialProps: { value: input }
    })
    await waitFor(() => expect(result.current.status).toBe('success'))
    act(() => result.current.loadMore())
    await waitFor(() => expect(result.current.loadingMore).toBe(false))
    expect(result.current.items).toHaveLength(1)
    throwString = true
    rerender({ value: { ...input, query: 'down' } })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toMatch(/Network error/)
  })
})
