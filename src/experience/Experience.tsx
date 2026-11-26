import { AdaptiveDpr, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { CameraRig, type JourneyInput } from './camera/CameraRig'
import { Bubbles } from './objects/Bubbles'
import { Landmarks } from './objects/Landmarks'
import { Banks, Sky } from './objects/Landscape'
import { Lake } from './objects/Lake'

type Props = { input: JourneyInput; low: boolean; still: boolean; onReady: () => void; onFail: () => void; onSlow: () => void; projectIndex: number }

function FrameBudget({ onSlow }: { onSlow: () => void }) {
  const stats = useRef({ warmup: 2.5, frames: 0, duration: 0, misses: 0 })
  useFrame(({ performance }, delta) => {
    if (delta > .5 || document.hidden) return
    const sample = stats.current
    if (sample.warmup > 0) {
      sample.warmup -= delta
      return
    }
    sample.frames++
    sample.duration += delta
    if (sample.duration < 1.8) return
    const fps = sample.frames / sample.duration
    if (fps < 48) performance.regress()
    sample.misses = fps < 28 ? sample.misses + 1 : 0
    sample.frames = 0
    sample.duration = 0
    if (sample.misses >= 2) onSlow()
  })
  return null
}

export default function Experience({ input, low, still, onReady, onFail, onSlow, projectIndex }: Props) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  useEffect(() => {
    if (!canvas) return
    function lost(event: Event) {
      event.preventDefault()
      onFail()
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [canvas, onFail])

  return <Canvas key={Number(low) + 2 * Number(still)} dpr={[.8, low ? 1 : 1.5]}
    camera={{ fov: 45, near: .1, far: 850 }} performance={{ min: .65, debounce: 2200 }}
    frameloop={still ? 'demand' : 'always'}
    gl={{ antialias: !low, alpha: false, powerPreference: low ? 'low-power' : 'high-performance' }}
    onCreated={({ gl }) => { setCanvas(gl.domElement); gl.domElement.dataset.quality = low ? 'lite' : 'full' }}
    fallback={null}>
    <Sky />
    <fogExp2 attach="fog" args={['#bcf1f5', .006]} />
    <hemisphereLight args={['#d6f6ff', '#7ba849', 1.9]} />
    <directionalLight position={[-12, 20, 6]} color="#fff2cd" intensity={2.45} />
    <Environment resolution={low ? 32 : 64}>
      <Lightformer intensity={3} scale={[9, 5, 1]} position={[-4, 6, 6]} target={[0, 0, 0]} />
      <Lightformer color="#67e3fe" intensity={2} scale={[8, 4, 1]} position={[5, 2, -4]} target={[0, 0, 0]} />
      <Lightformer color="#a2eb6f" intensity={1} scale={[10, 2, 1]} position={[0, -4, 2]} target={[0, 0, 0]} />
    </Environment>
    <Banks low={low} />
    <Lake low={low} still={still} />
    <Landmarks low={low} still={still} projectIndex={projectIndex} />
    <Bubbles low={low} still={still} />
    <CameraRig input={input} still={still} onReady={onReady} />
    {!still && <AdaptiveDpr />}
    {!still && !low && <FrameBudget onSlow={onSlow} />}
  </Canvas>
}
