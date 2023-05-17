import { Tag } from 'antd'
export default function PopularMovie({ title, color, handleClick }) {
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
