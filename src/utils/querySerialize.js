function querySerialize(s) {
  return s.replace(/\s/gm, '+')
}

function queryDeserialize(s) {
  return s.replace(/\+/gm, ' ')
}
export { querySerialize, queryDeserialize }
