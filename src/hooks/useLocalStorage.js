import { useEffect, useState } from 'react'

const useLocalStorage = (key) => {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem(key) || '[]'))

  useEffect(() => {
    if (history?.length > 0) localStorage.setItem(key, JSON.stringify(history))
  }, [history, key])

  const saveHistory = (value) => {
    setHistory((prev) => {
      let oldHistory = prev.includes(value) //
        ? prev.filter((v) => v !== value)
        : prev.length > 4
        ? prev.slice(0, 4)
        : prev

      let newHistory = [value].concat(...oldHistory)
      return newHistory
    })
  }

  return { history, saveHistory }
}

export default useLocalStorage
