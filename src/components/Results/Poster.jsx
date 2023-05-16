export default function Poster({ poster }) {
  return (
    <div className='movie-poster'>
      <img
        src={poster}
        alt='movie poster'
      />
    </div>
  )
}
