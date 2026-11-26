import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'
import { glassFragment, glassVertex } from '../materials/glass'

const fraction = (value: number) => value - Math.floor(value)
const seeded = (seed: number) => fraction(Math.sin(seed * 127.1) * 43758.5453)

const foreground = [
  [-7.7, 6.6, -8, .67], [2.2, 9.3, -9, .38], [12.3, 8.1, -13, 1.1],
  [3.4, 2.0, -5, .32], [10.5, 3.2, -7, .5], [14.4, 6, -20, .44],
  [-3.3, 2.2, -4, .13], [2.8, 6.4, -10, .26], [7.9, 9.5, -16, .31],
]
const field = Array.from({ length: 100 }, (_, index) => {
  const seed = index + 10
  return [(seeded(seed) - .5) * 56, 1.1 + seeded(seed + 95) * 14,
    -18 - seeded(seed + 201) * 298, .06 + seeded(seed + 414) ** 3 * .8]
})

export function Bubbles({ low, still }: { low: boolean; still: boolean }) {
  const instances = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const uniforms = useMemo(() => ({ strength: { value: .86 } }), [])
  const count = low ? 47 : foreground.length + field.length
  const bubbles = useMemo(() => [...foreground, ...field].slice(0, count), [count])
  function positionBubbles(time: number) {
    if (!instances.current) return
    bubbles.forEach(([x, y, z, scale], index) => {
      dummy.position.set(x + Math.cos(time * .3 + index) * .27,
        y + Math.sin(time * .65 + index) * .37, z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      instances.current!.setMatrixAt(index, dummy.matrix)
    })
    instances.current.instanceMatrix.needsUpdate = true
  }
  useLayoutEffect(() => {
    positionBubbles(0)
    // The render loop owns this same instance buffer after initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbles])
  useFrame(({ clock }) => { if (!still) positionBubbles(clock.elapsedTime) })
  return <instancedMesh ref={instances} args={[undefined, undefined, count]} frustumCulled={false} renderOrder={4}>
    <sphereGeometry args={[1, low ? 12 : 20, low ? 9 : 14]} />
    <shaderMaterial uniforms={uniforms} vertexShader={glassVertex} fragmentShader={glassFragment}
      transparent depthWrite={false} />
  </instancedMesh>
}
