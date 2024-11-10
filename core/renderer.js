import {updateShaderOverlays} from "./overlays.js";
import {initBuffers} from "./buffers.js"; //, setAttrPointers, setLightingAttrPointers
import {initUniforms, initLightingUniforms, initMatricies} from "./renderTransforms.js";
import {BasicShader, SkeletonShader, PointsShader, LightingShader} from "./shaders.js";
import * as utils from "../utils/viewHelper.js";

class Renderer {
    constructor() {
        this.standardUniformLocs = null;
        this.lightingUniforms = null;
        this.matricies = null;

        this.gl;
        this.canvas;
        this.camera;
        this.objects;
        this.shader;
        this.program;
    }

    initialise(gl, canvas, camera, objects) {
        this.gl = gl;
        this.canvas = canvas;
        this.camera = camera;
        this.objects = objects;

        this.program = this.gl.createProgram();
    }

    initialiseShaderEnvironment() {
        this.attachShader();

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].generate(this.shader.normalsFlag);
            if (! this.objects[i].selected) {
                this.objects[i].setMode(this.shader.preferredMode);
            }
        }

        this.buffers = initBuffers(this.gl, this.objects);
        //this.configureBuffer();

        //use shader program
        this.gl.useProgram(this.program);
        this.setUniforms();

        this.setMatricies();
    }

    /*
    configureBuffer() {
        setAttrPointers(this.gl, this.buffers, this.positionAttrLoc, this.colourAttrLoc);
    }*/

    setWorldUniformMatrix4fv() {
        this.gl.uniformMatrix4fv(this.standardUniformLocs.world, false, this.matricies.world);
    }
    setViewUniformMatrix4fv() {
        this.gl.uniformMatrix4fv(this.standardUniformLocs.view, false, this.matricies.view);
    }
    setProjUniformMatrix4fv() {
        this.gl.uniformMatrix4fv(this.standardUniformLocs.proj, false, this.matricies.proj);
    }

    setAllUniformMatrixies() {
        this.setWorldUniformMatrix4fv();
        this.setViewUniformMatrix4fv();
        this.setProjUniformMatrix4fv();
    }

    setMatricies() {
        this.matricies = initMatricies(this.canvas, this.camera);
    }

    setUniforms() {
        this.standardUniformLocs = initUniforms(this.gl, this.program);
    }

    attachShader() {
        this.gl.attachShader(this.program, this.shader.vertexShader);
        this.gl.attachShader(this.program, this.shader.fragmentShader);
        this.gl.linkProgram(this.program);

        this.program.vShader = this.shader.vertexShader;
        this.program.fShader = this.shader.fragmentShader;

        //get init attr locs
        this.positionAttrLoc = this.gl.getAttribLocation(this.program, "vertPos");
        this.colourAttrLoc = this.gl.getAttribLocation(this.program, "vertColour");
    }

    shaderDrawElements(indicesLength, mode) {
        //this.setAllUniformMatrixies();
        this.setWorldUniformMatrix4fv();
        this.setViewUniformMatrix4fv();
        this.shader.shaderDrawElements(indicesLength, mode);
    }

    handleAttribsAndObjUniforms(object) {
        const attrLen = 6 * Float32Array.BYTES_PER_ELEMENT;

        this.gl.vertexAttribPointer(this.positionAttrLoc, 3, this.gl.FLOAT, false, attrLen, 0);
        this.gl.vertexAttribPointer(this.colourAttrLoc, 3, this.gl.FLOAT, false, attrLen, 3 * Float32Array.BYTES_PER_ELEMENT);

        this.gl.enableVertexAttribArray(this.positionAttrLoc);
        this.gl.enableVertexAttribArray(this.colourAttrLoc);
    }

    render() {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    
        //render each shape
        for (let i = 0; i < this.objects.length; i++) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[i].vertexBufferObject);

            this.handleAttribsAndObjUniforms(this.objects[i]);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[i].indexBufferObject);
    
            utils.translate(this.matricies.world, this.objects[i]);
            utils.setMat4rotation(this.matricies.world, this.objects[i]);
            this.shaderDrawElements(this.buffers[i].indexCount, this.objects[i].mode);
            utils.identityMat4(this.matricies.world);
        }
    }
}


class AdvancedRenderer extends Renderer {
    constructor() {
        super();

        this.currentSelection = null;
    }

    initialise(gl, canvas, camera, objects, type = "basic") {
        super.initialise(gl, canvas, camera, objects);

        switch (type) {
            case "basic":
                this.shader = new BasicShader(this.gl);
                break;
            case "skeleton":
                this.shader = new SkeletonShader(this.gl);
                break;
            case "points":
                this.shader = new PointsShader(this.gl);
                break;
            case "lighting":
                this.shader = new LightingShader(this.gl);
                break;
        }

        this.initialiseShaderEnvironment();

        updateShaderOverlays();
    }

    attachShader() {
        super.attachShader();

        if (this.shader.normalsFlag) {
            this.normalAttrLoc = this.gl.getAttribLocation(this.program, "vertNormal");
        }
        else {
            this.normalAttrLoc = null; //reset
        }
    }

    nukeShader() {
        this.gl.detachShader(this.program, this.shader.vertexShader);
        this.gl.deleteShader(this.shader.vertexShader);
        this.gl.detachShader(this.program, this.shader.fragmentShader);
        this.gl.deleteShader(this.shader.fragmentShader);

        this.program.vShader = null;
        this.program.fShader = null;
    }

    /*
    configureBuffer() {
        if (this.shader.normalsFlag) {
            setLightingAttrPointers(this.gl, this.buffers, this.positionAttrLoc, this.normalAttrLoc, this.colourAttrLoc);
        }
        else {
            setAttrPointers(this.gl, this.buffers, this.positionAttrLoc, this.colourAttrLoc);
        }
    }*/

    setUniforms() {
        this.standardUniformLocs = initUniforms(this.gl, this.program);

        if (this.shader.normalsFlag) {
            this.lightingUniforms = initLightingUniforms(this.gl, this.program);
        }
    }

    setViewPositionUniform(viewPos) {
        if (this.shader.normalsFlag) {
            this.gl.uniform3fv(this.lightingUniforms.viewPos, viewPos);
        }
    }

    
    setShininessUniform(shininess) {
        this.gl.uniform1f(this.lightingUniforms.shininess, shininess);
    }

    setColourOverrideUniform(state) {
        this.gl.uniform1i(this.standardUniformLocs.colourOverride, state);
    }

    toggleShaderMode() {
        this.nukeShader();
        if (this.shader instanceof BasicShader) {
            this.shader = new SkeletonShader(this.gl);
        }
        else if(this.shader instanceof SkeletonShader) {
            this.shader = new PointsShader(this.gl);
        }
        else if(this.shader instanceof PointsShader) {
            this.shader = new LightingShader(this.gl);
        }
        else if(this.shader instanceof LightingShader) {
            this.shader = new BasicShader(this.gl);
        }

        this.initialiseShaderEnvironment();

        updateShaderOverlays();

        this.setAllUniformMatrixies();
    }

    handleAttribsAndObjUniforms(object) {
        if (this.shader.normalsFlag) {
            const attrLen = 9 * Float32Array.BYTES_PER_ELEMENT;

            this.gl.vertexAttribPointer(this.positionAttrLoc, 3, this.gl.FLOAT, false, attrLen, 0);
            this.gl.vertexAttribPointer(this.normalAttrLoc, 3, this.gl.FLOAT, false, attrLen, 3 * Float32Array.BYTES_PER_ELEMENT);
            this.gl.vertexAttribPointer(this.colourAttrLoc, 3, this.gl.FLOAT, false, attrLen, 6 * Float32Array.BYTES_PER_ELEMENT);
            
            this.gl.enableVertexAttribArray(this.positionAttrLoc);
            this.gl.enableVertexAttribArray(this.normalAttrLoc);
            this.gl.enableVertexAttribArray(this.colourAttrLoc);

            this.setShininessUniform(object.shininess);
        }
        else {
            const attrLen = 6 * Float32Array.BYTES_PER_ELEMENT;

            this.gl.vertexAttribPointer(this.positionAttrLoc, 3, this.gl.FLOAT, false, attrLen, 0);
            this.gl.vertexAttribPointer(this.colourAttrLoc, 3, this.gl.FLOAT, false, attrLen, 3 * Float32Array.BYTES_PER_ELEMENT);

            this.gl.enableVertexAttribArray(this.positionAttrLoc);
            this.gl.enableVertexAttribArray(this.colourAttrLoc);
        }
    
    }


    deselectObject(i) {
        this.objects[i].selected = false;
        this.objects[i].setMode(this.shader.preferredMode);
    }

    selectObject(i) {
        this.objects[i].selected = true;
        this.objects[i].setMode(this.gl.LINES);
    }

    handleSelection(i) {
        if (i === null) {
            if (this.currentSelection !== null) {
                this.deselectObject(this.currentSelection);
                this.currentSelection = null;
            }
            else {
                return null; //if nothing had been selected and nothing is selected, then nothing needs to be updated
            }
        }
        else {
            if (this.objects[i].selected) {
                this.deselectObject(i);
                this.currentSelection = null;
            }
            else {
                if (this.currentSelection !== null && this.currentSelection !== i) {
                    this.deselectObject(this.currentSelection);
                }
                this.selectObject(i);
                this.currentSelection = i;
            }
        } 

        this.buffers = initBuffers(this.gl, this.objects);
        //this.configureBuffer();
    }

    render() {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    
        //render each shape
        for (let i = 0; i < this.objects.length; i++) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[i].vertexBufferObject);

            this.handleAttribsAndObjUniforms(this.objects[i]);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[i].indexBufferObject);
    
            utils.translate(this.matricies.world, this.objects[i]);
            utils.setMat4rotation(this.matricies.world, this.objects[i]);
            if (! this.objects[i].selected) {
                this.shaderDrawElements(this.buffers[i].indexCount, this.objects[i].mode);
            }
            utils.identityMat4(this.matricies.world);
        }

        //----------------------------------------------------------------------------------------------------

        if (this.currentSelection !== null) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[this.currentSelection].vertexBufferObject);

            this.handleAttribsAndObjUniforms(this.objects[this.currentSelection]);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[this.currentSelection].indexBufferObject);

            utils.translate(this.matricies.world, this.objects[this.currentSelection]);
            utils.setMat4rotation(this.matricies.world, this.objects[this.currentSelection]);
            

            this.gl.disable(this.gl.DEPTH_TEST);
            this.setColourOverrideUniform(1);
            this.gl.depthMask(false);

            this.shaderDrawElements(this.buffers[this.currentSelection].indexCount, this.gl.TRIANGLES);

            this.gl.depthMask(true);

            this.shaderDrawElements(this.buffers[this.currentSelection].indexCount, this.gl.LINES);

            this.setColourOverrideUniform(0);
            this.gl.enable(this.gl.DEPTH_TEST);
            utils.identityMat4(this.matricies.world);
        }
        //----------------------------------------------------------------------------------------------------
    }
}


class BasicRenderer extends Renderer {
    constructor() {
        super();
    }

    initialise(gl, canvas, camera, objects) {
        super.initialise(gl, canvas, camera, objects);

        this.shader = new BasicShader(this.gl);

        this.initialiseShaderEnvironment();
    }
}

export const masterRenderer = new AdvancedRenderer();
export const axisRenderer = new BasicRenderer();