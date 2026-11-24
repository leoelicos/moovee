import { columnsOf, focusFirstCard, focusSearch, isTypingTarget, SEARCH_INPUT_ID } from './dom'

describe('dom helpers', () => {
  it('detects typing targets', () => {
    expect(isTypingTarget(document.createElement('input'))).toBe(true)
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true)
    expect(isTypingTarget(document.createElement('select'))).toBe(true)
    const editable = document.createElement('div')
    Object.defineProperty(editable, 'isContentEditable', { value: true })
    expect(isTypingTarget(editable)).toBe(true)
    expect(isTypingTarget(document.createElement('button'))).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })

  it('focuses the search box and first card when present', () => {
    expect(focusFirstCard()).toBe(false)
    expect(() => focusSearch()).not.toThrow()
    document.body.innerHTML = `<input id="${SEARCH_INPUT_ID}" value="abc"><button data-card>1</button>`
    focusSearch()
    expect(document.activeElement?.id).toBe(SEARCH_INPUT_ID)
    expect(focusFirstCard()).toBe(true)
    expect(document.activeElement).toHaveAttribute('data-card')
  })

  it('counts columns from layout', () => {
    const at = (top: number) => ({ getBoundingClientRect: () => ({ top }) }) as HTMLElement
    expect(columnsOf([])).toBe(1)
    expect(columnsOf([at(0), at(0), at(0), at(200)])).toBe(3)
  })
})
