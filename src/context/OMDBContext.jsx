import { createContext, useReducer } from 'react'

export const OMDBContext = createContext(null)

export const OMDBDispatchContext = createContext(null)

export default function OMDBProvider({ children }) {
  const initialResults = []
  const [movieResults, dispatch] = useReducer(omdbReducer, initialResults)

  return (
    <OMDBContext.Provider value={movieResults}>
      <OMDBDispatchContext.Provider value={dispatch}>{children}</OMDBDispatchContext.Provider>
    </OMDBContext.Provider>
  )
}

function omdbReducer(omdb, { type, action }) {
  switch (type) {
    case 'searchedOMDB': {
      console.log('search')
      if (!omdb) return [] /* init */
      return action.movies
    }

    default: {
      return new Error('Action not found')
    }
  }
}
