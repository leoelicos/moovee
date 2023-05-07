import axios from 'axios'

const { REACT_APP_TMDB_KEY } = process.env

export default async function TMDbAPIBySearch() {
  try {
    if (REACT_APP_TMDB_KEY === undefined) {
      throw new Error('TMDbAPIBySearch Missing TMDB Key')
    }

    const uri = 'https://api.themoviedb.org/3/movie/popular'
    const params = {
      api_key: REACT_APP_TMDB_KEY,
      language: 'en-US',
      page: 1
    }

    const response = await axios(uri, { params })
    const data = response.data
    const results = data.results
    const parsed = results.map(({ title }) => title)

    return parsed
  } catch (error) {
    console.error(error)
    return []
  }
}
