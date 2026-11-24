import { useState } from 'react'
import { Icon } from './Icon'

interface PosterProps {
  src: string | null
  title: string
  /** Decorative inside a labelled control; otherwise describe the image. */
  decorative?: boolean
  eager?: boolean
  className?: string
}

/** A 2:3 poster that falls back to a placeholder when there is no image or it fails to load. */
export function Poster({ src, title, decorative = true, eager = false, className = '' }: PosterProps) {
  const [failed, setFailed] = useState<string | null>(null)
  const broken = !src || failed === src

  if (broken) {
    return (
      <div
        className={`poster poster--fallback ${className}`}
        data-testid='poster-fallback'
        {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `No poster for ${title}` })}>
        <Icon name='film' className='poster__icon' />
        <span className='poster__title'>{title}</span>
      </div>
    )
  }
  return (
    <img
      className={`poster ${className}`}
      src={src}
      alt={decorative ? '' : `Poster for ${title}`}
      width={300}
      height={450}
      loading={eager ? 'eager' : 'lazy'}
      decoding='async'
      onError={() => setFailed(src)}
    />
  )
}
