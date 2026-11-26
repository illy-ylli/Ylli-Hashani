import { CatmullRomCurve3, Vector3 } from 'three'

import { stations } from '../../config/chapters'

export const cameraPath = new CatmullRomCurve3(
  stations.map(({ x, height, z }) => new Vector3(x, height, z)),
)
export const sightPath = new CatmullRomCurve3(
  stations.map(({ x, height, z }) => new Vector3(x + 0.5, height - 0.25, z - 22)),
)

export function sampleJourney(progress: number, camera: Vector3, target: Vector3) {
  cameraPath.getPoint(progress, camera)
  sightPath.getPoint(progress, target)
}
