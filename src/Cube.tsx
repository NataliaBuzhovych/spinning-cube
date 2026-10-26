import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export const ROTATION_SPEED = 0.5

type CubeProps = {
  paused?: boolean
}

export default function Cube({ paused = false }: CubeProps) {
  const mesh = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current || paused) return
    mesh.current.rotation.x += delta * ROTATION_SPEED
    mesh.current.rotation.y += delta * ROTATION_SPEED
  })

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4f9dff" />
    </mesh>
  )
}
