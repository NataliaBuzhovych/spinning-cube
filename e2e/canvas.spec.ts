import { expect, test, type Locator, type Page } from '@playwright/test'

// Loads the app on a fake clock that is paused, so animation frames only
// advance via page.clock.runFor() and each screenshot is at a known time.
async function openWithFrozenClock(page: Page) {
  await page.clock.install({ time: 0 })
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
  await page.clock.pauseAt(1000)
  return canvas
}

async function dragAcross(page: Page, canvas: Locator) {
  const box = (await canvas.boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 150, y + 80, { steps: 10 })
  await page.mouse.up()
}

test('canvas fills the viewport', async ({ page }) => {
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

test('canvas resizes with the window', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  for (const size of [
    { width: 640, height: 480 },
    { width: 1000, height: 700 },
  ]) {
    await page.setViewportSize(size)
    await expect
      .poll(async () => {
        const box = await canvas.boundingBox()
        return { width: box?.width, height: box?.height }
      })
      .toEqual(size)
  }
})

test('draws a rotating cube', async ({ page }) => {
  // Fake clock so each sample is taken at a known point in time.
  const canvas = await openWithFrozenClock(page)
  await page.clock.runFor(500)
  const first = await canvas.screenshot()
  // Time standing still must give an identical frame...
  expect((await canvas.screenshot()).equals(first)).toBe(true)

  // ...so any difference after time passes comes from the cube rotating.
  await page.clock.runFor(1000)
  expect((await canvas.screenshot()).equals(first)).toBe(false)
})

test('dragging the mouse orbits the camera', async ({ browser }) => {
  // Two pages run the identical clock schedule, so the cube is at the same
  // rotation in both; only one of them is dragged.
  const frameAfter = async (
    interact: (page: Page, canvas: Locator) => Promise<void>,
  ) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    const canvas = await openWithFrozenClock(page)
    await page.clock.runFor(500)

    await interact(page, canvas)

    await page.clock.runFor(500)
    const frame = await canvas.screenshot()
    await context.close()
    return frame
  }

  const still = await frameAfter(async () => {})
  const dragged = await frameAfter(dragAcross)
  expect(dragged.equals(still)).toBe(false)
})
