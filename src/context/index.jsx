import { createContext, useMemo, useReducer } from 'react'

export const MovieContext = createContext(null)
export const MovieDispatchContext = createContext(null)

export default function MovieProvider({ children }) {
  const initialState = {
    gapiData: '',
    gapiLoading: false,
    gapiError: false,
    modalOpen: false,
    query: '',
    searchText: ''
  }
  const [state, dispatch] = useReducer(MovieReducer, initialState)

  const memoState = useMemo(() => {
    return state
  }, [state])

  const memoDispatch = useMemo(() => {
    return dispatch
  }, [dispatch])

  return (
    <MovieContext.Provider value={memoState}>
      <MovieDispatchContext.Provider value={memoDispatch}>{children}</MovieDispatchContext.Provider>
    </MovieContext.Provider>
  )
}

/* return updated state to useReducer */
function MovieReducer(state, { type, action }) {
  // console.log('MovieReducer', { type, action })
  switch (type) {
    case 'setSearchText': {
      return { ...state, searchText: action.text }
    }

    case 'setQuery': {
      return { ...state, query: action.query }
    }

    case 'gapiLoadingTrue': {
      return { ...state, gapiLoading: true }
    }

    case 'gapiLoadingFalse': {
      return { ...state, gapiLoading: false }
    }

    case 'gapiErrorTrue': {
      return { ...state, gapiError: true }
    }

    case 'gapiErrorFalse': {
      return { ...state, gapiError: false }
    }

    case 'gapiData': {
      if (!action.data) return state
      return { ...state, gapiData: action.data }
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
