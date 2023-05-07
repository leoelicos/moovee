export default function Link({ url, text }) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noreferrer'>
      {text}
    </a>
  )
}
