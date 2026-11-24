import type { Page } from '@playwright/test'
import { expect, expectNoHorizontalScroll, searchBox, test } from './fixtures'

export const WIDTHS = [320, 375, 390, 768, 1024, 1280] as const

/** Every visible control is inside the viewport and at least 24×24 (WCAG 2.5.8). */
async function expectUsableControls(page: Page, scope = 'body') {
  const problems = await page.locator(scope).evaluate((root) => {
    const width = document.documentElement.clientWidth
    return Array.from(root.querySelectorAll<HTMLElement>('a[href], button, input, select'))
      .filter((el) => el.offsetParent !== null && !el.closest('.rail') && !el.classList.contains('skip-link'))
      .flatMap((el) => {
        const r = el.getBoundingClientRect()
        const name = el.getAttribute('aria-label') ?? el.textContent?.trim() ?? el.tagName
        const out: string[] = []
        if (r.left < -1 || r.right > width + 1) out.push(`${name} is outside the viewport (${r.left}–${r.right})`)
        const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline'
        if (!inline && (r.width < 24 || r.height < 24)) out.push(`${name} is only ${r.width}×${r.height}`)
        return out
      })
  })
  expect(problems).toEqual([])
}

for (const width of WIDTHS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`${width}px ${colorScheme}`, () => {
      test.use({ viewport: { width, height: width < 768 ? 740 : 900 } })
      test.beforeEach(async ({ page }) => page.emulateMedia({ colorScheme }))

      test('home, results and detail fit without sideways scrolling', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()
        await expect(searchBox(page)).toBeVisible()
        await expectNoHorizontalScroll(page)
        await expectUsableControls(page)

        await page.goto('/search?q=star')
        await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
        await expectNoHorizontalScroll(page)
        await expectUsableControls(page)
        const columns = await page.locator('[data-card]').evaluateAll((els) => {
          const top = els[0]?.getBoundingClientRect().top ?? 0
          return els.filter((el) => Math.abs(el.getBoundingClientRect().top - top) < 2).length
        })
        expect(columns).toBeGreaterThanOrEqual(width < 768 ? 2 : 4)

        await page.locator('[data-card]').first().click()
        const dialog = page.getByRole('dialog')
        await expect(dialog.getByRole('heading', { level: 2 })).toBeVisible()
        const box = await dialog.boundingBox()
        expect(box?.x).toBeGreaterThanOrEqual(0)
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width)
        await expect(dialog.getByRole('button', { name: 'Play trailer' })).toBeInViewport()
        const sideways = await dialog.evaluate((el) => el.scrollWidth > el.clientWidth)
        expect(sideways).toBe(false)
        await expectUsableControls(page, 'dialog')
      })
    })
  }
}
