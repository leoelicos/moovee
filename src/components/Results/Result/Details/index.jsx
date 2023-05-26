import { Tag, Button } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFilm } from '@fortawesome/free-solid-svg-icons'

import Stars from '../Stars.jsx'

export default function Details({
  togglePoster,
  title,
  imdbRating,
  youTubeLoading,
  youTubeError,
  handleClickTrailer,
  year,
  esrb,
  plot,
  actors,
  genre //
}) {
  return (
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
  )
}
