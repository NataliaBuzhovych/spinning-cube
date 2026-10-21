import ReactThreeTestRenderer from '@react-three/test-renderer'
import type { Mesh } from 'three'
import { describe, expect, it } from 'vitest'
import Cube, { ROTATION_SPEED } from './Cube'

async function renderCube() {
  const renderer = await ReactThreeTestRenderer.create(<Cube />)
  const mesh = renderer.scene.children[0].instance as Mesh
  return { renderer, mesh }
}

describe('Cube', () => {
  it('renders a box mesh at rest', async () => {
    const { mesh } = await renderCube()
    expect(mesh.geometry.type).toBe('BoxGeometry')
    expect(mesh.rotation.x).toBe(0)
    expect(mesh.rotation.y).toBe(0)
  })

  it('rotates a little more on every frame', async () => {
    const { renderer, mesh } = await renderCube()
    let previous = mesh.rotation.y

    for (let frame = 0; frame < 3; frame++) {
      await renderer.advanceFrames(1, 0.5)
      expect(mesh.rotation.y).toBeGreaterThan(previous)
      previous = mesh.rotation.y
    }
  })

  it('rotates in proportion to elapsed time', async () => {
    const { renderer, mesh } = await renderCube()

    await renderer.advanceFrames(2, 1)

    expect(mesh.rotation.x).toBeCloseTo(2 * ROTATION_SPEED)
    expect(mesh.rotation.y).toBeCloseTo(2 * ROTATION_SPEED)
    expect(mesh.rotation.z).toBe(0)
  })

  it('does not rotate when no time passes', async () => {
    const { renderer, mesh } = await renderCube()

    await renderer.advanceFrames(3, 0)

    expect(mesh.rotation.x).toBe(0)
    expect(mesh.rotation.y).toBe(0)
  })
})
