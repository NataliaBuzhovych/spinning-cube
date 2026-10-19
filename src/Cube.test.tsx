import ReactThreeTestRenderer from '@react-three/test-renderer'
import type { Mesh } from 'three'
import { expect, it } from 'vitest'
import Cube, { ROTATION_SPEED } from './Cube'

it('renders a cube mesh that rotates on each frame', async () => {
  const renderer = await ReactThreeTestRenderer.create(<Cube />)
  const mesh = renderer.scene.children[0].instance as Mesh
  expect(mesh.geometry.type).toBe('BoxGeometry')
  expect(mesh.rotation.y).toBe(0)

  await renderer.advanceFrames(2, 1)

  expect(mesh.rotation.x).toBeCloseTo(2 * ROTATION_SPEED)
  expect(mesh.rotation.y).toBeCloseTo(2 * ROTATION_SPEED)
})
