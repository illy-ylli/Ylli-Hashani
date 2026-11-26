export const glassVertex = /* glsl */ `
varying vec3 worldNormal;
varying vec3 worldPosition;
void main() {
  mat4 transform = modelMatrix;
  #ifdef USE_INSTANCING
    transform = modelMatrix * instanceMatrix;
  #endif
  worldNormal = normalize(mat3(transform) * normal);
  worldPosition = (transform * vec4(position,1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition,1.0);
}
`

export const glassFragment = /* glsl */ `
varying vec3 worldNormal;
varying vec3 worldPosition;
uniform float strength;
void main() {
  vec3 n = normalize(worldNormal);
  vec3 view = normalize(cameraPosition - worldPosition);
  float facing = max(dot(n,view),0.0);
  float rim = pow(1.0-facing,2.7);
  float broad = pow(max(0.0,dot(n,normalize(vec3(-.55,.8,.35)))),8.0);
  float softbox = pow(max(0.0,dot(n,normalize(vec3(-.43,.66,.69)))),48.0);
  float strip = pow(max(0.0,dot(n,normalize(vec3(.58,-.35,.73)))),26.0);
  vec3 film = mix(vec3(.09,.69,.95),vec3(.7,1.,.67),smoothstep(-.35,.48,n.y+n.x*.3));
  vec3 glass = mix(film,vec3(.98,1.,1.),max(softbox, broad*.43));
  glass = mix(glass,vec3(.9,1.,.91),strip*.86);
  float alpha = min(.93,(.045+rim*.76+broad*.23+softbox*.67+strip*.33)*strength);
  gl_FragColor = vec4(glass,alpha);
}
`
