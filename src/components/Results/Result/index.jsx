/* react */
import { useRef, useState } from 'react'

/* hooks */
import useOMDBById from '../../../hooks/useOMDBById.js'

/* components */
import Details from './Details/index.jsx'
import Poster from './Poster/index.jsx'

/* style */
import './style/result-container.css'
import './style/result.css'

export default function Result({ poster, title, year, imdbID }) {
  const [isPosterComponent, setIsPosterComponent] = useState(true)

  const { loading, error, data, search } = useOMDBById()

  const hasToggled = useRef(false)

  const togglePoster = () => {
    /* when they click this, state should be stored so when they click it again it prevents a new fetch */
    setIsPosterComponent((prev) => !prev)

    if (!hasToggled.current) {
      search(imdbID)
      hasToggled.current = true
      console.log('set toggled to true')
    }
  }

  const PosterComponent = (
    <Poster
      src={poster}
      togglePoster={togglePoster}
    />
  )

  const DetailsComponent = (
    <Details
      title={title}
      year={year}
      imdbID={imdbID}
      togglePoster={togglePoster}
      loading={loading}
      error={error}
      data={data}
    />
  )

  return (
    <div className={`result-container ${!poster ? 'empty' : ''}`}>
      <div className='result'>
        {isPosterComponent ? PosterComponent : DetailsComponent}
        <div className='result-title'>{title}</div>
        <div className='result-year'>{year}</div>
      </div>
    </div>
  )
}
