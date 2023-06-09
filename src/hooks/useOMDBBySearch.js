import { useCallback, useState } from 'react'
import axios from 'axios'
import mockMovies from '../test/mockOMDBBySearch.js'

const { REACT_APP_OMDB_KEY: key } = process.env

export default function useOMDBBySearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])

  const testing = false
  const search = useCallback(
    async (str) => {
      // console.log('searchOMDBById', { str })
      setLoading(true)
      setError(false)
      try {
        if (str === undefined) throw new Error('searchOMDB: No query')
        if (key === undefined) throw new Error('searchOMDB: No key')

        let parsedMovies
        if (testing) {
          const testingPromise = () =>
            new Promise((res) => {
              // console.log('useOMDBBySearch mock loading')
              setTimeout(() => {
                // console.log('useOMDBBySearch loading finished')
                res(mockMovies)
              }, 2000)
            })
          parsedMovies = await testingPromise()
        } else {
          console.log('useOMDB: axios OMDBBySearch')
          const uri = 'https://www.omdbapi.com'
          const params = { apikey: key, type: 'movie', page: 1, s: str }
          const res = await axios(uri, { params })
          // console.log('axios result', { res })
          if (res.data.Response === 'False') {
            parsedMovies = []
          } else {
            const movies = res.data.Search.filter((v) => v.hasOwnProperty('imdbID'))
            parsedMovies = movies.map(parse)
          }
        }
        // console.log('useOMDB: parsed', parsedMovies)
        setData(parsedMovies)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    [testing]
  )

  return { loading, error, data, search }
}

const parse = (data) => ({
  imdbID: data.imdbID,
  poster: data.Poster === 'N/A' ? null : data.Poster,
  title: data.Title === 'N/A' ? null : data.Title,
  year: data.Year === 'N/A' ? null : data.Year
})
