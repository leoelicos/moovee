import type { KeyboardEvent } from 'react'
import { columnsOf, focusSearch } from './dom'

/** Arrow keys move through the grid row by row, like a native grid. */
export function handleGridKeys(event: KeyboardEvent<HTMLElement>): void {
  const cards = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-card]'))
  const index = cards.indexOf(document.activeElement as HTMLElement)
  if (index === -1) return
  const columns = columnsOf(cards)
  let next: number | null = null
  switch (event.key) {
    case 'ArrowRight':
      next = Math.min(index + 1, cards.length - 1)
      break
    case 'ArrowLeft':
      next = Math.max(index - 1, 0)
      break
    case 'ArrowDown':
      next = Math.min(index + columns, cards.length - 1)
      break
    case 'ArrowUp':
      if (index < columns) {
        event.preventDefault()
        focusSearch()
        return
      }
      next = index - columns
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = cards.length - 1
      break
    default:
      return
  }
  event.preventDefault()
  cards[next]?.focus()
}
