import { createContext, useEffect, useReducer } from 'react'

export const MovieContext = createContext(null)
export const MovieDispatchContext = createContext(null)

export default function MovieProvider({ children }) {
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
  console.log('MovieReducer', { type, action })
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
      return youTubeData ? { ...state, youTubeData } : state
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
