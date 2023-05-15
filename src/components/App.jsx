import OMDBProvider from '../context/OMDBContext.jsx'
import Moovee from './Moovee.jsx'
import '../style/index.css'

export default function ContextProvider() {
  return (
    <OMDBProvider>
      <Moovee />
    </OMDBProvider>
  )
}
