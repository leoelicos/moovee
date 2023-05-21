import { useContext } from 'react'
import { Tag, Button } from 'antd'
import useYouTube from '../../../hooks/useYouTube'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faStar } from '@fortawesome/free-solid-svg-icons'
import NoPosterLogo from '../../../images/noposter.png'
import { MovieContext, MovieDispatchContext } from '../../../context'

export default function Result({ poster, title, esrb, year, genre, actors, plot, imdbRating, idx }) {
  const dispatch = useContext(MovieDispatchContext)
  const { searchYouTube } = useYouTube(dispatch)

  const { youTubeLoading, youTubeError } = useContext(MovieContext)

  const handleClickPoster = async () => {
    console.log('handleClickPoster')
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
  const getImdbClass = () =>
    imdbRating <= 2
      ? 'one' //
      : imdbRating <= 4
      ? 'two'
      : imdbRating <= 6
      ? 'three'
      : imdbRating <= 8
      ? 'four'
      : 'five'

  const ImdbStars = Stars(imdbRating)

  return (
    <div className='result-container'>
      <div className='result'>
        <Button
          block
          type='primary'
          className='poster'
          onClick={handleClickPoster}>
          <img
            src={poster || NoPosterLogo}
            alt='movie poster'
          />
        </Button>
        <div className='details'>
          <div className='panel'>
            {
              <div className='deets'>
                <h3 className='title'>{title || 'Untitled'}</h3>
                <span className={getImdbClass()}>{ImdbStars}</span>
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
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function Stars(stars) {
  const Star = <FontAwesomeIcon icon={faStar} />
  return !stars ? (
    '' //
  ) : stars <= 2 ? (
    <Star />
  ) : stars <= 4 ? (
    <>
      <Star />
      <Star />
    </>
  ) : stars <= 6 ? (
    <>
      <Star />
      <Star />
      <Star />
    </>
  ) : stars <= 8 ? (
    <>
      <Star />
      <Star />
      <Star />
      <Star />
    </>
  ) : (
    <>
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
    </>
  )
}
