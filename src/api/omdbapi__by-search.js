import axios from 'axios'

const { REACT_APP_OMDB_KEY: key } = process.env

export default async function OMDbAPIBySearch(string) {
  try {
    if (string === undefined) throw new Error('omdbapiBySearch: No query')
    if (key === undefined) throw new Error('omdbapiBySearch: No key')
    const res = await query(string)
    const data = extractData(res)
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

const uri = 'https://www.omdbapi.com'
const options = { apikey: key, type: 'movie', page: 1 }
const query = async (str) => await axios(uri, { ...options, s: str })

const extractData = (res) => res.data.Search
