import {GraphicsEngine} from "./src/app.js"
import {Cube, Sphere, Torus} from "./src/core/objects.js"


const objects = [
    new Cube(0, 0, 0), 
    new Sphere(0, 2, 0, 1, 250, [0, 0, 1]), 
    new Torus(0, -2, 0, 1, 0.5, 32, 16)
];


const ge = new GraphicsEngine(objects);

document.addEventListener("DOMContentLoaded", ge.start);


