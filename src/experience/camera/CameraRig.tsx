import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { sampleJourney } from './journey'
import { stations } from '../../config/chapters'

export type JourneyInput = {
  current: { progress: number; pointerX: number; pointerY: number }
}

export function CameraRig({ input, still, onReady }: {
  input: JourneyInput; still: boolean; onReady: () => void
}) {
  const rig = useRef({
    progress: still ? 0 : input.current.progress,
    position: new Vector3(),
    target: new Vector3(),
    pointer: new Vector3(),
    ready: false,
  })
  useFrame(({ camera, size, gl }, delta) => {
    const state = rig.current
    const { progress, pointerX, pointerY } = input.current
    state.progress = still ? 0 : MathUtils.damp(state.progress, progress, 7, delta)
    sampleJourney(state.progress, state.position, state.target)
    if (!still) {
      state.pointer.x = MathUtils.damp(state.pointer.x, pointerX * .46, 4, delta)
      state.pointer.y = MathUtils.damp(state.pointer.y, pointerY * .28, 4, delta)
      state.position.add(state.pointer)
    }
    const aspect = size.width / Math.max(size.height, 1)
    const perspective = camera as PerspectiveCamera
    const fov = 45 + 9 * MathUtils.smoothstep(1.22 - aspect, .1, .75)
    if (perspective.fov !== fov) {
      perspective.fov = fov
      perspective.updateProjectionMatrix()
    }
    if (aspect < 1.24) {
      const index = state.progress * (stations.length - 1)
      const left = Math.floor(index)
      const right = Math.min(left + 1, stations.length - 1)
      const side = MathUtils.lerp(stations[left].side, stations[right].side, index - left)
      const mobile = MathUtils.smoothstep(1.24 - aspect, 0, .73)
      state.target.x += side * 9.28 * mobile
      state.target.y -= 3.4 * mobile
    }
    camera.position.copy(state.position)
    camera.lookAt(state.target)
    if (import.meta.env.DEV) gl.domElement.dataset.cameraZ = camera.position.z.toFixed(2)
    if (!state.ready) {
      state.ready = true
      onReady()
    }
  })
  return null
}
