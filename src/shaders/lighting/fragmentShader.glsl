#version 300 es
precision mediump float;

flat in vec3 fragColour;
in vec3 fragLighting;

out vec4 fragColourOut;

void main() {
    fragColourOut = vec4(fragColour * fragLighting, 1.0);
}
