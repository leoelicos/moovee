import { fireEvent, render, screen } from '@testing-library/react'
import { Poster } from './Poster'

describe('Poster', () => {
  it('shows a labelled placeholder when there is no image', () => {
    render(<Poster src={null} title='Heat' decorative={false} />)
    expect(screen.getByRole('img', { name: 'No poster for Heat' })).toHaveTextContent('Heat')
  })

  it('swaps to the placeholder when the image fails to load', () => {
    const { container } = render(<Poster src='https://x.test/p.jpg' title='Heat' eager />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('alt', '')
    fireEvent.error(img as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByTestId('poster-fallback')).toHaveAttribute('aria-hidden', 'true')
  })

  it('describes a real poster when not decorative', () => {
    render(<Poster src='https://x.test/p.jpg' title='Heat' decorative={false} />)
    expect(screen.getByRole('img', { name: 'Poster for Heat' })).toHaveAttribute('loading', 'lazy')
  })
})
