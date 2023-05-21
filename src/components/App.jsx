import Moovee from './Moovee.jsx'
import '../style/index.css'
import MovieProvider from '../context/index.jsx'
export default function App() {
  return (
    <MovieProvider>
      <Moovee />
    </MovieProvider>
  )
}
