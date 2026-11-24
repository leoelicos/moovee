import { render, screen, within } from '@testing-library/react'
import { toDetails } from '../api/omdb'
import { movieResponse } from '../test/fixtures'
import { MovieBody } from './MovieDialog'

describe('MovieBody', () => {
  it('shows series facts and hides empty sections', () => {
    const movie = toDetails(
      movieResponse({
        Type: 'series',
        totalSeasons: '4',
        Genre: 'N/A',
        Ratings: [{ Source: 'Fan poll', Value: 'Loved' }],
        Plot: 'N/A',
        Actors: 'N/A'
      })
    )
    render(<MovieBody movie={movie} />)
    expect(screen.getByText('Seasons').nextSibling).toHaveTextContent('4')
    expect(screen.queryByRole('list', { name: 'Genres' })).not.toBeInTheDocument()
    expect(screen.queryByText('Starring')).not.toBeInTheDocument()
    const ratings = screen.getByRole('list', { name: 'Ratings' })
    expect(within(ratings).getByText('Loved')).toBeInTheDocument()
  })

  it('renders without ratings', () => {
    render(<MovieBody movie={toDetails(movieResponse({ Ratings: [], Rated: 'N/A' }))} />)
    expect(screen.queryByRole('list', { name: 'Ratings' })).not.toBeInTheDocument()
    expect(screen.getByText('1999 · 136 min')).toBeInTheDocument()
  })
})
