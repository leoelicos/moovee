import { useEffect, useState } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'

import '../style/index.css'

export default function Moovee() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  console.log({ query })
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
      </Theme>
    </div>
  )
}
