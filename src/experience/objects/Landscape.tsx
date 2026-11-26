import { useEffect, useMemo } from 'react'
import { BackSide, Color, Float32BufferAttribute, PlaneGeometry } from 'three'
import { atmosphereFragment, atmosphereVertex } from '../materials/atmosphere'

export function Sky() {
  return <mesh position={[0, 0, -120]} renderOrder={-10}>
    <sphereGeometry args={[440, 32, 20]} />
    <shaderMaterial vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment}
      side={BackSide} depthWrite={false} />
  </mesh>
}

const knobs = [
  [-1.04, .22, .6], [-.76, .36, .8], [-.38, .18, .44],
  [.13, .42, 1], [.44, .3, .73], [.88, .32, .57],
]

function bankHeight(x: number, z: number, side: number) {
  const shoreline = 18 + 7 * Math.sin(z * .034 + side) + 3 * Math.cos(z * .11)
  const inland = Math.max(0, (x - shoreline) / (108 - shoreline))
  const rise = 1 - Math.exp(-inland * 7)
  const mounds = knobs.reduce((height, [center, width, amplitude], index) => {
    const distance = (z + 125) / 158 - center + side * .045 * index
    const crest = Math.exp(-Math.pow(distance / width, 2) * 3)
    const cross = .4 + .6 * Math.sin(inland * (2.6 + index * .24) + index * 1.9) ** 2
    return height + crest * amplitude * cross * (9 + index * .85)
  }, 0)
  return -.35 + rise * (mounds + .45 * Math.sin(z * .27 + x * .12))
}

function createBank(side: number, low: boolean) {
  const geometry = new PlaneGeometry(104, 427, low ? 32 : 54, low ? 98 : 170)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(side * 60, 0, -150)
  const points = geometry.attributes.position
  const dark = new Color('#287e31')
  const grass = new Color('#86d72f')
  const crest = new Color('#c3ed61')
  const sand = new Color('#e7df93')
  const color = new Color()
  const colors: number[] = []
  for (let i = 0; i < points.count; i++) {
    const x = points.getX(i)
    const z = points.getZ(i)
    const y = bankHeight(Math.abs(x), z, side)
    points.setY(i, y)
    const variation = .6 + .24 * Math.sin(x * .52 + z * .21) * Math.cos(z * .36)
    color.copy(dark).lerp(grass, variation).lerp(crest, Math.max(0, y - 5) * .035)
    color.lerp(sand, Math.max(0, 1 - Math.abs(y) * 1.35) * .63)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

export function Banks({ low }: { low: boolean }) {
  const banks = useMemo(() => [-1, 1].map((side) => createBank(side, low)), [low])
  useEffect(() => () => banks.forEach((geometry) => geometry.dispose()), [banks])
  return <group>{banks.map((geometry, index) => <mesh key={index} geometry={geometry}>
    <meshStandardMaterial color="#ffffff" vertexColors roughness={.94} />
  </mesh>)}</group>
}
