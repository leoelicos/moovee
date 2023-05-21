import { createContext, useEffect, useReducer } from 'react'
import useYouTube from '../hooks/useYouTube'

export const MovieContext = createContext(null)
export const MovieDispatchContext = createContext(null)

export default function MovieProvider({ children }) {
  const { youTubeData, youTubeLoading, youTubeError, searchYouTube } = useYouTube()
  const initialState = {
    youTubeData: '',
    youTubeLoading: false,
    youTubeError: false,
    modalOpen: false
  }
  const [state, dispatch] = useReducer(MovieReducer, initialState)

  useEffect(() => {
    const initialiseMovieContext = async () => {
      try {
        console.log('InitializeContext')
      } catch (e) {
        console.error(e)
      }
    }
    initialiseMovieContext()
  }, [])

  return (
    <MovieContext.Provider value={state}>
      <MovieDispatchContext.Provider value={dispatch}>{children}</MovieDispatchContext.Provider>
    </MovieContext.Provider>
  )
}

/* return updated state to useReducer */
async function MovieReducer(state, { type, action }) {
  switch (type) {
    case 'loadingTrue': {
      return { ...state, youTubeLoading: true }
    }

    case 'loadingFalse': {
      return { ...state, youTubeLoading: false }
    }

    case 'errorTrue': {
      return { ...state, youTubeError: true }
    }

    case 'errorFalse': {
      return { ...state, youTubeError: false }
    }

    case 'foundTrailer': {
      const { youTubeData } = action
      if (!youTubeData) {
        console.log('Missing youTubeData')
        return
      }
      console.log('reducer', { youTubeData })
      return { ...state, youTubeData }
    }

    case 'modalOpen': {
      return { ...state, modalOpen: true }
    }

    case 'modalClose': {
      return { ...state, modalOpen: false }
    }

    default: {
      return new Error('Action not found')
    }
  }
}

function mockQuery() {
  const dummyData = { data: { items: [{ id: { videoId: 'bKn-NdqSkU4' } }] } }
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyData), 1000)
  })
}

const parse = (res) => res?.data?.items?.[0]?.id?.videoId || null
