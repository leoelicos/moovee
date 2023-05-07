import { useEffect } from 'react'
import useTMDB from '../../hooks/useTMDB.js'
import { Tag } from 'antd'

export default function Suggestions({ nav }) {
  const { loading, movieTitles, search } = useTMDB()
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
  useEffect(() => {
    search()
  }, [search])
  const handleClick = (text) => {
    console.log('handleClick ', text)
  }
  if (loading) return 'loading'
  return (
    <ul className='suggestions'>
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
  )
}
function PopularMovie({ title, color, handleClick }) {
  return (
    <Tag
      className='tmdb-tag'
      bordered={false}
      key={title}
      color={color}
      data-text={title}
      onClick={(e) => {
        handleClick(title)
      }}>
      {title}
    </Tag>
  )
}
