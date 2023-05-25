import { useContext, useState } from 'react'
import useOMDBById from '../../../hooks/useOMDBById'
import useYouTube from '../../../hooks/useYouTube'

import { Tag, Button, Empty } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFilm } from '@fortawesome/free-solid-svg-icons'
import NoPosterLogo from '../../../images/noposter.png'
import { MovieContext, MovieDispatchContext } from '../../../context'
import Stars from './Stars'

import './style/result-container.css'
import './style/result.css'

export default function Result({ poster, title, esrb, year, genre, actors, plot, imdbRating }) {
  const {
    loading: loadingById,
    data: dataById,
    search: searchById //
  } = useOMDBById()

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
    <div className='result-container'>
      <div className='result'>
        {isPoster ? (
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
        ) : (
          <div className='details'>
            <Button
              className='back'
              block
              type='dashed'
              onClick={togglePoster}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <h3 className='title'>{title || 'Untitled'}</h3>
            <Stars stars={imdbRating} />

            <Button
              block
              loading={youTubeLoading}
              disabled={youTubeError}
              className='trailer-btn'
              type='primary'
              onClick={handleClickTrailer}>
              <FontAwesomeIcon icon={faFilm} />
            </Button>

            {year && <div className='year'>{year}</div>}

            {esrb && <div className='esrb'>{esrb}</div>}

            {plot && <div className='plot'>{plot}</div>}

            {actors && actors.length > 0 && (
              <div className='actors'>
                {actors.split(', ').map((actor, i) => (
                  <Tag
                    key={i}
                    color='#222'
                    style={{ color: 'white' }}>
                    {actor}
                  </Tag>
                ))}
              </div>
            )}

            {genre && genre.length > 0 && (
              <div className='genre'>
                {genre.map((g, i) => (
                  <Tag
                    color='black'
                    key={i}>
                    {g}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
