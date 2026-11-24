import { expect, expectAccessible, searchBox, test } from './fixtures'

test.describe('watchlist', () => {
  test('save from details, survive a reload, open and remove from /watchlist', async ({ page }) => {
    await page.goto('/search?q=star&m=tt9000003')
    const dialog = page.getByRole('dialog', { name: 'Star Trek' })
    await dialog.getByRole('button', { name: 'Add to watchlist' }).click()
    await expect(dialog.getByRole('button', { name: 'On your watchlist' })).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('link', { name: 'Watchlist, 1 saved' })).toBeVisible()

    await page.reload()
    await page.getByRole('link', { name: 'Watchlist, 1 saved' }).click()
    await expect(page).toHaveURL(/\/watchlist$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Your watchlist' })).toBeVisible()
    await expectAccessible(page)
    await page.getByRole('button', { name: /^Star Trek\W+2009/ }).click()
    await expect(page).toHaveURL(/\/watchlist\?m=tt9000003$/)
    await page.getByRole('dialog').getByRole('button', { name: 'On your watchlist' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Watchlist', exact: true })).toBeVisible()
  })
})

test.describe('trending and similar', () => {
  test('switch trending between movies and series', async ({ page }) => {
    await page.goto('/')
    const trending = page.getByRole('region', { name: 'Trending this week' })
    await expect(trending.getByRole('link', { name: /Wicked/ })).toBeVisible()
    await trending.getByRole('radio', { name: 'Series' }).click()
    await expect(page).toHaveURL(/\?t=series$/)
    await expect(trending.getByRole('link', { name: /Severance/ })).toBeVisible()
    await page.reload()
    await expect(trending.getByRole('radio', { name: 'Series' })).toBeChecked()
    await trending.getByRole('link', { name: /Severance/ }).click()
    await expect(page).toHaveURL(/\/search\?q=Severance&type=series$/)
    await expect(page.getByRole('radio', { name: 'Series' })).toBeChecked()
  })

  test('"More like this" in the detail view searches the picked title', async ({ page }) => {
    await page.goto('/search?q=star&m=tt9000001')
    const similar = page.getByRole('dialog').getByRole('list', { name: 'Similar titles' })
    await expect(similar.getByRole('link')).toHaveCount(6)
    await similar.getByRole('link', { name: /Blade Runner/ }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(/\/search\?q=Blade\+Runner$/)
    await expect(searchBox(page)).toHaveValue('Blade Runner')
  })
})

test.describe('command palette', () => {
  test('Ctrl+K searches, reaches the watchlist and switches theme, all by keyboard', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const palette = page.getByRole('dialog', { name: 'Command palette' })
    const box = palette.getByRole('combobox', { name: 'Type a title or a command' })
    await expect(box).toBeFocused()
    await expectAccessible(page, 'dialog')
    await box.fill('star')
    await expect(palette.getByRole('option').first()).toHaveText(/Search for “star”/)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/search\?q=star$/)
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()

    await page.keyboard.press('Control+k')
    await box.fill('theme')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(palette).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')

    await page.keyboard.press('Control+k')
    await box.fill('watchlist')
    await page.keyboard.press('ArrowDown')
    await expect(palette.getByRole('option', { name: /Open watchlist/ })).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/watchlist$/)
  })
})

test.describe('share meta', () => {
  test('pages carry Open Graph and Twitter card tags', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Moovee/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  })
})
