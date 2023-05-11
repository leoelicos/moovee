import axios from 'axios'

const { REACT_APP_TMDB_KEY } = process.env

export default async function TMDbAPIBySearch() {
  try {
    if (!REACT_APP_TMDB_KEY) {
      throw new Error('themoviedbGetPopularMovies: No Key')
    }
    const res = await query()

    return extractTitles(res)
  } catch (error) {
    console.error(error)
    return []
  }
}

const query = async () => {
  console.log({ REACT_APP_TMDB_KEY })

  const result = await axios(`https://api.themoviedb.org/3/movie/popular?api_key=${REACT_APP_TMDB_KEY}`, { page: 1, language: 'en-US' })

  console.log({ result })
  return result
}

const extractTitles = (res) => res.data.results.map(({ title }) => title)
