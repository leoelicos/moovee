import { useRouteError } from 'react-router-dom'
import './index.css'
export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className='error-page'>
      <h1>Sorry, there's been an error.</h1>
      <code>{error.statusText || error.message}</code>
      <img
        src='https://media.tenor.com/AIn_03YkdKsAAAAM/cheer-up-beautiful-day.gif'
        alt='cheer up'
      />
    </div>
  )
}
