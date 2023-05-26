import { useContext, useState } from 'react'
import useOMDBById from '../../../hooks/useOMDBById'
import useYouTube from '../../../hooks/useYouTube'

import { Button } from 'antd'

import NoPosterLogo from '../../../images/noposter.png'
import { MovieContext, MovieDispatchContext } from '../../../context'

import './style/result-container.css'
import './style/result.css'
import Details from './Details/index.jsx'

export default function Result({ poster, title, esrb, year, genre, actors, plot, imdbRating }) {
  const { loading, data, search } = useOMDBById()

  const [isPoster, setIsPoster] = useState(true)
  const dispatch = useContext(MovieDispatchContext)
  const { searchYouTube } = useYouTube(dispatch)

  const { youTubeLoading, youTubeError } = useContext(MovieContext)

  const togglePoster = () => {
    setIsPoster((prev) => !prev)
  }

  const handleClickTrailer = async () => {
    try {
      console.log('handleClickTrailer')
      const query = encodeURIComponent([title || '', year || '', 'trailer'].join('+'))
      console.log({ query })
      await searchYouTube(query)
      dispatch({ type: 'modalOpen' })
    } catch (error) {
      console.error(error)
      dispatch({ type: 'modalClose' })
    }
  }

  return (
    <div className={`result-container ${!poster ? 'empty' : ''}`}>
      <div className='result'>
        {isPoster ? (
          <>
            <Button
              className='poster'
              block
              type='primary'
              onClick={togglePoster}>
              {poster ? (
                <img
                  src={poster}
                  alt='movie poster'
                />
              ) : (
                <div className='noposter'>
                  <div className='noposter-logo-wrapper'>
                    <img
                      className='noposter-logo'
                      src={NoPosterLogo}
                    />
                  </div>
                  <div className='noposter-text'>No Poster</div>
                </div>
              )}
            </Button>
            <div className='result-title'>{title}</div>
          </>
        ) : (
          <Details
            togglePoster={togglePoster}
            title={title}
            imdbRating={imdbRating}
            youTubeLoading={youTubeLoading}
            youTubeError={youTubeError}
            handleClickTrailer={handleClickTrailer}
            year={year}
            esrb={esrb}
            plot={plot}
            actors={actors}
            genre={genre}
          />
        )}
      </div>
    </div>
  )
}
