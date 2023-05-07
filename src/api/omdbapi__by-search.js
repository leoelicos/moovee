import axios from 'axios'

const { REACT_APP_OMDB_KEY } = process.env

export default async function OMDbAPIBySearch(str) {
  let data = []
  try {
    if (str === undefined) {
      throw new Error('useOMDB searchByString: No string to search')
    } else if (REACT_APP_OMDB_KEY === undefined) {
      throw new Error('OMDB key undefined')
    } else {
      const uri = 'https://www.omdbapi.com'
      var params = {
        apikey: REACT_APP_OMDB_KEY,
        type: 'movie',
        s: str,
        page: 1
      }
      const res = await axios(uri, { params })
      data = res.data.Search
    }
  } catch (error) {
    console.error(error)
  } finally {
    return data
  }
}
