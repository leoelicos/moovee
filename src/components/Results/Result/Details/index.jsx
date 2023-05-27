import BackButton from './BackButton/index.jsx'
import TrailerButton from './TrailerButton/index.jsx'
import './style/details.css'

import useOMDBById from '../../../../hooks/useOMDBById.js'
import GetDetailsButton from './GetDetailsButton/index.jsx'
import MovieData from './MovieData/index.jsx'

export default function Details({
  togglePoster,
  title,
  year,
  imdbID //
}) {
  const { loading, error, data, search } = useOMDBById()

  const handleClickGetDetailsButton = () => {
    console.log('handleClickGetDetailsButton')
    search(imdbID)
  }

  return (
    <div className='details'>
      <TrailerButton
        title={title}
        year={year}
      />

      <GetDetailsButton
        onClick={handleClickGetDetailsButton}
        loading={loading}
        error={error}
      />
      <MovieData data={data} />

      <BackButton onClick={togglePoster} />
    </div>
  )
}
