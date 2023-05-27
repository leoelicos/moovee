import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import './style/back-button.css'
export default function BackButton({ onClick }) {
  return (
    <Button
      className='back'
      block
      type='dashed'
      onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  )
}
