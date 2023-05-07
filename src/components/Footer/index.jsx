import FacebookIcon from './FacebookIcon.jsx'
import Link from './Link.jsx'

export default function Footer() {
  const url = 'https://www.facebook.com/MooVee-The-Movies-104712718873649/'
  return (
    <footer>
      <Link
        url={url}
        text={<FacebookIcon />}
      />
    </footer>
  )
}
