#version 300 es
precision mediump float;

in vec3 vertPos; 
in vec3 vertNormal;
in vec3 vertColour;

flat out vec3 fragColour;
out vec3 fragLighting;

uniform mat4 world;
uniform mat4 view;
uniform mat4 proj;

uniform vec3 lightPos;
uniform vec3 lightColour;
uniform vec3 lightAmbient;
uniform float lightStrength;


//this is still a bit broken but it kinda works
void main() {
    //ideally should be a seperate uniform since it is the same for all shader calls, but i'm lazy so your GPU could crash and burn for all I care
    mat3 normalMatrix = transpose(inverse(mat3(world)));

    //calculate the world position of the vertex
    vec4 worldPos = world * vec4(vertPos, 1.0);

    fragColour = vertColour;

    //not sure why this works but I just kinda trialed and errored my way to this algorithm which works so I'm sticking with it
    vec3 normalDir = normalize(normalMatrix * vertNormal);
    vec3 lightRay = lightPos - vec3(worldPos); //from vertex to light
    vec3 lightDir = normalize(lightRay); 

    //fast inverse square law calc  :)
    float invDist = inversesqrt(dot(lightRay, lightRay));
    float intensity = lightStrength * (invDist * invDist); 

    float diffuse = max(dot(normalDir, lightDir), 0.0);
    fragLighting = (lightAmbient + lightColour * diffuse) * intensity;

    //calculate the final vertex position in clip space
    gl_Position = proj * view * worldPos;
}

