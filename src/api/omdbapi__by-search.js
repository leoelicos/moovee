import axios from 'axios'

const { REACT_APP_OMDB_KEY } = process.env

export default async function OMDbAPIBySearch(string) {
  let data = []
  try {
    if (string === undefined) {
      throw new Error('omdbapiBySearch: No query')
    }

    if (REACT_APP_OMDB_KEY === undefined) {
      throw new Error('omdbapiBySearch: No key')
    }

    const res = await query(id)
    const data = extractData(res)
    return data
  } catch (error) {
    console.error(error)
  }
  return data
}

const query = async (id) =>
  await axios('https://www.omdbapi.com', {
    apikey: REACT_APP_OMDB_KEY,
    type: 'movie',
    s: str,
    page: 1
  })

const extractData = (res) => res.data.Search
