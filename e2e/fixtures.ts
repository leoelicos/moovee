import AxeBuilder from '@axe-core/playwright'
import { expect, test as base, type Page } from '@playwright/test'
import { mockApis, type MockLog, type MockOptions } from './mocks'

export { expect }

export const test = base.extend<{ mocks: MockOptions; api: MockLog }>({
  mocks: [{}, { option: true }],
  api: [
    async ({ page, mocks }, use) => {
      await use(await mockApis(page, mocks))
    },
    { auto: true }
  ]
})

export const searchBox = (page: Page) => page.getByRole('searchbox', { name: 'Search movies and series' })

/** WCAG 2.2 A/AA scan in a real browser (colour contrast included). */
export async function expectAccessible(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  if (include) builder = builder.include(include)
  const { violations } = await builder.analyze()
  const summary = violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`
  )
  expect(summary, summary.join('\n')).toEqual([])
}

/** The page must never scroll sideways. */
export async function expectNoHorizontalScroll(page: Page) {
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth
  }))
  expect(scroll, `page is ${scroll}px wide in a ${client}px viewport`).toBeLessThanOrEqual(client)
}
