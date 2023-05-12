import axios from 'axios'

const { REACT_APP_TMDB_KEY: key } = process.env

export default async function TMDbAPIBySearch() {
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
