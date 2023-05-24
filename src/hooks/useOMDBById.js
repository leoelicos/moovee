import { useCallback, useState } from 'react'
import axios from 'axios'
import mockMovie from '../test/mockOMDBById.js'

const { REACT_APP_OMDB_KEY: key } = process.env

export default function useOMDBById() {
  const [loading, setLoading] = useState(null)
  const [data, setData] = useState([])

  const testing = true
  const search = useCallback(
    async (id) => {
      console.log('searchOMDBById', { id })
      setLoading(true)
      try {
        if (id === undefined) throw new Error('searchOMDBById: No id')
        if (key === undefined) throw new Error('searchOMDBById: No key')

        let parsedMovie
        if (testing) {
          console.log('useOMDB: mock results')
          parsedMovie = mockMovie
        } else {
          console.log('useOMDB: axios OMDBByID')
          const uri = 'https://www.omdbapi.com'
          const params = { apikey: key, type: 'movie', i: id }
          const res = await axios(uri, { params })
          const data = res.data
          parsedMovie = parse(data)
        }
        console.log('useOMDB: parsed', parsedMovie)
        setData((prev) => (prev.imdbID === id ? { ...prev, ...parsedMovie } : prev))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [testing]
  )

  return { loading, data, search }
}

const parse = (data) => ({
  esrb: data.Rated === 'N/A' ? null : data.Rated,
  genre: data.Genre === 'N/A' ? null : data.Genre.split(', '),
  actors: data.Actors || [],
  plot: data.Plot === 'N/A' ? null : data.Plot,
  imdbRating: data.Ratings?.length === 0 ? null : parseFloat(data.Ratings.find((r) => r.Source === 'Internet Movie Database').Value)
})
