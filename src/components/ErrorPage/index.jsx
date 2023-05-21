import { useRouteError } from 'react-router-dom'
import CheerUpImage from './components/CheerUpImage.jsx'
import Heading from './components/Heading.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import './style/index.css'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className='error-page'>
      <Heading />
      <ErrorMessage text={error.statusText || error.message} />
      <CheerUpImage />
    </div>
  )
}
