import { useId, useState } from 'react'
import { SORTS, TYPES, type SearchState, type SortKey, type TypeFilter } from '../lib/query'

interface FiltersProps {
  state: SearchState
  onChange: (patch: Partial<SearchState>) => void
}

const THIS_YEAR = new Date().getFullYear()

export function Filters({ state, onChange }: FiltersProps) {
  const id = useId()
  return (
    <div className='filters'>
      <fieldset className='segmented'>
        <legend className='visually-hidden'>Type</legend>
        {TYPES.map((option) => (
          <label key={option.value} className='segmented__option'>
            <input
              type='radio'
              name={`${id}-type`}
              value={option.value}
              checked={state.type === option.value}
              onChange={() => onChange({ type: option.value as TypeFilter })}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <YearField id={`${id}-year`} value={state.year} onChange={(year) => onChange({ year })} />
      <div className='field'>
        <label htmlFor={`${id}-sort`}>Sort</label>
        <select
          id={`${id}-sort`}
          className='input'
          value={state.sort}
          onChange={(event) => onChange({ sort: event.target.value as SortKey })}>
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

/** Keeps partial input locally and only filters once there are four digits (or none). */
function YearField({ id, value, onChange }: { id: string; value: string; onChange: (year: string) => void }) {
  const [text, setText] = useState(value)
  const [synced, setSynced] = useState(value)
  // The URL changed (Back, or Clear filters): show its year.
  if (synced !== value) {
    setSynced(value)
    setText(value)
  }
  return (
    <div className='field'>
      <label htmlFor={id}>Year</label>
      <input
        id={id}
        className='input input--year'
        type='text'
        inputMode='numeric'
        pattern='[0-9]{4}'
        maxLength={4}
        placeholder='Any'
        autoComplete='off'
        value={text}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, '').slice(0, 4)
          setText(next)
          if (next === '' || (next.length === 4 && Number(next) >= 1888 && Number(next) <= THIS_YEAR + 5))
            onChange(next)
        }}
      />
    </div>
  )
}
