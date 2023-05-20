import { useCallback, useState } from 'react'
import axios from 'axios'

const { REACT_APP_OMDB_KEY: key } = process.env

export default function useOMDB() {
  const [omdbLoading, setOmdbLoading] = useState(null)
  const [omdbMovies, setOmdbMovies] = useState([])

  const searchOMDB = useCallback(async (str) => {
    console.log('searchOMDB', { str })
    setOmdbLoading(true)
    try {
      if (str === undefined) throw new Error('searchOMDB: No query')
      if (key === undefined) throw new Error('searchOMDB: No key')

      const res = await fetch(`https://www.omdbapi.com?apikey=${key}&type=movie&page=1&s=${str}`)

      const data = await res.json()
      const movies = data.Search.filter((v) => v.hasOwnProperty('imdbID'))
      const parsedMovies = movies.map(parseBySearch)
      console.log({ parsedMovies })
      setOmdbMovies(parsedMovies)
    } catch (error) {
      console.error(error)
    } finally {
      setOmdbLoading(false)
    }
  }, [])

  const searchOMDBById = useCallback(async (id) => {
    console.log('searchOMDBById', { id })
    setOmdbLoading(true)
    try {
      if (id === undefined) throw new Error('searchOMDBById: No id')
      if (key === undefined) throw new Error('searchOMDBById: No key')

      const uri = 'https://www.omdbapi.com'
      const params = { apikey: key, type: 'movie' }
      const query = async (id) => await axios(uri, { params, i: id })
      const res = await query(id)
      const data = await res.data
      const parsedMovie = parseById(data)
      console.log({ parsedMovie })
      setOmdbMovies((prev) => (prev.imdbID === id ? { ...prev, ...parsedMovie } : prev))
    } catch (error) {
      console.error(error)
    } finally {
      setOmdbLoading(false)
    }
  }, [])

  return { omdbLoading, omdbMovies, searchOMDB, searchOMDBById }
}

const parseBySearch = (data) => ({
  imdbID: data.imdbID,
  poster: data.Poster === 'N/A' ? null : data.Poster,
  title: data.Title === 'N/A' ? null : data.Title,
  year: data.Year === 'N/A' ? null : data.Year
})

const parseById = (data) => ({
  esrb: data.Rated === 'N/A' ? null : data.Rated,
  genre: data.Genre === 'N/A' ? null : data.Genre.split(', '),
  actors: data.Actors || [],
  plot: data.Plot === 'N/A' ? null : data.Plot,
  imdbRating: data.Ratings?.length === 0 ? null : parseFloat(data.Ratings.find((r) => r.Source === 'Internet Movie Database').Value)
})
