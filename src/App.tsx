import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Cube from './Cube'

export default function App() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Cube />
      <OrbitControls />
    </Canvas>
  )
}
