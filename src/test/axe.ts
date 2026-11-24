import axe from 'axe-core'

/** Fails with a readable list when axe finds WCAG 2.2 A/AA problems. */
export async function expectNoAxeViolations(container: Element = document.body): Promise<void> {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    // jsdom can't compute colours; Playwright checks contrast in a real browser.
    rules: { 'color-contrast': { enabled: false } }
  })
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`
  )
  if (summary.length) throw new Error(`axe violations:\n${summary.join('\n')}`)
}
