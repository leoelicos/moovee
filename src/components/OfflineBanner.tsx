import { useOnline } from '../hooks/useOnline'

export function OfflineBanner() {
  const online = useOnline()
  if (online) return null
  return (
    <p className='offline' role='status'>
      You’re offline. Your watchlist and recent searches still work; search and trailers will be back when you are.
    </p>
  )
}
