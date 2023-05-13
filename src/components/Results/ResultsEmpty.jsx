import { faFaceMehBlank } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from 'antd/es/typography/Title'

export default function ResultsEmpty() {
  const o = <FontAwesomeIcon icon={faFaceMehBlank} />

  return (
    <div className='result-container empty'>
      <Title
        className='no-movies'
        level={5}>
        <span>
          N{o}&ensp;m{o}vies&ensp;{o}und
        </span>
      </Title>
    </div>
  )
}
