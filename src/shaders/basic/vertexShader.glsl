#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 vertColour;
out vec3 fragColour;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

void main() {
    fragColour = vertColour;
    gl_Position = proj * view * world * vec4(vertPosition, 1.0);
}


