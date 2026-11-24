import { expect, test } from './fixtures'

/** Visual record for PR review. Run with `npm run screenshots` (skipped in `npm test`). */
const OUT = process.env.SCREENSHOT_DIR ?? 'screenshots'
const WIDTHS = [320, 390, 768, 1280]

test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to capture review screenshots')

for (const width of WIDTHS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`screens ${width} ${colorScheme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 })
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      const shot = (name: string, fullPage = true) =>
        page.screenshot({ path: `${OUT}/${name}-${width}-${colorScheme}.png`, fullPage })

      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()
      await page.waitForLoadState('networkidle')
      await shot('home')

      await page.goto('/search?q=star')
      await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
      await page.waitForLoadState('networkidle')
      await shot('results')

      await page.locator('[data-card]').first().click()
      await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toBeVisible()
      await shot('detail', false)
      await page.getByRole('button', { name: 'Play trailer' }).click()
      await expect(page.locator('iframe')).toBeVisible()
      await shot('trailer', false)

      // More like this sits at the bottom of the detail view.
      await page.getByRole('dialog').getByRole('list', { name: 'Similar titles' }).scrollIntoViewIfNeeded()
      await shot('similar', false)
      await page.getByRole('dialog').getByRole('button', { name: 'Add to watchlist' }).click()
      await page.keyboard.press('Escape')
      for (const id of ['tt9000003', 'tt9000006', 'tt9000010']) {
        await page.goto(`/search?q=star&m=${id}`)
        await page.getByRole('dialog').getByRole('button', { name: 'Add to watchlist' }).click()
      }
      await page.goto('/watchlist')
      await expect(page.locator('[data-card]')).toHaveCount(4)
      await page.waitForLoadState('networkidle')
      await shot('watchlist')

      await page.goto('/?t=series')
      await expect(page.getByRole('link', { name: /Severance/ })).toBeVisible()
      await page.waitForLoadState('networkidle')
      await shot('trending-series')

      await page.goto('/')
      await page.mouse.move(0, 0)
      await page.keyboard.press('Control+k')
      await page.getByRole('combobox').fill('st')
      await shot('palette', false)
    })
  }
}
