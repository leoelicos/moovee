import { readKeys } from './env'

describe('readKeys', () => {
  it('reads the legacy REACT_APP names so the Vercel vars keep working', () => {
    expect(readKeys({ REACT_APP_OMDB_KEY: 'a', REACT_APP_TMDB_KEY: 'b', REACT_APP_GAPI_KEY: 'c' })).toEqual({
      omdb: 'a',
      tmdb: 'b',
      youtube: 'c'
    })
  })

  it('prefers VITE names, trims, and treats blanks as missing', () => {
    expect(readKeys({ VITE_OMDB_KEY: ' x ', REACT_APP_OMDB_KEY: 'old', VITE_TMDB_KEY: '  ', DEV: true })).toEqual({
      omdb: 'x',
      tmdb: null,
      youtube: null
    })
  })

  it('defaults to import.meta.env', () => {
    expect(readKeys()).toHaveProperty('omdb')
  })
})
