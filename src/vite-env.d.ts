/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OMDB_KEY?: string
  readonly VITE_TMDB_KEY?: string
  readonly VITE_GAPI_KEY?: string
  readonly REACT_APP_OMDB_KEY?: string
  readonly REACT_APP_TMDB_KEY?: string
  readonly REACT_APP_GAPI_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
