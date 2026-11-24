import type { ReactNode } from 'react'
import { ApiError } from '../api/http'
import cow from '../assets/mooveeCow.png'

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className='results-region' aria-busy='true'>
      <p role='status' className='visually-hidden'>
        Loading results…
      </p>
      <ul className='grid' aria-hidden='true' data-testid='skeleton'>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className='card card--skeleton'>
            <div className='poster skeleton' />
            <div className='skeleton skeleton--line' />
            <div className='skeleton skeleton--line skeleton--short' />
          </li>
        ))}
      </ul>
    </div>
  )
}

interface MessageProps {
  title: string
  children?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'error'
}

export function Message({ title, children, action, tone = 'neutral' }: MessageProps) {
  return (
    <div className={`message message--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      <img src={cow} alt='' width={120} height={108} className='message__art' />
      <h2 className='message__title'>{title}</h2>
      {children ? <div className='message__body'>{children}</div> : null}
      {action ? <div className='message__action'>{action}</div> : null}
    </div>
  )
}

export function ErrorMessage({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  const missingKey = error instanceof ApiError && error.kind === 'missing-key'
  return (
    <Message
      tone='error'
      title={missingKey ? 'API key needed' : 'Something went wrong'}
      action={
        onRetry && !missingKey ? (
          <button type='button' className='button button--primary' onClick={onRetry}>
            Try again
          </button>
        ) : undefined
      }>
      <p>{error.message}</p>
    </Message>
  )
}
