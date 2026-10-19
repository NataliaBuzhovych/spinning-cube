import { expect, test } from '@playwright/test'

test('renders a full-screen canvas', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // The canvas is resized to its container after mount, so poll.
  const viewport = page.viewportSize()!
  await expect
    .poll(async () => (await canvas.boundingBox())?.width)
    .toBe(viewport.width)
  await expect
    .poll(async () => (await canvas.boundingBox())?.height)
    .toBe(viewport.height)
})

test('draws a rotating cube', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // A blank canvas would produce identical frames; a spinning cube does not.
  const first = await canvas.screenshot()
  await expect
    .poll(async () => (await canvas.screenshot()).equals(first))
    .toBe(false)
})
