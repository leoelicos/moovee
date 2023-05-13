import MooveeLogo from './MooveeLogo.jsx'
import Search from './Search/index.jsx'
export default function Header({ query }) {
  return (
    <header>
      <MooveeLogo />
      <Search query={query} />
    </header>
  )
}
