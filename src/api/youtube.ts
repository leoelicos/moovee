import { ApiError, buildUrl, getJson } from './http'

const BASE = 'https://www.googleapis.com/youtube/v3/search'
const STORAGE_KEY = 'moovee:trailers'

interface YouTubeSearch {
  items?: { id?: { videoId?: string } }[]
}

export const embedUrl = (videoId: string): string =>
  `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`

export const youtubeSearchUrl = (title: string, year: string): string =>
  buildUrl('https://www.youtube.com/results', { search_query: `${title} ${year} trailer`.trim() })

const readCache = (): Record<string, string | null> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string | null>) : {}
  } catch {
    return {}
  }
}

const writeCache = (cache: Record<string, string | null>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Storage full or blocked: the cache is only an optimisation.
  }
}

/**
 * Finds a trailer video id. Each YouTube search costs 100 quota units,
 * so results (including "none found") are cached on the device.
 */
export async function findTrailer(
  title: string,
  year: string,
  key: string | null,
  signal?: AbortSignal
): Promise<string | null> {
  const cacheKey = `${title}|${year}`.toLowerCase()
  const cache = readCache()
  if (cacheKey in cache) return cache[cacheKey] ?? null
  if (!key) throw new ApiError('missing-key', 'Trailers need a YouTube API key. Add REACT_APP_GAPI_KEY.')
  const data = await getJson<YouTubeSearch>(
    buildUrl(BASE, {
      part: 'snippet',
      key,
      type: 'video',
      videoEmbeddable: 'true',
      safeSearch: 'strict',
      maxResults: 1,
      q: `${title} ${year} official trailer`.trim()
    }),
    signal
  )
  const videoId = data.items?.[0]?.id?.videoId ?? null
  writeCache({ ...cache, [cacheKey]: videoId })
  return videoId
}
