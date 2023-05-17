//* useOMDB: loading and data states for OMDB API
//? searchOMDB(str) OMDB By Search
//? searchOMDBByID(id) OMDB By Id

import { useCallback, useState } from 'react'
const { REACT_APP_OMDB_KEY: key } = process.env

const parse = (imdbID, data) => ({
  imdbID: imdbID,
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

  const searchOMDB = useCallback(async (str) => {
    console.log('searchOMDB', { str })
    setOmdbLoading(true)
    try {
      const res = await fetch(`https://www.omdbapi.com?apikey=${key}&type=movie&page=1&s=${str}`)
      const data = await res.json()
      const { Search } = data
      const movies = Search.filter((v) => v.hasOwnProperty('imdbID'))
      setOmdbMovies(movies)
    } catch (error) {
      console.error(error)
    } finally {
      setOmdbLoading(false)
    }
  }, [])

  return { omdbLoading, omdbMovies, searchOMDB }
}
