export default function cleanQuery(query) {
  return query //
    .trim()
    .replace(/([^A-Za-z0-9 ':;,./!@#$%^&*()`~])/gm, '') // invalids with blank
    .replace(/(\s{2,})/gm, ' ') // space+ with space
}
