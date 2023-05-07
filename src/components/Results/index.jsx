import { useState } from 'react'
// import { useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import Title from 'antd/es/typography/Title'
import Result from './Result.jsx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { faFaceMehBlank } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Results({ omdbLoading, omdbMovies }) {
  const [idxOfClickedTrailer, setIdxOfClickedTrailer] = useState(-1)
  const [trailerWasClicked, setTrailerWasClicked] = useState(false)
  const o = <FontAwesomeIcon icon={faFaceMehBlank} />

  if (1) return <h1>x</h1>

  if (omdbLoading)
    return (
      <Spin
        size='large'
        className='loading-spin'
      />
    )

  if (!omdbMovies.length)
    return (
      <div className='result-container empty'>
        <Title
          className='no-movies'
          level={5}>
          <span>
            N{o}&ensp;m{o}vies&ensp;{o}und
          </span>
        </Title>
      </div>
    )

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
