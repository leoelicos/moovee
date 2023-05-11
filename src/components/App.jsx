import { Outlet } from 'react-router-dom'

import Header from './Header/index.jsx'
import Footer from './Footer/index.jsx'
import Theme from './Theme.jsx'

import '../style/index.css'

import OMDBProvider from '../context/OMDBContext.jsx'

export default function Moovee() {
  return (
    <OMDBProvider>
      <div className='moovee'>
        <Theme>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </Theme>
      </div>
    </OMDBProvider>
  )
}
