const { REACT_APP_OMDB_KEY: key } = process.env

export default async function OMDbAPIBySearch(string) {
  console.log('bySearch', { string, key })
  try {
    if (string === undefined) throw new Error('omdbapiBySearch: No query')
    if (key === undefined) throw new Error('omdbapiBySearch: No key')
    const res = await query(string)
    const parsed = await res.json()
    const data = extractData(parsed)
    console.log({ res, parsed, data })
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

const query = (str) => fetch(`https://www.omdbapi.com?apikey=${key}&type=movie&page=1&s=${str}`)

const extractData = (res) => res.Search
