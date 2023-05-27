import { Button } from 'antd'
import NoPosterLogo from '../../../../images/noposter.png'
export default function Poster({ src, togglePoster }) {
  return (
    <Button
      className='poster'
      block
      type='primary'
      onClick={togglePoster}>
      {src ? (
        <img
          src={src}
          alt='movie poster'
        />
      ) : (
        <div className='noposter'>
          <div className='noposter-logo-wrapper'>
            <img
              className='noposter-logo'
              src={NoPosterLogo}
            />
          </div>
          <div className='noposter-text'>No Poster</div>
        </div>
      )}
    </Button>
  )
}
