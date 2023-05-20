import axios from 'axios'

const { REACT_APP_OMDB_KEY: key } = process.env

export default async function OMDbAPIById(id) {
  try {
    if (id === undefined) throw new Error('OMDbAPIById: No ID to search')
    if (!key) throw new Error('OMDbAPIById: No key')
    const res = await query(id)
    const data = extractData(res)
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

const uri = 'https://www.omdbapi.com'
const params = { apikey: key, type: 'movie' }
const query = async (id) => await axios(uri, { params, i: id })

const extractData = (res) => res.data
