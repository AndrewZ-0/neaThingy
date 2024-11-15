import {axisRenderer, masterRenderer} from "./renderer.js";
import {SkeletonShader} from "./shaders.js";
import {Line} from "../objects/objects.js";
import {camera} from "./camera.js";
import {selectionMovementAxis} from "./listeners.js";


const globalAxis = [
    new Line("Xavier", 0, 0, 0, [1, 0, 0], [1.0, 0.0, 0.0]), //red
    new Line("Yves", 0, 0, 0, [0, 1, 0], [0.0, 1.0, 0.0]), //green
    new Line("Zachery", 0, 0, 0, [0, 0, 1], [0.0, 0.0, 1.0]),  //blue
];

const objectAxis = {
    x: new Line("Xavier2", 0, 0, 0, [1, 0, 0], [1.0, 0.0, 0.0]), 
    y: new Line("Yves2", 0, 0, 0, [0, 1, 0], [0.0, 1.0, 0.0]), 
    z: new Line("Zachery2", 0, 0, 0, [0, 0, 1], [0.0, 0.0, 1.0]), 
}

class AxisViewport {
    constructor() {
        this.canvas = document.getElementById("axisViewport-surface");
        
        //get elements from HTML
        this.gl = this.canvas.getContext("webgl2", {antialias: true});

        //initialize WebGL
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CW);
        this.gl.cullFace(this.gl.BACK);

        axisRenderer.initialise(this.gl, this.canvas, camera, new SkeletonShader(this.gl), globalAxis);

        axisRenderer.setAllUniformMatrixies();

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    updateView() {
        if (selectionMovementAxis !== null) {
            console.log("render the local axis that matches the selection movement axis var!");
        }
        camera.getViewMatrix(axisRenderer.matricies.view);
    }

    resizeCanvas() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;

            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

            axisRenderer.setMatricies();
            axisRenderer.setProjUniformMatrix4fv();

            axisRenderer.updateFlag = true;
        }
    }
}

export const axisViewport = new AxisViewport();
