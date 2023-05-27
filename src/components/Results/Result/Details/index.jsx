import BackButton from './BackButton/index.jsx'
import TrailerButton from './TrailerButton/index.jsx'
import './style/details.css'
import MovieData from './MovieData/index.jsx'

export default function Details({
  togglePoster,
  title,
  year,
  loading,
  error,
  data //
}) {
  return (
    <div className='details'>
      <TrailerButton
        title={title}
        year={year}
      />
      <MovieData
        data={data}
        loading={loading}
        error={error}
      />
      <BackButton onClick={togglePoster} />
    </div>
  )
}
