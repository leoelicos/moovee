import { useCallback, useState } from 'react'
import axios from 'axios'
import mockMovies from '../test/mockOMDBBySearch.js'

const { REACT_APP_OMDB_KEY: key } = process.env

export default function useOMDBBySearch() {
  const [loading, setLoading] = useState(null)
  const [data, setData] = useState([])

  const testing = true
  const search = useCallback(
    async (str) => {
      console.log('searchOMDBById', { str })
      setLoading(true)
      try {
        if (str === undefined) throw new Error('searchOMDB: No query')
        if (key === undefined) throw new Error('searchOMDB: No key')

        let parsedMovies
        if (testing) {
          console.log('useOMDB: mock search')
          parsedMovies = mockMovies
        } else {
          console.log('useOMDB: fetch OMDB BySearch')
          const res = await axios(`https://www.omdbapi.com?apikey=${key}&type=movie&page=1&s=${str}`)
          console.log('axios result', { res })
          const movies = res.Search.filter((v) => v.hasOwnProperty('imdbID'))
          parsedMovies = movies.map(parse)
        }
        console.log('useOMDB: parsed', parsedMovies)
        setData(parsedMovies)
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
  imdbID: data.imdbID,
  poster: data.Poster === 'N/A' ? null : data.Poster,
  title: data.Title === 'N/A' ? null : data.Title,
  year: data.Year === 'N/A' ? null : data.Year
})
