export default function NoPoster({ title }) {
  return (
    <div className='movie-poster'>
      <div className='noposter'>
        <div className='title'>{title}</div>
        <div className='text'>No poster</div>
      </div>
    </div>
  )
}
