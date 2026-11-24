import { expect, searchBox, test } from './fixtures'
import { BROKEN_POSTER_ID, NO_POSTER_ID } from './mocks'

test.describe('posters', () => {
  test('missing and broken posters fall back to a placeholder', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
    const noPoster = page.getByRole('button', { name: /^Stardust/ })
    await expect(noPoster.getByTestId('poster-fallback')).toContainText('Stardust')
    const broken = page.getByRole('button', { name: /^Lone Star/ })
    await expect(broken.getByTestId('poster-fallback')).toBeVisible()
    await expect(broken.locator('img')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /^Star Trek\W+2009/ }).locator('img')).toBeVisible()

    await page.goto(`/search?q=star&m=${NO_POSTER_ID}`)
    await expect(page.getByRole('dialog').getByRole('img', { name: 'No poster for Stardust' })).toBeVisible()
    await page.goto(`/search?q=star&m=${BROKEN_POSTER_ID}`)
    await expect(page.getByRole('dialog').getByRole('img', { name: 'No poster for Lone Star' })).toBeVisible()
  })
})

test.describe('loading', () => {
  test.use({ mocks: { omdbDelay: 800 } })

  test('skeletons show while results load', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(page.getByTestId('skeleton')).toBeVisible()
    await expect(page.getByText('Loading results…')).toBeAttached()
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
    await expect(page.getByTestId('skeleton')).toBeHidden()
  })

  test('typing fast sends one search for the settled text', async ({ page, api }) => {
    await page.goto('/')
    await searchBox(page).pressSequentially('star wars', { delay: 40 })
    await expect(page.getByText(/Showing \d+ of \d+ results/)).toBeVisible()
    expect(api.omdb.map((u) => u.searchParams.get('s'))).toEqual(['star wars'])
  })
})

test.describe('empty', () => {
  test('no matches suggests clearing filters', async ({ page }) => {
    await page.goto('/search?q=zzzz&type=series')
    await expect(page.getByRole('heading', { name: 'No matches' })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'No results' })).toBeVisible()
    await page.getByRole('link', { name: 'Clear filters' }).click()
    await expect(page).toHaveURL(/\?q=zzzz$/)
    await expect(page.getByRole('heading', { name: 'No matches' })).toBeVisible()
  })

  test('unknown pages show a friendly 404', async ({ page }) => {
    await page.goto('/not-a-page')
    await expect(page.getByRole('heading', { name: 'This page wandered off' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to search' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe('OMDb down', () => {
  test.use({ mocks: { omdb: 'error' } })

  test('search shows an error with retry', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(page.getByRole('alert')).toContainText('The service answered with an error (503).')
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
  })

  test('details show an error inside the dialog', async ({ page }) => {
    await page.goto('/?m=tt9000001')
    await expect(page.getByRole('dialog', { name: 'Title details' }).getByRole('alert')).toBeVisible()
  })
})

test.describe('bad OMDb key', () => {
  test.use({ mocks: { omdb: 'invalid-key' } })

  test('shows the OMDb message', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(page.getByRole('alert')).toContainText('Invalid API key!')
  })
})

test.describe('TMDB down', () => {
  test.use({ mocks: { tmdb: 'error' } })

  test('home still offers quick picks', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Find any trailer, fast.' })).toBeVisible()
    await page.getByRole('link', { name: 'Oppenheimer' }).click()
    await expect(page).toHaveURL(/q=Oppenheimer/)
  })
})

test.describe('YouTube', () => {
  test.describe('no trailer', () => {
    test.use({ mocks: { youtube: 'none' } })
    test('offers a YouTube search link', async ({ page }) => {
      await page.goto('/?m=tt9000001')
      await page.getByRole('button', { name: 'Play trailer' }).click()
      await expect(page.getByText('No trailer found on YouTube.')).toBeVisible()
      await expect(page.getByRole('link', { name: /Search YouTube/ })).toHaveAttribute('href', /youtube\.com\/results/)
    })
  })

  test.describe('quota exceeded', () => {
    test.use({ mocks: { youtube: 'error' } })
    test('explains and still links out', async ({ page }) => {
      await page.goto('/?m=tt9000001')
      await page.getByRole('button', { name: 'Play trailer' }).click()
      await expect(page.getByText('The trailer could not be loaded.')).toBeVisible()
    })
  })
})

test.describe('motion and theme', () => {
  test('reduced motion turns animations off', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/search?q=star')
    await page.locator('[data-card]').first().click()
    const duration = await page.locator('dialog').evaluate((el) => getComputedStyle(el).animationDuration)
    expect(parseFloat(duration)).toBeLessThan(0.01)
  })

  test('follows the system theme and remembers a manual choice', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(await bg()).toBe('rgb(11, 13, 18)')
    await page.getByRole('button', { name: /^Theme: System/ }).click()
    expect(await bg()).toBe('rgb(246, 247, 251)')
    await page.reload()
    expect(await bg()).toBe('rgb(246, 247, 251)')
    await page.getByRole('button', { name: /^Theme: Light/ }).click()
    await page.emulateMedia({ colorScheme: 'light' })
    expect(await bg()).toBe('rgb(11, 13, 18)')
  })
})
