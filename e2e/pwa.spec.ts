import { expect, test } from './fixtures'

test.use({ serviceWorkers: 'allow' })

test('installable manifest, and the app shell loads offline', async ({ page, context }) => {
  await page.goto('/')
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href ?? ''
    return (await fetch(href)).json()
  })
  expect(manifest).toMatchObject({ name: 'Moovee', display: 'standalone', start_url: '/' })
  expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']))

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // Reload once so the worker controls the page and caches the build assets.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('link', { name: 'Moovee home' })).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'You’re offline' })).toBeVisible()
  await context.setOffline(false)
})
