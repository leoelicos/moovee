import { useEffect, useContext, useCallback } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'
import MovieModal from './MovieModal/index.jsx'
import '../style/index.css'

import { MovieContext } from '../context/index.jsx'
import { MovieDispatchContext } from '../context/index.jsx'

export default function Moovee() {
  const [searchParams] = useSearchParams()
  const dispatch = useContext(MovieDispatchContext)
  const { gapiData, modalOpen } = useContext(MovieContext)

  // console.log('Moovee', { gapiData, modalOpen })

  const loadQuery = useCallback(() => {
    const q = searchParams.get('q') || ''
    const query = decodeURIComponent(q)

    dispatch({ type: 'setQuery', action: { query } })
  }, [searchParams, dispatch])

  useEffect(() => {
    loadQuery()
  }, [loadQuery])

  return (
    <div className='moovee'>
      <Theme>
        <Header />
        <main>
          <Outlet />
          <Footer />
        </main>
        {modalOpen ? (
          <MovieModal
            uri={gapiData}
            modalOpen={modalOpen}
          />
        ) : null}
      </Theme>
    </div>
  )
}
