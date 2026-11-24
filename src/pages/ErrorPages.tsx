import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Message } from '../components/States'

export function NotFoundPage() {
  return (
    <div className='page'>
      <h1 className='visually-hidden'>Page not found</h1>
      <Message
        title='This page wandered off'
        action={
          <Link className='button button--primary' to='/'>
            Back to search
          </Link>
        }>
        <p>The link may be old or mistyped.</p>
      </Message>
    </div>
  )
}

export function RouteErrorPage() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'
  return (
    <main id='main' className='page'>
      <h1 className='visually-hidden'>Something went wrong</h1>
      <Message
        tone='error'
        title='Holy cow, something broke'
        action={
          <a className='button button--primary' href='/'>
            Reload Moovee
          </a>
        }>
        <p>{detail}</p>
      </Message>
    </main>
  )
}
