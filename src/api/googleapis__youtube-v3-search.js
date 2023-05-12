import axios from 'axios'

const { REACT_APP_GAPI_KEY: key } = process.env

export default async function googleapisYouTubeV3Search(string) {
  try {
    if (!string) throw new Error('googleapisYouTubeV3Search: No query')
    if (key === undefined) throw new Error('googleapisYouTubeV3Search: No key')
    // return await query(str)
    return await mockQuery()
  } catch (e) {
    console.error(e)
    return null
  }
}

const uri = 'https://www.googleapis.com/youtube/v3/search'
const params = { part: 'snippet', key: key, type: 'video' }
const query = async (str) => await axios(uri, { ...params, q: str })

const dummyData = { data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }
const mockQuery = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(dummyData), 1000)
  })
