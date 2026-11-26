import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Group, PlaneGeometry, type ShaderMaterial } from 'three'
import { Reflector } from 'three/addons/objects/Reflector.js'

const waterShader = {
  uniforms: {
    color: { value: new Color() },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    time: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 reflectedUv;
    varying vec3 world;
    void main() {
      reflectedUv = textureMatrix * vec4(position, 1.0);
      world = (modelMatrix * vec4(position,1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec4 reflectedUv;
    varying vec3 world;
    void main() {
      vec2 p = world.xz;
      vec3 view = normalize(cameraPosition - world);
      float k = sin(p.y*2.0 + p.x*.48 + time*.85 + sin(p.x*.66)) *
        cos(p.x*.83 - p.y*.36 + time*.36);
      float fine = sin(p.y*5.3 - p.x*1.1 + time*1.1 + sin(p.x*1.83)) *
        cos(p.y*2.74 + p.x*1.85 - time*1.3);
      vec2 distortion = vec2(k+fine*.3, fine*.35-k*.72)*.0045;
      vec3 reflection = texture2D(tDiffuse, reflectedUv.xy / reflectedUv.w + distortion).rgb;
      float fresnel = pow(1.0-max(view.y,0.0),4.0);
      float clarity = smoothstep(5.,64.,length(cameraPosition-world));
      vec3 lagoon = mix(vec3(.023,.44,.53),vec3(.13,.68,.72),clarity);
      vec3 color = mix(lagoon, reflection, .21+fresnel*.69);
      float glint = pow(max(0.,k*.64+fine*.36),5.) * .11;
      color += vec3(.66,.94,.9)*glint*(1.-clarity*.75);
      gl_FragColor = vec4(color,1.0);
    }
  `,
}

export function Lake({ low, still }: { low: boolean; still: boolean }) {
  const group = useRef<Group>(null)
  const lake = useRef<Reflector>(null)
  useEffect(() => {
    const geometry = new PlaneGeometry(232, 435)
    const reflection = new Reflector(geometry, {
      textureWidth: low ? 224 : 512,
      textureHeight: low ? 128 : 288,
      multisample: 0,
      clipBias: .003,
      shader: waterShader,
    })
    reflection.rotation.x = -Math.PI / 2
    reflection.position.z = -150
    const holder = group.current
    holder?.add(reflection)
    lake.current = reflection
    return () => {
      holder?.remove(reflection)
      lake.current = null
      reflection.dispose()
      geometry.dispose()
    }
  }, [low])
  useFrame(({ clock }) => {
    if (lake.current && !still) (lake.current.material as ShaderMaterial).uniforms.time.value = clock.elapsedTime
  })
  return <group ref={group} />
}
