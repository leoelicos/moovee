import { createContext, useReducer } from 'react'
import useOMDB from '../hooks/useOMDB'

export const OMDBContext = createContext(null)

export const OMDBDispatchContext = createContext(null)

export default function OMDBProvider({ children }) {
  const initialState = {
    omdbLoading: false,
    omdbMovies: []
  }
  const [state, dispatch] = useReducer(omdbReducer, initialState)

  return (
    <OMDBContext.Provider value={state}>
      <OMDBDispatchContext.Provider value={dispatch}>{children}</OMDBDispatchContext.Provider>
    </OMDBContext.Provider>
  )
}

function omdbReducer(state, { type, action }) {
  switch (type) {
    case 'setMovies': {
      return { ...state, omdbMovies: action.omdbMovies }
    }

    case 'setLoading': {
      return { ...state, omdbLoading: action.omdbLoading }
    }

    default: {
      return new Error('Action not found')
    }
  }
}
