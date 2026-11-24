import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../api/http'
import { embedUrl, findTrailer, youtubeSearchUrl } from '../api/youtube'
import { keys } from '../lib/env'
import { Icon } from './Icon'

type TrailerState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; videoId: string }
  | { status: 'none'; message: string }

/** Looks up the trailer only when asked, because each YouTube search spends API quota. */
export function Trailer({ title, year }: { title: string; year: string }) {
  const [state, setState] = useState<TrailerState>({ status: 'idle' })
  const playerRef = useRef<HTMLDivElement>(null)
  const loading = state.status === 'loading'

  // The play button disappears once the video loads, so move focus to the player region
  // (not into the iframe, where Esc would no longer reach the dialog).
  useEffect(() => {
    if (state.status === 'ready') playerRef.current?.focus()
  }, [state.status])

  const play = async () => {
    if (loading) return
    setState({ status: 'loading' })
    try {
      const videoId = await findTrailer(title, year, keys.youtube)
      setState(videoId ? { status: 'ready', videoId } : { status: 'none', message: 'No trailer found on YouTube.' })
    } catch (error) {
      const message =
        error instanceof ApiError && error.kind === 'missing-key' ? error.message : 'The trailer could not be loaded.'
      setState({ status: 'none', message })
    }
  }

  if (state.status === 'ready') {
    return (
      <div className='trailer' ref={playerRef} tabIndex={-1} role='region' aria-label={`${title} trailer player`}>
        <iframe
          className='trailer__frame'
          src={embedUrl(state.videoId)}
          title={`${title} trailer`}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
        />
      </div>
    )
  }

  return (
    <div className='trailer trailer--placeholder'>
      {state.status === 'none' ? (
        <div className='trailer__fallback' role='status'>
          <p>{state.message}</p>
          <a className='button' href={youtubeSearchUrl(title, year)} target='_blank' rel='noreferrer'>
            Search YouTube <Icon name='external' />
            <span className='visually-hidden'> (opens in a new tab)</span>
          </a>
        </div>
      ) : (
        <button type='button' className='trailer__play' onClick={play} aria-disabled={loading} aria-busy={loading}>
          <span className='trailer__play-icon' aria-hidden='true'>
            {loading ? <span className='spinner' /> : <Icon name='play' />}
          </span>
          <span>{loading ? 'Finding trailer…' : 'Play trailer'}</span>
        </button>
      )}
    </div>
  )
}
