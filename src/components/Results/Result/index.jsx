import { useContext, useState } from 'react'
import { Tag, Button, Empty } from 'antd'
import useYouTube from '../../../hooks/useYouTube'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFilm } from '@fortawesome/free-solid-svg-icons'
import NoPosterLogo from '../../../images/noposter.png'
import { MovieContext, MovieDispatchContext } from '../../../context'
import Stars from './Stars'

export default function Result({ poster, title, esrb, year, genre, actors, plot, imdbRating }) {
  const [active, setActive] = useState(false)
  const dispatch = useContext(MovieDispatchContext)
  const { searchYouTube } = useYouTube(dispatch)

  const { youTubeLoading, youTubeError } = useContext(MovieContext)

  const handleClickPoster = async () => {
    console.log('handleClickPoster')
    setActive((prev) => !prev)
  }

  const handleClickTrailer = async () => {
    try {
      console.log('handleClickTrailer')
      const query = [title || '', year || '', 'trailer'].join('+').replace(/\s/g, '%20')
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
        {active ? (
          <Button
            className='poster'
            block
            type='primary'
            onClick={handleClickPoster}>
            {poster ? (
              <img
                src={poster}
                alt='movie poster'
              />
            ) : (
              // <div className='noposter'>No poster</div>
              <Empty
                image={NoPosterLogo}
                description='hello'
              />
            )}
          </Button>
        ) : (
          <div className='details'>
            <Button
              className='back'
              block
              type='dashed'
              onClick={handleClickPoster}>
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
