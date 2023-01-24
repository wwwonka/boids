// Fragment Shader
precision highp float;

// Varying
varying vec3 vPosition;

uniform float time;

// Main
void main(void) {
    gl_FragColor = vec4(vPosition, 1.0);
    // gl_FragColor = vec4(sin(time), 0.0, 0.0, 1.0);
    // gl_FragColor = vec4(time, normalize(time), normalize(time), 1.0);
}
