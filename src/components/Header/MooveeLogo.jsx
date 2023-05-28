import { Button } from 'antd'
import Logo from '../../images/noposter.png'

export default function MooveeLogo({ handleClickLogo }) {
  return (
    <Button
      size='large'
      onClick={handleClickLogo}
      className='moovee-logo-button'
      icon={
        <img
          src={Logo}
          alt='moovee logo'
        />
      }></Button>
  )
}
