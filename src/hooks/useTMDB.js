import { useCallback, useState } from 'react'
import api from '../api/themoviedb__get-popular-movies.js'

export default function useTMDB() {
  const [loading, setLoading] = useState(false)

  const [movieTitles, setMovieTitles] = useState([])

  const search = useCallback(async () => {
    setLoading(true)

    try {
      const retrievedMovieTitles = await api()
      console.log({ retrievedMovieTitles })
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
