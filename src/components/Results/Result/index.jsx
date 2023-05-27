/* react */
import { useState } from 'react'

/* components */
import Details from './Details/index.jsx'

import Poster from './Poster/index.jsx'

/* style */
import './style/result-container.css'
import './style/result.css'

export default function Result({ poster, title, year, imdbID }) {
  const [isPosterComponent, setIsPosterComponent] = useState(true)

  const togglePoster = () => {
    setIsPosterComponent((prev) => !prev)
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
