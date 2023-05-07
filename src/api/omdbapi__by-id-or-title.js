import axios from 'axios'

const { REACT_APP_OMDB_KEY } = process.env

export default async function OMDbAPIById(id) {
  let data = null
  try {
    if (id === undefined) {
      throw new Error('useOMDB searchByID: No ID to search')
    } else if (REACT_APP_OMDB_KEY === undefined) {
      throw new Error('OMDB key undefined')
    } else {
      const uri = 'https://www.omdbapi.com'
      var params = {
        apikey: REACT_APP_OMDB_KEY,
        type: 'movie',
        i: id
      }
      const res = await axios(uri, { params })
      data = res.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    return data
  }
}
