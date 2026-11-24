import { expect, test } from '@playwright/test'

/**
 * Optional smoke test against a real deployment and the real APIs (uses their quota).
 * Skipped unless LIVE_URL is set, e.g. LIVE_URL=https://mooovee.vercel.app npx playwright test e2e/live.spec.ts
 */
const LIVE_URL = process.env.LIVE_URL

test.skip(!LIVE_URL, 'Set LIVE_URL to run against a deployment')

test('live: trending, search and details work with real keys', async ({ page }) => {
  await page.goto(`${LIVE_URL}/`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Trending this week' }).getByRole('link').first()).toBeVisible()
  await page.goto(`${LIVE_URL}/search?q=inception`)
  await expect(page.getByText(/Showing \d+ of [\d,]+ results/)).toBeVisible({ timeout: 15_000 })
  await page.locator('[data-card]').first().click()
  await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toBeVisible()
})
