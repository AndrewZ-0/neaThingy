import {axisRenderer} from "./renderer.js";
import {SkeletonShader} from "./shaders.js";
import {Line, Sphere} from "../objects/objects.js";
import {camera} from "./camera.js";


const objects = [
    new Line("Xavier", 0, 0, 0, [1, 0, 0], [1.0, 0.0, 0.0]), //red
    new Line("Yves", 0, 0, 0, [0, 1, 0], [0.0, 1.0, 0.0]), //green
    new Line("Zachery", 0, 0, 0, [0, 0, 1], [0.0, 0.0, 1.0]),  //blue
];

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

        axisRenderer.initialise(this.gl, this.canvas, camera, new SkeletonShader(this.gl), objects);

        axisRenderer.setAllUniformMatrixies();

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    updateView() {
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
