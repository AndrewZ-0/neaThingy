import {clock} from "./core/clock.js";
import {masterRenderer, orientationRenderer, axisRenderer} from "./core/renderer.js";
import {camera} from "./core/camera.js";
import {updateCameraModeOverlay, updateCameraPerspectiveOverlays, updateFpsOverlay} from "./core/overlays.js";
import {bindVisabilityChange, bindAllControls} from "./core/listeners.js";
import {orientationMenu} from "./core/orientationViewPort.js";
import {axisViewport} from "./core/axisViewPort.js";

export class GraphicsEngine {
    constructor(objects) {
        this.canvas = document.getElementById("model-surface");
        this.currentAnimationFrame;
        this.loop;

        //get elements from HTML
        this.gl = this.canvas.getContext("webgl2", {antialias: true});

        //initialize WebGL
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        //compile shaders, buffers and render transform matricies
        masterRenderer.initialise(this.gl, this.canvas, camera, objects);

        updateCameraModeOverlay();
        updateCameraPerspectiveOverlays();
        camera.updateAllOverlays();

        masterRenderer.setAllUniformMatrixies();

        //listener bindings
        bindAllControls(this.canvas);
        bindVisabilityChange(this.onVisibilityChange);

        //shut up, it's for the mobile version. I would never
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    mainloop = () => {
        camera.updateCamera(masterRenderer.matricies.view);
        masterRenderer.render();

        axisViewport.updateView();
        axisRenderer.render();

        orientationMenu.updateView();
        orientationRenderer.render();

        clock.updateDeltaT();
        updateFpsOverlay();

        this.currentAnimationFrame = requestAnimationFrame(this.mainloop);
    };

    start = () => {
        //condition here as a quick fix for initial hidden document "inifinity fps issue"
        if (!document.hidden) {
            camera.forceUpdateCamera(masterRenderer.matricies.view);
            camera.forceUpdateCamera(axisRenderer.matricies.view);
            //camera.forceUpdateCamera(orientationRenderer.matricies.view);
            requestAnimationFrame(this.mainloop);
        }
    }

    onVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(this.currentAnimationFrame);
        } 
        else {
            clock.last_t = window.performance.now();
            camera.forceUpdateCamera(masterRenderer.matricies.view);
            //camera.forceUpdateCamera(orientationRenderer.matricies.view);
            this.currentAnimationFrame = requestAnimationFrame(this.mainloop);
        }
    }

    resizeCanvas() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;

            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

            masterRenderer.setMatricies();
            masterRenderer.setProjUniformMatrix4fv();

            masterRenderer.updateFlag = true;
        }
    }
}

