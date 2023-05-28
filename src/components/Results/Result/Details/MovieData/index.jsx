import { Spin, Tag } from 'antd'
import Stars from './Stars.jsx'
export default function MovieData({ data, loading, error }) {
  // console.log({ data })

  const { esrb, plot, actors, genre, imdbRating } = data

  if (loading) return <Spin />
  else if (error) return null
  return (
    <div className='movie-data'>
      <Stars stars={imdbRating} />

      {esrb && (
        <div className='esrb'>
          <div className='label'>Rating:</div>
          <div className='data'>{esrb}</div>
        </div>
      )}

      {plot && (
        <div className='plot'>
          <div className='label'>Plot:</div>
          <div className='data'>{plot}</div>
        </div>
      )}

      {actors && actors.length > 0 && (
        <div className='actors'>
          <div className='label'>Actors:</div>
          <div className='data'>
            {actors.split(', ').map((actor, i) => (
              <Tag
                key={i}
                color='#222'
                style={{ color: 'white' }}>
                {actor}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {genre && genre.length > 0 && (
        <div className='genre'>
          <div className='label'>Genre:</div>
          <div className='data'>
            {genre.map((g, i) => (
              <Tag
                color='black'
                key={i}>
                {g}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {!esrb && !plot && !actors && !genre && <div className='label'>No data</div>}
    </div>
  )
}
