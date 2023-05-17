import { useEffect } from 'react'
import useTMDB from '../../hooks/useTMDB.js'

import { useNavigate } from 'react-router-dom'
import cleanQuery from '../../utils/cleanQuery.js'
import PopularMovie from './PopularMovie.jsx'
import SuggestionsHeading from './SuggestionsHeading.jsx'
export default function Suggestions() {
  const { loading, movieTitles, search } = useTMDB()
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

  useEffect(() => {
    console.log('useEffect Suggestions')
    search()
  }, [search])

  const navigate = useNavigate()

  const handleClick = (text) => {
    const cleanedQuery = cleanQuery(text)
    const nextPage = `/results?q=${cleanedQuery}`
    navigate(nextPage)
  }

  if (loading) return 'loading'

  return (
    <div className='suggestions'>
      <SuggestionsHeading />
      <ul className='list'>
        {movieTitles.map((title, i) => {
          const colorLastIdx = colors.length - 1
          const colorIdx = i % colorLastIdx || colorLastIdx
          const color = colors[colorIdx]
          return (
            <PopularMovie
              title={title}
              key={title}
              color={color}
              handleClick={handleClick}
            />
          )
        })}
      </ul>
    </div>
  )
}
