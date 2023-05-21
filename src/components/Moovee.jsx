import { useEffect, useState, useContext } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'
import Modal from './Modal/index.jsx'
import '../style/index.css'
import Trailer from './Modal/Trailer.jsx'

import { MovieContext } from '../context/index.jsx'

export default function Moovee() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const { youTubeData } = useContext(MovieContext)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  return (
    <div className='moovee'>
      <Theme>
        <Header initialQuery={query.current} />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Modal>
          <Trailer uri={youTubeData} />
        </Modal>
      </Theme>
    </div>
  )
}
