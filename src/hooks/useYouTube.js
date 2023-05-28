import axios from 'axios'
import { useState } from 'react'

const { REACT_APP_GAPI_KEY: key } = process.env

export default function useYouTube() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const searchYouTube = async (term) => {
    try {
      // console.log(`searchYouTube ${term}`)
      setLoading(true)
      setError(false)
      if (!term) {
        throw new Error('useYouTube error: No query')
      }
      if (key === undefined) {
        throw new Error('useYouTube error: No key')
      }

      const testing = false
      let response = testing ? await mockQuery() : await query(term)
      if (!response) {
        throw new Error('useYouTube error: googleapis')
      }
      const payload = `https://www.youtube.com/embed/${parse(response)}`
      // console.log('Youtube Payload', { payload })
      setLoading(false)
      setData(payload)
      return payload
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(true)
      setData(null)
      return ''
    }
  }
  return { loading, error, data, searchYouTube }
}

function mockQuery() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }), 1000)
  })
}

async function query(term) {
  console.log('useYouTube: axios Youtube')
  let res = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&type=video&q=${term}`)
  return res.data
}

const parse = (res) => res.items?.[0]?.id?.videoId || null
