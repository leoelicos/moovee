import { createContext, useReducer } from 'react'

export const MovieContext = createContext(null)
export const MovieDispatchContext = createContext(null)

export default function MovieProvider({ children }) {
  const initialState = {
    youTubeData: '',
    youTubeLoading: false,
    youTubeError: false,
    modalOpen: false,
    query: '',
    searchText: ''
  }
  const [state, dispatch] = useReducer(MovieReducer, initialState)

  return (
    <MovieContext.Provider value={state}>
      <MovieDispatchContext.Provider value={dispatch}>{children}</MovieDispatchContext.Provider>
    </MovieContext.Provider>
  )
}

/* return updated state to useReducer */
function MovieReducer(state, { type, action }) {
  console.log('MovieReducer', { type, action })
  switch (type) {
    case 'setSearchText': {
      return { ...state, searchText: action.text }
    }

    case 'setQuery': {
      return { ...state, query: action.query }
    }

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

    case 'setTrailer': {
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
