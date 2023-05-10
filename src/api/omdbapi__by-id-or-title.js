import axios from 'axios'

const { REACT_APP_OMDB_KEY } = process.env

export default async function OMDbAPIById(id) {
  try {
    if (id === undefined) {
      throw new Error('useOMDB searchByID: No ID to search')
    }

    if (REACT_APP_OMDB_KEY === undefined) {
      throw new Error('OMDB key undefined')
    }

    const res = await query(id)
    const data = extractData(res)
    return data
  } catch (error) {
    console.error(error)
  }

  return null
}

const query = async (id) =>
  await axios('https://www.omdbapi.com', {
    apikey: REACT_APP_OMDB_KEY,
    type: 'movie',
    i: id
  })

const extractData = (res) => res.data
