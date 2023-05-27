import { Tag } from 'antd'
import Stars from './Stars.jsx'
export default function MovieData({ data }) {
  console.log({ data })

  const { esrb, plot, actors, genre, imdbRating } = data
  return (
    <>
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
    </>
  )
}
