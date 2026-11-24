import { wrapFocus } from '../lib/dom'

describe('wrapFocus', () => {
  it('cycles Tab and Shift+Tab inside the dialog', () => {
    document.body.innerHTML = '<div id="d"><button id="a">a</button><button id="b">b</button></div><p id="empty"></p>'
    const dialog = document.getElementById('d') as HTMLElement
    const preventDefault = vi.fn()
    document.getElementById('b')?.focus()
    wrapFocus(dialog, { shiftKey: false, preventDefault })
    expect(document.activeElement?.id).toBe('a')
    wrapFocus(dialog, { shiftKey: true, preventDefault })
    expect(document.activeElement?.id).toBe('b')
    wrapFocus(dialog, { shiftKey: true, preventDefault })
    expect(document.activeElement?.id).toBe('b')
    expect(preventDefault).toHaveBeenCalledTimes(2)
    wrapFocus(document.getElementById('empty') as HTMLElement, { shiftKey: false, preventDefault })
    expect(preventDefault).toHaveBeenCalledTimes(2)
  })
})
