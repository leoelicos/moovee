import { Icon } from './Icon'

export function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__inner'>
        <p>
          Data from{' '}
          <a href='https://www.omdbapi.com/' rel='noreferrer' target='_blank'>
            OMDb
          </a>{' '}
          and{' '}
          <a href='https://www.themoviedb.org/' rel='noreferrer' target='_blank'>
            TMDB
          </a>
          . Trailers from YouTube. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <p>
          <a className='footer__gh' href='https://github.com/leoelicos/moovee' rel='noreferrer' target='_blank'>
            <Icon name='github' /> Source on GitHub
          </a>{' '}
          · Originally built by the movie-planner team, rebuilt by Leo Wong.
        </p>
      </div>
    </footer>
  )
}
