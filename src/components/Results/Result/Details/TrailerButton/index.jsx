/* controls youtube search state */

import { Button } from 'antd'
import useYouTube from '../../../../../hooks/useYouTube'
import { MovieDispatchContext } from '../../../../../context'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

import './style/trailer-button.css'
import { querySerialize } from '../../../../../utils/querySerialize'

export default function TrailerButton({ title, year, data, trailer, setTrailer }) {
  const dispatch = useContext(MovieDispatchContext)

  const { loading, error, searchYouTube } = useYouTube()

  const handleClickTrailer = async () => {
    try {
      const query = getTrailerString({ title, year, data })
      let uri = undefined
      if (!!trailer) uri = trailer
      else {
        uri = await searchYouTube(query)
        setTrailer(uri)
      }
      dispatch({ type: 'modalOpen' })
      dispatch({ type: 'gapiData', action: { data: uri } })
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

function getTrailerString({ title, year, data }) {
  const { actors } = data
  let d = ['trailer']
  if (title) d.push(`"${title}"`)
  if (year) d.push(`"${year}"`)
  if (actors)
    d.push(
      `${actors
        .split(', ')
        .map((actor) => `"${actor}"`)
        .join('+')}`
    )
  const joined = d.join('+')
  const trailerString = querySerialize(joined)
  console.log({ trailerString })
  return trailerString
}
