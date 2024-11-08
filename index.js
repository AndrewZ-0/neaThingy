import {GraphicsEngine} from "./src/app.js";
import {Cube, Cylinder, Sphere, Torus} from "./src/objects/objects.js";


const objects = [
    new Sphere("Sam the Sphere", 0, 0, 0, 1, 100, [0, 0, 1]), 
    new Sphere("Sunny the Sphere", 3, 0, 0, 0.5, 50, [0, 0, 1]), 
    new Sphere("Sofia the Sphere", 2, 2, 2, 1, 50, [0, 0, 1]), 
    new Sphere("Sasha the Sphere", -2, 2, -2, 1.3, 50, [0, 1, 0]), 
    new Sphere("Simon the Sphere", -2, -2, -2, 0.8, 50, [1, 1, 0]), 
    //new Cylinder(1, 2, 0, 0.4, 0.8, 10, [1, 1, 1], "horizontalY"), 
    //new Cylinder(-2, -1, 0, 0.5, 2, 50, [0, 0.7, 1], "horizontalZ"), 
    new Cube("Charlie the Cube", 3, -2, 1, 0, 0, 0), 
    new Cube("Christopher the Cube", -2.5, 2, 1, 0, Math.PI / 6, Math.PI / 2), 
    new Torus("Tom the Torus", 0, -2, 0, 0, 0, 0, 1, 0.5, 32, 16, [1.0, 0.5, 0.3]), 
    new Torus("Timmy the torus", 1, -2, -4, 0, Math.PI / 4, Math.PI / 4, 1.5, 0.4, 32, 16, [0, 0.6, 0.9]), 
];


/*
const objects = [
    //new Sphere(-0.8, 0, 0, 0.2, 8, [1, 0, 0]), 
    //new Sphere(0, 2, 0, 1, 9, [0, 0, 1]),
    new Cylinder(1, 0, 0, 0.4, 0.8, 50, [1, 1, 1], "horizontalY")
];*/




const ge = new GraphicsEngine(objects);
ge.start();





