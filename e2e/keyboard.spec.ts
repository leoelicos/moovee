import { expect, searchBox, test } from './fixtures'

test.describe('keyboard only', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('search, move through the grid, open, play and close without a mouse', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeVisible()

    // Skip link is the first stop and jumps past the header.
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()

    await page.keyboard.press('/')
    await expect(searchBox(page)).toBeFocused()
    await page.keyboard.type('star')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()

    const cards = page.locator('[data-card]')
    await page.keyboard.press('ArrowDown')
    await expect(cards.nth(0)).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(cards.nth(1)).toBeFocused()

    // Down moves a whole row in the real layout.
    const columns = await cards.evaluateAll((els) => {
      const top = els[0]?.getBoundingClientRect().top ?? 0
      return els.filter((el) => Math.abs(el.getBoundingClientRect().top - top) < 2).length
    })
    expect(columns).toBeGreaterThan(1)
    await page.keyboard.press('ArrowDown')
    await expect(cards.nth(1 + columns)).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(cards.nth(1)).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(searchBox(page)).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')

    // Enter opens the detail; focus moves into the modal and stays there.
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Star Wars: Episode V - The Empire Strikes Back')
    const inside = () => page.evaluate(() => !!document.activeElement?.closest('dialog'))
    expect(await inside()).toBe(true)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      expect(await inside()).toBe(true)
    }
    await dialog.getByRole('button', { name: 'Play trailer' }).focus()
    await page.keyboard.press('Enter')
    await expect(dialog.locator('iframe')).toBeVisible()
    await expect(dialog.getByRole('region', { name: /trailer player/ })).toBeFocused()

    // Esc closes and focus goes back to the card that opened it.
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(cards.nth(1)).toBeFocused()
  })

  test('? shows shortcuts; Esc in search clears then leaves', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Shift+Slash')
    const help = page.getByRole('dialog', { name: 'Keyboard shortcuts' })
    await expect(help).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(help).toBeHidden()
    await page.keyboard.press('/')
    await page.keyboard.type('star')
    await expect(page).toHaveURL(/q=star/)
    await page.keyboard.press('Escape')
    await expect(searchBox(page)).toHaveValue('')
    await expect(page).toHaveURL(/\/$/)
    await page.keyboard.press('Escape')
    await expect(searchBox(page)).not.toBeFocused()
  })

  test('focus is always visible', async ({ page }) => {
    await page.goto('/search?q=star')
    await expect(page.getByText('Showing 10 of 24 results')).toBeVisible()
    await page.locator('[data-card]').first().focus()
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
    expect(outline).not.toBe('none')
  })
})
