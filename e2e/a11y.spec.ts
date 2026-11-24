import { expect, expectAccessible, test } from './fixtures'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`axe (${colorScheme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
    })

    test('home', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()
      await expectAccessible(page)
    })

    test('results', async ({ page }) => {
      await page.goto('/search?q=star')
      await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
      await expectAccessible(page)
    })

    test('detail dialog with trailer', async ({ page }) => {
      await page.goto('/search?q=star&m=tt9000001')
      await expect(page.getByRole('dialog', { name: /A New Hope/ })).toBeVisible()
      await expectAccessible(page, 'dialog')
      await page.getByRole('button', { name: 'Play trailer' }).click()
      await expect(page.locator('iframe')).toBeVisible()
      await expectAccessible(page, 'dialog')
    })

    test('empty and 404', async ({ page }) => {
      await page.goto('/search?q=zzzz')
      await expect(page.getByRole('heading', { name: 'No matches' })).toBeVisible()
      await expectAccessible(page)
      await page.goto('/nope')
      await expectAccessible(page)
    })

    test('shortcuts dialog', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: 'Keyboard shortcuts' }).click()
      await expectAccessible(page, 'dialog')
    })
  })
}
