import { useContext, useState } from 'react'

import Result from './Result.jsx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ResultsLoading from './ResultsLoading.jsx'
import ResultsEmpty from './ResultsEmpty.jsx'
import { OMDBContext } from '../../context/OMDBContext.jsx'

export default function Results() {
  const { omdbLoading, omdbMovies } = useContext(OMDBContext)

  const [idxOfClickedTrailer, setIdxOfClickedTrailer] = useState(-1)
  const [trailerWasClicked, setTrailerWasClicked] = useState(false)

  if (omdbLoading) return <ResultsLoading />
  if (!omdbMovies.length) return <ResultsEmpty />

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 450: 2, 679: 3 }}>
      <Masonry className='movie-grid'>
        {omdbMovies.map((movie, i) => (
          <Result
            key={i}
            idx={i}
            idxOfClickedTrailer={idxOfClickedTrailer}
            setIdxOfClickedTrailer={setIdxOfClickedTrailer}
            trailerWasClicked={trailerWasClicked}
            setTrailerWasClicked={setTrailerWasClicked}
            resetIdxOfClickedTrailer={() => {
              setIdxOfClickedTrailer(-1)
            }}
            {...movie}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
