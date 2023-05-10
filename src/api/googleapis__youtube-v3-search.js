import axios from 'axios'

const { REACT_APP_GAPI_KEY } = process.env

export default async function googleapisYouTubeV3Search(query) {
  try {
    if (!query) {
      throw new Error('googleapisYouTubeV3Search: No query')
    }

    if (REACT_APP_GAPI_KEY === undefined) {
      throw new Error('googleapisYouTubeV3Search: No key')
    }

    // return await query(str)
    return await mockQuery()
  } catch (e) {
    console.error(e)
  }
}
function query(str) {
  var uri = 'https://www.googleapis.com/youtube/v3/search'
  var params = {
    part: 'snippet',
    key: REACT_APP_GAPI_KEY,
    q: str,
    type: 'video'
  }
  return axios(uri, { params })
}

function mockQuery() {
  const mockData = {
    data: {
      items: [{ id: { videoId: 'bKn-NdqSkU4' } }]
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}
