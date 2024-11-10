import * as utils from "../utils/viewHelper.js";
import {Sphere, Cylinder} from "../objects/objects.js";
import {camera} from "./camera.js";
import {orientationRenderer} from "./renderer.js";
import {BasicShader} from "./shaders.js";

const axisViewportSize = 130;

const objects = [
    new Cylinder("Xander", 0.4, 0, 0, 0, utils.halfPi, 0, 0.04, 0.8, 5, [1, 0, 0]), 
    new Cylinder("Yang", 0, 0.4, 0, utils.halfPi, 0, 0, 0.04, 0.8, 5, [0, 1, 0]), 
    new Cylinder("Zoey", 0, 0, 0.4, 0, 0, utils.halfPi, 0.04, 0.8, 5, [0, 0, 1]), 
    new Sphere("Andy", 0.8, 0, 0, 0.2, 8, [1, 0, 0]), 
    new Sphere("Ben", 0, 0.8, 0, 0.2, 8, [0, 1, 0]), 
    new Sphere("Camilla", 0, 0, 0.8, 0.2, 8, [0, 0, 1])
];

class OrientationMenu {
    constructor() {
        this.canvas = document.getElementById("orientationViewport-surface");
        this.canvas.width = axisViewportSize;
        this.canvas.height = axisViewportSize;
        
        //get elements from HTML
        this.gl = this.canvas.getContext("webgl2", {antialias: true});

        //initialize WebGL
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CW);
        this.gl.cullFace(this.gl.BACK);

        orientationRenderer.initialise(this.gl, this.canvas, camera, new BasicShader(this.gl), objects);

        
        //override the default camera projection matrix with an orthogonal system 
        //  -->  (I'll fix this later so that it can be set init)
        orientationRenderer.matricies.proj = utils.ortho(-1.2, 1.2, -1.2, 1.2, -1.2, 1.2); 


        orientationRenderer.setAllUniformMatrixies();
    }

    updateView() {
        camera.getOrientationViewMatrix(orientationRenderer.matricies.view);
    }
}

export const orientationMenu = new OrientationMenu();
