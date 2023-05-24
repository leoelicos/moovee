import axios from 'axios'

const { REACT_APP_GAPI_KEY: key } = process.env

export default function useYouTube(dispatch) {
  const searchYouTube = async (term) => {
    try {
      console.log('searchYouTube', { term })
      dispatch({ type: 'loadingTrue' })
      if (!term) throw new Error('useYouTube error: No query')
      if (key === undefined) throw new Error('useYouTube error: No key')
      const uri = 'https://www.googleapis.com/youtube/v3/search'
      const params = { part: 'snippet', key: key, type: 'video' }
      let response
      const testing = true
      if (testing) response = await mockQuery()
      else response = await axios(uri, { ...params, q: term })
      const youtubeId = parse(response)
      if (!youtubeId) throw new Error('googleapisYouTubeV3Search')
      const youTubeData = `https://www.youtube.com/embed/${youtubeId}`
      dispatch({ type: 'loadingFalse' })
      dispatch({ type: 'setTrailer', action: { youTubeData } })
    } catch (e) {
      console.error(e)
      dispatch({ type: 'errorTrue' })
      dispatch({ type: 'loadingFalse' })
      dispatch({ type: 'setTrailer', action: { youTubeData: null } })
    }
  }
  return { searchYouTube }
}

function mockQuery() {
  const dummyData = { data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyData), 1000)
  })
}

const parse = (res) => res?.data?.items?.[0]?.id?.videoId || null
