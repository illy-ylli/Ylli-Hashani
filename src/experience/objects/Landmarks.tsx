import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import { MathUtils, type Group } from 'three'
import { stations } from '../../config/chapters'
import { glassFragment, glassVertex } from '../materials/glass'

type Position = [number, number, number]

function GlassShell({ radius, strength = 1, low = false }: {
  radius: number; strength?: number; low?: boolean
}) {
  const uniforms = useMemo(() => ({ strength: { value: strength } }), [strength])
  return <mesh renderOrder={3}>
    <sphereGeometry args={[radius, low ? 26 : 56, low ? 18 : 36]} />
    <shaderMaterial uniforms={uniforms} vertexShader={glassVertex}
      fragmentShader={glassFragment} transparent depthWrite={false} />
  </mesh>
}

function Chrome({ color = '#b9eeff', metalness = .83 }: { color?: string; metalness?: number }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={.19} />
}

function Halo({ radius, tube = .04, color = '#dbffff', rotation = [0, 0, 0] }: {
  radius: number; tube?: number; color?: string; rotation?: Position
}) {
  return <mesh rotation={rotation}>
    <torusGeometry args={[radius, tube, 8, 72]} />
    <Chrome color={color} />
  </mesh>
}

function Float({ children, still, phase = 0, rotation = true }: {
  children: ReactNode; still: boolean; phase?: number; rotation?: boolean
}) {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current || still) return
    const time = clock.elapsedTime
    group.current.position.y = Math.sin(time * .78 + phase) * .24
    if (rotation) group.current.rotation.y = Math.sin(time * .37 + phase) * .3
    group.current.rotation.z = Math.sin(time * .28 + phase) * .045
  })
  return <group ref={group}>{children}</group>
}

function Core({ low, still }: { low: boolean; still: boolean }) {
  return <Float still={still}>
    <group rotation={[.16, -.24, -.12]}>
      <Halo radius={3.22} tube={.052} rotation={[.17, .3, 0]} />
      <Halo radius={2.83} tube={.034} color="#73f5e5" rotation={[.18, .7, .3]} />
      <Halo radius={2.65} tube={.037} rotation={[1.17, .12, -.28]} />
      <mesh rotation={[.06, -.07, Math.PI / 4]}>
        <boxGeometry args={[2.22, 2.22, .48]} />
        <Chrome color="#007bb5" metalness={.63} />
      </mesh>
      <mesh position={[0, 0, .25]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.92, 1.92, .095]} />
        <meshStandardMaterial color="#62f0d6" emissive="#13c8b5" emissiveIntensity={.36}
          metalness={.28} roughness={.2} />
      </mesh>
      <group position={[0, 0, .36]}>
        <mesh position={[0, -.16, 0]} rotation={[0, 0, -.23]}>
          <capsuleGeometry args={[.045, .92, 4, 10]} /><meshBasicMaterial color="#f5ffdc" />
        </mesh>
        {([[-.23, .04, .89], [.23, .42, -.78]] as const).map(([x, y, turn]) =>
          <mesh key={x} position={[x, y, .04]} scale={[.20, .42, .085]} rotation={[0, 0, turn]}>
            <sphereGeometry args={[1, 24, 14]} /><meshBasicMaterial color="#f5ffdd" />
          </mesh>)}
      </group>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = index * Math.PI / 4
        return <mesh key={index} position={[Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, .19]}>
          <sphereGeometry args={[index % 2 ? .09 : .16, 12, 8]} />
          <meshBasicMaterial color={index % 2 ? '#b1fcff' : '#f4ffbd'} />
        </mesh>
      })}
    </group>
    <GlassShell radius={3.55} low={low} strength={1.08} />
  </Float>
}

function Platform({ radius = 4 }: { radius?: number }) {
  return <group position={[0, -2.68, 0]}>
    <mesh>
      <cylinderGeometry args={[radius, radius * .75, .46, 48]} />
      <Chrome color="#3191a9" metalness={.61} />
    </mesh>
    <mesh position-y={.27}>
      <cylinderGeometry args={[radius * .96, radius, .14, 48]} />
      <meshStandardMaterial color="#d1fcff" metalness={.38} roughness={.18} />
    </mesh>
    <mesh position-y={.38} rotation-x={-Math.PI / 2}>
      <torusGeometry args={[radius * .9, .035, 6, 64]} /><meshBasicMaterial color="#e0ffbf" />
    </mesh>
  </group>
}

function Gallery({ still, low, projectIndex }: { still: boolean; low: boolean; projectIndex: number }) {
  const panels = useRef<(Group | null)[]>([])
  const selected = [0, -1, 1][projectIndex % 3]
  useFrame((_, delta) => {
    for (const [slot, panel] of panels.current.entries()) {
      if (!panel) continue
      const target = slot - 1 === selected ? .82 : .12
      panel.position.y = still ? target : MathUtils.damp(panel.position.y, target, 6, delta)
    }
  })
  return <>
    <Platform radius={5.7} />
    {[-1, 0, 1].map((index) => <group key={index}
      ref={(panel) => { panels.current[index + 1] = panel }}
      position={[index * 3.45, index === selected ? .66 : .12, index === 0 ? .2 : -.8]}
      rotation-y={index * -.25}>
      <Float still={still} phase={index}>
        <mesh>
          <boxGeometry args={[2.8, 3.36, .19]} />
          <meshPhysicalMaterial color="#7bd8ed" metalness={.35} roughness={.16}
            clearcoat={1} transparent opacity={.83}
            emissive={index === selected ? '#65d9da' : '#143e46'} emissiveIntensity={index === selected ? .19 : .05} />
        </mesh>
        <group position-z={.12}>
          <mesh position-y={.38}>
            <planeGeometry args={[2.42, 1.81]} />
            <meshBasicMaterial color={['#0c8291', '#1075af', '#358c66'][index + 1]} />
          </mesh>
          <group position={[0, .36, .23]} scale={.3}>
            <mesh rotation={[.4, .24, .5]}>
              <icosahedronGeometry args={[1.51, 0]} /><Chrome color="#acf3d8" metalness={.41} />
            </mesh>
            <GlassShell radius={2.1} strength={.8} low={low} />
          </group>
          {[[-.86, .31], [-1.12, .63]].map(([y, width]) => <mesh key={y} position={[-.98 + width, y, .02]}>
            <planeGeometry args={[width * 2, .07]} /><meshBasicMaterial color="#e9fffa" />
          </mesh>)}
        </group>
      </Float>
    </group>)}
  </>
}

function Skills({ still, low }: { still: boolean; low: boolean }) {
  return <Float still={still} phase={2}>
    <Halo radius={3.64} tube={.048} rotation={[.35, .47, -.26]} />
    <Halo radius={3.18} tube={.043} rotation={[1.18, -.52, .17]} />
    <mesh rotation={[.5, .5, .2]}>
      <octahedronGeometry args={[1.35]} /><Chrome color="#87f1d1" metalness={.58} />
    </mesh>
    {Array.from({ length: 8 }, (_, index) => {
      const angle = index * Math.PI / 4
      return <group key={index} position={[3.56 * Math.cos(angle), 2.65 * Math.sin(angle), Math.sin(angle * 2) * .81]}>
        <mesh rotation={[.42, .36, index]}>
          <icosahedronGeometry args={[.34, 0]} />
          <Chrome color={index % 2 ? '#b7f878' : '#51bfff'} metalness={.43} />
        </mesh>
        <GlassShell radius={.67} low={low} />
      </group>
    })}
  </Float>
}

function Conservatory({ still }: { still: boolean }) {
  return <>
    <Platform radius={4.7} />
    <Float still={still} rotation={false} phase={5}>
      {[[-1.9, .9, -.62], [0, 1.4, .24], [1.7, .78, .67]].map(([x, y, lean], index) =>
        <group key={x} position={[x, y - .9, -index * .23]} rotation-z={lean}>
          <mesh scale={[.66, 2.3, .2]}>
            <sphereGeometry args={[1, 30, 18]} />
            <meshPhysicalMaterial color={index === 1 ? '#82db52' : '#42caba'}
              roughness={.19} metalness={.26} clearcoat={1} />
          </mesh>
          <mesh position-z={.22}>
            <capsuleGeometry args={[.032, 2.92, 4, 8]} /><meshBasicMaterial color="#e3ffda" />
          </mesh>
        </group>)}
      <Halo radius={3.9} tube={.049} rotation={[.42, -.48, .24]} />
    </Float>
  </>
}

function Horizon() {
  return <group position={[8, -.25, -311]}>
    {Array.from({ length: 17 }, (_, index) => {
      const x = (index - 8) * 2.35 + Math.cos(index * 3) * .72
      const height = 2.2 + (1 + Math.sin(index * 12.3)) * 3.3 + (index === 10 ? 3.2 : 0)
      return <group key={index} position={[x, 0, Math.cos(index * 1.8) * 3.3]}>
        <mesh position-y={height / 2}>
          <cylinderGeometry args={[.37 + index % 3 * .17, .8 + index % 3 * .14, height, 4, 1]} />
          <Chrome color={index % 2 ? '#85c8d2' : '#daeee0'} metalness={.43} />
        </mesh>
        <mesh position-y={height + .48}>
          <cylinderGeometry args={[.045, .08, 1.05, 6]} /><meshBasicMaterial color="#fff2ba" />
        </mesh>
      </group>
    })}
  </group>
}

export function Landmarks({ still, low, projectIndex }: { still: boolean; low: boolean; projectIndex: number }) {
  const scenes = [
    <Core key="core" low={low} still={still} />,
    <group key="pavilion">
      <Platform radius={4.6} />
      <Float still={still} phase={1}>
        <Halo radius={3.26} tube={.13} rotation={[0, -.15, 0]} />
        <Halo radius={2.86} tube={.035} rotation={[.24, .64, .1]} color="#80ffd9" />
        <GlassShell radius={2.55} low={low} />
        <mesh rotation={[.35, .45, .24]}>
          <icosahedronGeometry args={[1.48, 1]} /><Chrome color="#5adebb" metalness={.56} />
        </mesh>
      </Float>
    </group>,
    <Skills key="skills" low={low} still={still} />,
    <Gallery key="gallery" low={low} still={still} projectIndex={projectIndex} />,
    <Conservatory key="conservatory" still={still} />,
    <group key="beacon">
      <Platform radius={3.8} />
      <Float still={still} phase={6}>
        <GlassShell radius={2.73} low={low} />
        <Halo radius={2.4} rotation={[.77, -.24, -.27]} color="#ffdba2" />
        <mesh rotation={[.42, .46, .58]}>
          <octahedronGeometry args={[1.42]} /><Chrome color="#ffe0a1" metalness={.45} />
        </mesh>
      </Float>
    </group>,
  ]
  return <>
    {stations.map(({ id, x, height, z, side }, index) => <group key={id}
      position={[x + side * (index === 0 ? 6.85 : index === 3 ? 6.15 : 7.2), height - (index === 0 ? .03 : .65), z - 16.8]}>
      {scenes[index]}
    </group>)}
    <Horizon />
  </>
}
