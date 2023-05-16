import { useCallback, useContext, useEffect } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'

import { OMDBDispatchContext } from '../context/OMDBContext.jsx'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'

import useOMDB from '../hooks/useOMDB.js'

import '../style/index.css'

export default function Moovee() {
  const dispatchOMDB = useContext(OMDBDispatchContext)
  const [searchParams] = useSearchParams()
  const { omdbMovies, searchOMDB } = useOMDB()
  const query = searchParams.get('q') || ''

  const init = useCallback(() => {
    console.log('App useEffect', { query })
    if (!query.length) return
    searchOMDB(query)
    dispatchOMDB({
      type: 'setLoading',
      action: true
    })

    dispatchOMDB({
      type: 'setMovies',
      action: omdbMovies
    })

    dispatchOMDB({
      type: 'setLoading',
      action: false
    })
  }, [dispatchOMDB, omdbMovies, searchOMDB, query])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className='moovee'>
      <Theme>
        <Header query={query} />
        <main>
          <Outlet />
        </main>
        <Footer />
      </Theme>
    </div>
  )
}
