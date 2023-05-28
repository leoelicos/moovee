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
