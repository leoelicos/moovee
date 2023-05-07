// import axios from 'axios'

const { REACT_APP_GAPI_KEY } = process.env

export default async function googleapisYouTubeV3Search(term) {
  let response = null
  try {
    if (term === undefined) {
      throw new Error('googleapisYouTubeV3Search: No term to search')
    } else if (REACT_APP_GAPI_KEY === undefined) {
      throw new Error('Gapi key undefined')
    } else {
      // var uri = 'https://www.googleapis.com/youtube/v3/search'
      /*       var params = {
        part: 'snippet',
        key: REACT_APP_GAPI_KEY,
        q: term,
        type: 'video'
      } */
      // response = await axios(uri, { params })
      response = await mockGoogle()
    }
  } catch (e) {
    console.error(e)
  } finally {
    return response
  }
}

const mockGoogle = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          items: [{ id: { videoId: 'bKn-NdqSkU4' } }]
        }
      })
    }, 1000)
  })
