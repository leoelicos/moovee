export interface ApiKeys {
  omdb: string | null
  tmdb: string | null
  youtube: string | null
}

type Env = Partial<Record<string, string | boolean | undefined>>

const pick = (env: Env, ...names: string[]): string | null => {
  for (const name of names) {
    const value = env[name]
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return null
}

/** Reads API keys from env vars. `VITE_*` wins over the legacy `REACT_APP_*` names. */
export function readKeys(env: Env = import.meta.env): ApiKeys {
  return {
    omdb: pick(env, 'VITE_OMDB_KEY', 'REACT_APP_OMDB_KEY'),
    tmdb: pick(env, 'VITE_TMDB_KEY', 'REACT_APP_TMDB_KEY'),
    youtube: pick(env, 'VITE_GAPI_KEY', 'REACT_APP_GAPI_KEY')
  }
}

export const keys: ApiKeys = readKeys()
