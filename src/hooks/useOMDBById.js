import { useCallback, useState } from 'react'
import axios from 'axios'
import mockMovie from '../test/mockOMDBById.js'

const { REACT_APP_OMDB_KEY: key } = process.env

export default function useOMDBById() {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])

  const testing = false
  const search = useCallback(
    async (id) => {
      // console.log('searchOMDBById', { id })
      setLoading(true)
      setError(false)
      try {
        if (id === undefined) throw new Error('useOMDBById: No id')
        if (key === undefined) throw new Error('useOMDBById: No key')

        let parsedMovie
        if (testing) {
          const testingPromise = () =>
            new Promise((res) => {
              // console.log('useOMDBById mock loading')
              setTimeout(() => {
                // console.log('useOMDBById loading finished')
                res(mockMovie)
              }, 2000)
            })
          const res = await testingPromise()
          parsedMovie = parse(res)
        } else {
          // console.log('useOMDB: axios OMDBByID')
          const uri = 'https://www.omdbapi.com'
          const params = { apikey: key, type: 'movie', i: id }
          const res = await axios(uri, { params })
          // console.log('axios result', { res })
          const data = res.data
          parsedMovie = parse(data)
        }
        // console.log('useOMDB: parsed', parsedMovie)
        setData(parsedMovie)
      } catch (error) {
        setError(true)
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [testing]
  )

  return { loading, error, data, search }
}

const parse = (data) => ({
  esrb: data.Rated === 'N/A' ? null : data.Rated,
  genre: data.Genre === 'N/A' ? null : data.Genre.split(', '),
  actors: data.Actors || [],
  plot: data.Plot === 'N/A' ? null : data.Plot,
  imdbRating: data.Ratings?.length === 0 ? null : parseFloat(data.Ratings.find((r) => r.Source === 'Internet Movie Database').Value)
})
