import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

export default function Stars({ stars }) {
  if (!stars) return null
  return (
    <div className='stars'>
      <Star />
      {stars > 2 && <Star />}
      {stars > 4 && <Star />}
      {stars > 6 && <Star />}
      {stars > 8 && <Star />}
    </div>
  )
}

const Star = () => <FontAwesomeIcon icon={faStar} />
