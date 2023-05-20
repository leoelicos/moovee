import { useState } from 'react'
import axios from 'axios'

const { REACT_APP_GAPI_KEY: key } = process.env

export default function useYouTube() {
  const [youTubeData, setYouTubeData] = useState(undefined)
  const [youTubeLoading, setYouTubeLoading] = useState(false)
  const [youTubeError, setYouTubeError] = useState(false)

  const searchYouTube = async (term) => {
    try {
      setYouTubeLoading(true)
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
      setYouTubeLoading(false)
      setYouTubeData(`https://www.youtube.com/embed/${youtubeId}`)
    } catch (e) {
      console.error(e)
      setYouTubeError(true)
      setYouTubeLoading(false)
      setYouTubeData(undefined)
    }
  }
  return { youTubeData, youTubeLoading, youTubeError, searchYouTube }
}

function mockQuery() {
  const dummyData = { data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyData), 1000)
  })
}

const parse = (res) => res?.data?.items?.[0]?.id?.videoId || null
