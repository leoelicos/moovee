import { useEffect, useContext, useCallback } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'
import Modal from './Modal/index.jsx'
import '../style/index.css'
import Trailer from './Modal/Trailer.jsx'

import { MovieContext } from '../context/index.jsx'
import { MovieDispatchContext } from '../context/index.jsx'

export default function Moovee() {
  const [searchParams] = useSearchParams()
  const dispatch = useContext(MovieDispatchContext)

  const { youTubeData } = useContext(MovieContext)

  const x = useCallback(() => {
    const q = searchParams.get('q') || ''
    const query = decodeURIComponent(q)

    dispatch({ type: 'setQuery', action: { query } })
  }, [searchParams, dispatch])

  useEffect(() => {
    x()
  }, [])

  return (
    <div className='moovee'>
      <Theme>
        <Header />
        <main>
          <Outlet />
          <Footer />
        </main>
        <Modal>
          <Trailer uri={youTubeData} />
        </Modal>
      </Theme>
    </div>
  )
}
