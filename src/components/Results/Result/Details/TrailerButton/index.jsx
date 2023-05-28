/* controls youtube search state */

import { Button } from 'antd'
import useYouTube from '../../../../../hooks/useYouTube'
import { MovieDispatchContext } from '../../../../../context'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

import './style/trailer-button.css'
import { querySerialize } from '../../../../../utils/querySerialize'

const getTrailerString = ({ title, year, data }) => {
  const { actors } = data
  let d = ['trailer']
  if (title) d.push(title)
  if (year) d.push(year)
  if (actors) d.push(actors.split(', ')[0])
  const joined = d.join('+')
  const trailerString = querySerialize(joined)
  console.log({ trailerString })
  return trailerString
}

export default function TrailerButton({ title, year, data }) {
  const dispatch = useContext(MovieDispatchContext)

  const { loading, error, searchYouTube } = useYouTube()

  const handleClickTrailer = async () => {
    try {
      const query = getTrailerString({ title, year, data })
      const tempData = await searchYouTube(query)
      // console.log('new data', { tempData })
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
