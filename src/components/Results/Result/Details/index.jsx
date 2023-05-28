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
  data,
  trailer,
  setTrailer //
}) {
  return (
    <div className='details'>
      <TrailerButton
        title={title}
        year={year}
        data={data}
        trailer={trailer}
        setTrailer={setTrailer}
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
