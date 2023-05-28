function omdbSerialize(s) {
  return s.replace(/\s/gm, '+')
}

function omdbDeserialize(s) {
  return s.replace(/\+/gm, ' ')
}
export { omdbSerialize, omdbDeserialize }
