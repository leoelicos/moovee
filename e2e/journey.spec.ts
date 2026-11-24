import { expect, searchBox, test } from './fixtures'
import { FIRST_ID } from './mocks'

test.describe('search to trailer', () => {
  test('type a title, open a result and play its trailer', async ({ page, api }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()
    await searchBox(page).fill('star')
    await expect(page).toHaveURL(/\/search\?q=star$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Results for “star”' })).toBeVisible()
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
    expect(api.omdb.filter((u) => u.searchParams.has('s'))).toHaveLength(1)

    await page.getByRole('button', { name: /^Star Wars: Episode IV - A New Hope/ }).click()
    await expect(page).toHaveURL(new RegExp(`m=${FIRST_ID}`))
    const dialog = page.getByRole('dialog', { name: 'Star Wars: Episode IV - A New Hope' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('1977 · PG · 121 min')).toBeVisible()
    await expect(dialog.getByRole('list', { name: 'Ratings' })).toContainText('93%')
    await dialog.getByRole('button', { name: 'Play trailer' }).click()
    const frame = dialog.locator('iframe[title="Star Wars: Episode IV - A New Hope trailer"]')
    await expect(frame).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/vZ734NWnAHA/)
    await expect(page.frameLocator('iframe.trailer__frame').getByText('Mock trailer playing')).toBeVisible()
    expect(api.youtube).toHaveLength(1)

    // The trailer id is cached on the device: reopening costs no YouTube quota.
    await dialog.getByRole('button', { name: 'Close details' }).click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/\/search\?q=star$/)
    await page.getByRole('button', { name: /^Star Wars: Episode IV/ }).click()
    await page.getByRole('button', { name: 'Play trailer' }).click()
    await expect(page.locator('iframe.trailer__frame')).toBeVisible()
    expect(api.youtube).toHaveLength(1)
  })

  test('the URL holds the whole state: reload, share, back and forward', async ({ page }) => {
    await page.goto(`/search?q=star&type=series&sort=title&m=tt9000005`)
    await expect(page.getByRole('dialog', { name: 'Star Wars: The Clone Wars' })).toBeVisible()
    await expect(page.getByRole('dialog').getByText('Seasons')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL(/\?q=star&type=series&sort=title$/)
    await expect(page.getByRole('radio', { name: 'Series' })).toBeChecked()
    await expect(page.getByRole('combobox', { name: 'Sort' })).toHaveValue('title')
    await expect(searchBox(page)).toHaveValue('star')
    const names = await page.locator('.card__title').allTextContents()
    expect(names.length).toBeGreaterThan(1)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    await expect(page.locator('[data-card] .chip')).toHaveCount(names.length)

    // Opening details pushes history, so Back closes them.
    await page.locator('[data-card]').first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.goBack()
    await expect(page.getByRole('dialog')).toBeHidden()
    await page.goForward()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.reload()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('filters, year and load more', async ({ page, api }) => {
    await page.goto('/search?q=star')
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
    await page.getByRole('button', { name: 'Load more' }).click()
    await expect(page.getByText('Showing 20 of 24 results')).toBeVisible()
    await page.getByRole('button', { name: 'Load more' }).click()
    await expect(page.getByText('Showing 24 of 24 results')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Load more' })).toBeHidden()

    await page.getByRole('radio', { name: 'Movies' }).click()
    await expect(page).toHaveURL(/type=movie/)
    await expect(page.getByText('Showing 10 of 19 results')).toBeVisible()
    await page.getByRole('textbox', { name: 'Year' }).fill('1980')
    await expect(page).toHaveURL(/y=1980/)
    await expect(page.getByText('Showing 2 of 2 results')).toBeVisible()
    const last = api.omdb.at(-1)
    expect(last?.searchParams.get('type')).toBe('movie')
    expect(last?.searchParams.get('y')).toBe('1980')
    await page.getByRole('combobox', { name: 'Sort' }).selectOption('oldest')
    await expect(page).toHaveURL(/sort=oldest/)
  })

  test('recent searches are remembered and can be removed', async ({ page }) => {
    await page.goto('/')
    await searchBox(page).fill('star trek')
    await searchBox(page).press('Enter')
    await expect(page.getByText(/Showing \d+ of \d+ results/)).toBeVisible()
    await page.getByRole('link', { name: 'Moovee home' }).click()
    const recent = page.getByRole('region', { name: 'Recent searches' })
    await expect(recent.getByRole('link', { name: 'star trek' })).toBeVisible()
    await recent.getByRole('button', { name: 'Remove star trek from recent searches' }).click()
    await expect(recent).toBeHidden()
  })

  test('clearing the search returns home', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(searchBox(page)).toHaveValue('star')
    await searchBox(page).fill('')
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()
  })

  test('trending cards search for their title', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('region', { name: 'Trending this week' })
      .getByRole('link', { name: /Wicked/ })
      .click()
    await expect(page).toHaveURL(/\/search\?q=Wicked$/)
    await expect(searchBox(page)).toHaveValue('Wicked')
  })
})
