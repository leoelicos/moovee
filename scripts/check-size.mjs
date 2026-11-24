// Performance budget: fails when the gzipped production JS or CSS grows past the limits below.
// Run after `vite build` (npm test runs it after the e2e build).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = { js: 115, css: 12 }
const dir = join(process.cwd(), 'build', 'assets')

let files
try {
  files = readdirSync(dir)
} catch {
  console.error('No build/assets folder. Run `npm run build` first.')
  process.exit(1)
}

let failed = false
for (const ext of Object.keys(BUDGET_KB)) {
  const total = files
    .filter((f) => f.endsWith(`.${ext}`))
    .reduce((sum, f) => sum + gzipSync(readFileSync(join(dir, f))).length, 0)
  const kb = total / 1024
  const ok = kb <= BUDGET_KB[ext]
  failed ||= !ok
  console.log(`${ok ? '✓' : '✗'} ${ext.toUpperCase()} ${kb.toFixed(1)} KB gzipped (budget ${BUDGET_KB[ext]} KB)`)
}
process.exit(failed ? 1 : 0)
