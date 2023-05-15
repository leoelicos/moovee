import { useState } from 'react'
import OMDbAPIById from '../api/omdbapi__by-id-or-title'
import OMDbAPIBySearch from '../api/omdbapi__by-search'

const parse = (imdbID, data) => ({
  imdbID,
  poster: data.Poster === 'N/A' ? null : data.Poster,
  title: data.Title === 'N/A' ? null : data.Title,
  esrb: data.Rated === 'N/A' ? null : data.Rated,
  year: data.Year === 'N/A' ? null : data.Year,
  genre: data.Genre === 'N/A' ? null : data.Genre.split(', '),
  actors: data.Actors || [],
  plot: data.Plot === 'N/A' ? null : data.Plot,
  imdbRating: data.Ratings?.length === 0 ? null : parseFloat(data.Ratings.find((r) => r.Source === 'Internet Movie Database').Value)
})

export default function useOMDB() {
  const [omdbLoading, setOmdbLoading] = useState(null)
  const [omdbMovies, setOmdbMovies] = useState([])
  const searchOMDB = async (str) => {
    console.log('searchOMDB', { str })
    setOmdbLoading(true)
    try {
      const searchData = await OMDbAPIBySearch(str)
      const promises = searchData
        .filter((v) => v.hasOwnProperty('imdbID'))
        .map(async ({ imdbID }) => {
          const x = await OMDbAPIById(imdbID)
          return parse(imdbID, x)
        })
      const movies = await Promise.all(promises)

      setOmdbMovies(movies)
    } catch (error) {
      console.error(error)
    } finally {
      setOmdbLoading(false)
    }
  }
  return { omdbLoading, omdbMovies, searchOMDB }
}
