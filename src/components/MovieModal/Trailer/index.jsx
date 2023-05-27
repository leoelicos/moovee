import { Spin } from 'antd'
import { useState } from 'react'

export default function Trailer({ uri }) {
  const [loading, setLoading] = useState(true)
  const hideSpinner = () => setLoading(false)

  return (
    <>
      <Spin className={`modal-spin ${loading ? '' : 'finished'}`} />
      <iframe
        className={`modal-iframe ${loading ? 'finished' : ''}`}
        title='Trailer'
        src={uri}
        width='100%'
        height='100%'
        onLoad={hideSpinner}
        allowFullScreen='allowfullscreen'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full'
        style={{ border: 'none' }}
      />
    </>
  )
}
