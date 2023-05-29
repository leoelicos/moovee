import { faCaretSquareDown } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Empty, Select } from 'antd'
import { useContext, useMemo } from 'react'
import cleanQuery from '../../utils/cleanQuery'
import { useNavigate } from 'react-router-dom'
import { MovieDispatchContext } from '../../context'

export default function SearchHistory() {
  const navigate = useNavigate()
  const dispatch = useContext(MovieDispatchContext)

  function handleSubmit(query) {
    const text = cleanQuery(query)
    const encoded = encodeURIComponent(text)
    const nextPage = `/results?q=${encoded}`
    if (encoded.length > 0) navigate(nextPage)
    dispatch({ type: 'setSearchText', action: { text } })
  }

  const store = localStorage.getItem('movies')

  const historyOptions = useMemo(
    () =>
      store
        ? JSON.parse(store).map((title) => ({
            label: title,
            value: title
          }))
        : [],
    [store]
  )

  return (
    <Select
      notFoundContent={<Empty />}
      className='history-select'
      dropdownMatchSelectWidth={false}
      bordered={false}
      suffixIcon={<FontAwesomeIcon icon={faCaretSquareDown} />}
      placeholder='Search it again'
      options={historyOptions}
      onChange={handleSubmit}
    />
  )
}
