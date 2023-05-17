export default function cleanQuery(query) {
  return query.replace(/(^\s+)|([^A-Za-z0-9 ])|(\s+$)/gm, '')
}
