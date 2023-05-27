import axios from 'axios'
import { useState } from 'react'

const { REACT_APP_GAPI_KEY: key } = process.env

export default function useYouTube() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const searchYouTube = async (term) => {
    try {
      console.log(`searchYouTube ${term}`)
      setLoading(true)
      setError(false)
      if (!term) {
        throw new Error('useYouTube error: No query')
      }
      if (key === undefined) {
        throw new Error('useYouTube error: No key')
      }

      const testing = true
      let response = testing
        ? await mockQuery()
        : await axios('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet',
            key: key,
            type: 'video',
            q: term
          })
      if (!response) {
        throw new Error('useYouTube error: googleapis')
      }
      setData(`https://www.youtube.com/embed/${parse(response)}`)
    } catch (e) {
      console.error(e)
      setError(true)
      setData(null)
    } finally {
      setLoading(false)
    }
  }
  return { loading, error, data, searchYouTube }
}

function mockQuery() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }), 1000)
  })
}

const parse = (res) => res?.data?.items?.[0]?.id?.videoId || null
