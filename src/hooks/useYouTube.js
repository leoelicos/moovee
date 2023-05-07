import { useState } from 'react'
import googleapisYouTubeV3Search from '../api/googleapis__youtube-v3-search'

const parse = (res) => res?.data?.items?.[0]?.id?.videoId || null

const useYouTube = () => {
  const [youTubeData, setYouTubeData] = useState(undefined)
  const [youTubeLoading, setYouTubeLoading] = useState(false)
  const [youTubeError, setYouTubeError] = useState(false)

  const searchYouTube = async (term) => {
    let uri = undefined
    try {
      setYouTubeLoading(true)
      const response = await googleapisYouTubeV3Search(term)
      const youtubeId = parse(response)

      if (!youtubeId) throw new Error('googleapisYouTubeV3Search')
      uri = `https://www.youtube.com/embed/${youtubeId}`
    } catch (e) {
      console.error(e)
      setYouTubeError(true)
    } finally {
      setYouTubeLoading(false)
      setYouTubeData(uri)
    }
  }

  return { youTubeData, youTubeLoading, youTubeError, searchYouTube }
}

export default useYouTube
