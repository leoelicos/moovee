/* to be replaced by a useEffect later */

import { Button } from 'antd'

export default function GetDetailsButton({ onClick, loading, error }) {
  if (error) console.log('GetDetailsButton', { error })
  return (
    <Button
      onClick={onClick}
      loading={loading}>
      Get details
    </Button>
  )
}
