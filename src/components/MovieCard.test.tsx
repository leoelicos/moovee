import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieCard } from './MovieCard'

describe('MovieCard', () => {
  it('labels series and opens on click', async () => {
    const onOpen = vi.fn()
    const movie = { id: 'tt1', title: 'Andor', year: '2022–2025', type: 'series' as const, poster: null }
    render(<MovieCard movie={movie} onOpen={onOpen} />)
    const card = screen.getByRole('button', { name: /^Andor,\s*2022–2025,\s*Series$/ })
    expect(card).toHaveTextContent('Series')
    await userEvent.click(card)
    expect(onOpen).toHaveBeenCalledWith(movie)
  })
})
