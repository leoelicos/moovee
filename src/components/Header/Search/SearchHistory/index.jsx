import { faCaretSquareDown } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Empty, Select } from 'antd'
import { useMemo } from 'react'

export default function SearchHistory({ handleSubmit }) {
  /* mock */
  const history = [
    'Titanic',
    'Babe',
    'Wanted' //
  ]
  const historyOptions = useMemo(
    () =>
      history?.map((title) => ({
        label: title,
        value: title
      })) || [],
    [history]
  )

  return (
    <Select
      notFoundContent={<Empty />}
      className='history-select'
      dropdownMatchSelectWidth={false}
      bordered={false}
      suffixIcon={<FontAwesomeIcon icon={faCaretSquareDown} />}
      placeholder='Search history'
      options={historyOptions}
      onChange={handleSubmit}
    />
  )
}
