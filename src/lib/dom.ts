/** True when focus is in a field where typing shortcuts would get in the way. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable === true
}

export const SEARCH_INPUT_ID = 'site-search'

export function focusSearch(): void {
  const input = document.getElementById(SEARCH_INPUT_ID)
  if (input instanceof HTMLInputElement) {
    input.focus()
    input.select()
  }
}

export function focusFirstCard(): boolean {
  const card = document.querySelector<HTMLElement>('[data-card]')
  card?.focus()
  return card !== null
}

/** How many cards sit on the first row of a grid, from their layout positions. */
export function columnsOf(cards: HTMLElement[]): number {
  const first = cards[0]
  if (!first) return 1
  const top = first.getBoundingClientRect().top
  const count = cards.filter((card) => Math.abs(card.getBoundingClientRect().top - top) < 2).length
  return Math.max(1, count)
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, iframe, [tabindex]:not([tabindex="-1"])'

/** Keeps Tab cycling inside the dialog instead of escaping to the browser toolbar. */
export function wrapFocus(dialog: HTMLElement, event: { shiftKey: boolean; preventDefault: () => void }): void {
  const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
  const first = items[0]
  const last = items.at(-1)
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
