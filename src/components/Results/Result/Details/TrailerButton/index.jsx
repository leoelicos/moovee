/* controls youtube search state */

import { Button } from 'antd'
import useYouTube from '../../../../../hooks/useYouTube'
import { MovieDispatchContext } from '../../../../../context'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

import './style/trailer-button.css'

const getTrailerString = (title, year) => `"${title || ''}"+${year || ''}+trailer`

export default function TrailerButton({ title, year }) {
  const dispatch = useContext(MovieDispatchContext)

  const { loading, error, data, searchYouTube } = useYouTube()

  const handleClickTrailer = async () => {
    try {
      const query = getTrailerString(title, year)
      const tempData = await searchYouTube(query)
      console.log('new data', { tempData })
      dispatch({ type: 'gapiData', action: { data: tempData } })
      dispatch({ type: 'modalOpen' })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Button
      block
      loading={loading}
      disabled={error}
      className='trailer-btn'
      type='primary'
      onClick={handleClickTrailer}>
      <FontAwesomeIcon icon={faFilm} />
      &nbsp;<span>Trailer</span>
    </Button>
  )
}
