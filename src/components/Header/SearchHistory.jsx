import { faCaretSquareDown } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Empty, Select } from 'antd'
import { useMemo } from 'react'

export default function SearchHistory({ handleSubmit }) {
  /* mock */

  const historyOptions = useMemo(
    () =>
      [
        'Titanic',
        'Babe',
        'Wanted' //
      ].map((title) => ({
        label: title,
        value: title
      })) || [],
    []
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
