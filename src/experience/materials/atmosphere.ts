export const atmosphereVertex = /* glsl */ `
varying vec3 world;
void main() {
  world = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const atmosphereFragment = /* glsl */ `
varying vec3 world;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
    mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
void main() {
  vec3 ray = normalize(world - cameraPosition);
  float elevation = max(0.0, ray.y);
  float sunset = smoothstep(178.0, 270.0, -cameraPosition.z);
  vec3 horizon = mix(vec3(.79,.96,1.), vec3(1.,.73,.48), sunset * .82);
  vec3 zenith = mix(vec3(.028,.49,.89), vec3(.23,.51,.83), sunset);
  vec3 sky = mix(horizon, zenith, smoothstep(-.025,.64,elevation));
  vec2 p = ray.xz / (.16 + elevation) * vec2(2.6, 3.5) + vec2(4.6,2.5);
  float cloudField = .56*noise(p) + .27*noise(p*2.03) + .12*noise(p*4.07) + .05*noise(p*8.2);
  float cloud = smoothstep(.51,.68,cloudField) * smoothstep(.015,.12,elevation);
  vec3 cloudColor = mix(vec3(.77,.9,.97),vec3(1.,1.,.99),smoothstep(.52,.75,cloudField));
  sky = mix(sky, cloudColor, cloud * .97);
  vec3 sunDirection = normalize(mix(vec3(-.55,.4,-.9),vec3(.42,.075,-1.),sunset));
  float sun = max(dot(ray,sunDirection),0.0);
  sky += vec3(.24,.18,.075) * pow(sun,20.);
  sky = mix(sky,vec3(1.,.99,.89),smoothstep(.9995,.99986,sun));
  gl_FragColor = vec4(sky,1.0);
}
`
