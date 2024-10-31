import {initGl, render} from "./core/renderer.js"
import {updateDeltaT} from "./core/clock.js"
import {initBuffers, setAttrPointers} from "./core/buffers.js"
import {initUniforms, initMatricies} from "./core/renderTransforms.js";
import {createAllShaders} from "./core/shaders.js"
import {camera} from "./core/camera.js"
import {
    updateShaderOverlays, updateCameraModeOverlay, 
    updateCameraPerspectiveOverlays, updateFpsOverlay
} from "./core/overlays.js"
import {bindVisabilityChange, bindAll} from "./core/listeners.js"
import {initMiniAxis} from "./core/orientationViewPort.js"


export class GraphicsEngine {
    constructor(objects) {
        this.canvas = document.getElementById("model-surface");
        this.currentAnimationFrame;
        this.loop;

        this.gl = initGl(this.canvas);

        //compile shaders
        this.program = createAllShaders(this.gl);


        //----------------------------------------------------------------------------------------------------
        //temp: objects logic here is just for testing. will be improved later
        this.objects = objects;
        //----------------------------------------------------------------------------------------------------


        this.buffers = initBuffers(this.gl, this.objects);

        //get init attr locs
        this.positionAttrLoc = this.gl.getAttribLocation(this.program, "vertPosition");
        this.colourAttrLoc = this.gl.getAttribLocation(this.program, "vertColour");

        setAttrPointers(this.gl, this.buffers, this.positionAttrLoc, this.colourAttrLoc);

        //use shader program
        this.gl.useProgram(this.program);

        this.matUniformLocs = initUniforms(this.gl, this.program);
        this.matricies = initMatricies(this.canvas, camera);

        updateShaderOverlays();
        updateCameraModeOverlay();
        updateCameraPerspectiveOverlays();
        camera.updateAllOverlays();
        //updateCameraEulerAnglesOverlays();

        this.gl.uniformMatrix4fv(this.matUniformLocs.world, false, this.matricies.world);
        this.gl.uniformMatrix4fv(this.matUniformLocs.view, false, this.matricies.view);
        this.gl.uniformMatrix4fv(this.matUniformLocs.proj, false, this.matricies.proj);

        this.miniAxisData = initMiniAxis(this.gl);

        bindAll(this.canvas);
        bindVisabilityChange(this.onVisibilityChange);


        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    mainloop = () => {
        camera.updateCamera(this.matricies.view);
        this.gl.uniformMatrix4fv(this.matUniformLocs.view, false, this.matricies.view);

        render(
            this.gl, this.canvas, this.objects, this.buffers, 
            this.positionAttrLoc, this.colourAttrLoc, 
            this.matUniformLocs, this.matricies, 
            this.miniAxisData
        );

        updateDeltaT();
        updateFpsOverlay();

        this.currentAnimationFrame = requestAnimationFrame(this.mainloop);
    };

    start = () => {
        requestAnimationFrame(this.mainloop);
    }

    onVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(this.currentAnimationFrame);
        } 
        else {
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

            this.matricies = initMatricies(this.canvas, camera);
            this.gl.uniformMatrix4fv(this.matUniformLocs.proj, false, this.matricies.proj);
        }
    }

}

