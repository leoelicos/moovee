/* return clean or empty string */
export default function cleanQuery(query) {
  const q = clean(query)
  return !q.length ? '' : q
}

/* remove leading whitespace */
/* remove trailing whitespace */
/* only allow letters, numbers and spaces */
function clean(s) {
  return s.replace(/(^\s+)|([^A-Za-z0-9 ])|(\s+$)/gm, '')
}
