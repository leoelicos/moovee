import { useEffect, useState } from 'react'

import Result from './Result.jsx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ResultsLoading from './ResultsLoading.jsx'
import ResultsEmpty from './ResultsEmpty.jsx'
import { useSearchParams } from 'react-router-dom'
import useOMDB from '../../hooks/useOMDB.js'

export default function Results() {
  const { omdbLoading, omdbMovies, searchOMDB } = useOMDB()

  const [idxOfClickedTrailer, setIdxOfClickedTrailer] = useState(-1)
  const [trailerWasClicked, setTrailerWasClicked] = useState(false)
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    console.log('useEffect Results')
    if (!query) return
    searchOMDB(query)
  }, [searchOMDB, query])

  if (omdbLoading) return <ResultsLoading />
  if (!omdbMovies) return <h1>OMDB Error</h1>
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
