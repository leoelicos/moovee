import axios from 'axios'

const { REACT_APP_TMDB_KEY } = process.env

export default async function TMDbAPIBySearch() {
  try {
    if (!REACT_APP_TMDB_KEY) {
      throw new Error('themoviedbGetPopularMovies: No Key')
    }

    const res = await query()
    const data = extractData(res)
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

const query = async () =>
  await axios('https://api.themoviedb.org/3/movie/popular', {
    api_key: REACT_APP_TMDB_KEY,
    language: 'en-US',
    page: 1
  })

const extractData = (res) => res.data.results.map(({ title }) => title)
