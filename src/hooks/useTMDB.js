import { useCallback, useState } from 'react'

import axios from 'axios'
import mockTMDB from '../test/mockTMDB.js'
const { REACT_APP_TMDB_KEY: key } = process.env

export default function useTMDB() {
  const [loading, setLoading] = useState(false)
  const [movieTitles, setMovieTitles] = useState([])

  const search = useCallback(async () => {
    setLoading(true)
    try {
      const testing = false

      let retrievedMovieTitles
      if (testing) {
        // console.log('useTMDB: mock results')
        retrievedMovieTitles = mockTMDB
      } else {
        retrievedMovieTitles = await TMDbAPIBySearch()
      }

      setMovieTitles(retrievedMovieTitles)
    } catch (error) {
      console.error(error)
      setMovieTitles([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    movieTitles,
    search
  }
}

async function TMDbAPIBySearch() {
  try {
    if (!key) throw new Error('themoviedbGetPopularMovies: No Key')
    const res = await query()
    return extractTitles(res)
  } catch (error) {
    console.error(error)
    return []
  }
}

const uri = `https://api.themoviedb.org/3/movie/popular?api_key=${key}`
const options = { page: 1, language: 'en-US' }
const query = async () => await axios(uri, options)

const extractTitles = (res) => res.data.results.map(({ title }) => title)
