import { Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'

import '../style/index.css'
import useOMDB from '../hooks/useOMDB.js'
import { useSearchParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import OMDBProvider from '../context/OMDBContext.jsx'

import { OMDBDispatchContext } from '../context/OMDBContext.jsx'

export default function Moovee() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { omdbMovies, searchOMDB } = useOMDB()
  const dispatchOMDB = useContext(OMDBDispatchContext)

  useEffect(() => {
    console.log('App useEffect', { query })

    searchOMDB(query)
    /* dispatch omdb search */
    dispatchOMDB({
      type: 'setLoading',
      action: true
    })

    dispatchOMDB({
      type: 'setMovies',
      action: omdbMovies
    })

    return () => {
      dispatchOMDB({
        type: 'setLoading',
        action: false
      })
    }
  }, [query, dispatchOMDB, omdbMovies, searchOMDB])

  return (
    <OMDBProvider>
      <div className='moovee'>
        <Theme>
          <Header query={query} />
          <main>
            <Outlet />
          </main>
          <Footer />
        </Theme>
      </div>
    </OMDBProvider>
  )
}
