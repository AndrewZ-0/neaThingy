import {shaderDrawElements} from "./shaders.js"
import * as utils from "../utils/viewHelper.js"
import {drawMiniAxis} from "./orientationViewPort.js"

export function initGl(canvas) {
    //get elements from HTML
	const gl = canvas.getContext("webgl2", {antialias: true});

    //initialize WebGL
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    return gl
}

export function render(gl, canvas, objects, buffers, positionAttrLoc, colorAttrLoc, matUniformLocs, matricies, miniAxisData) {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    //render each shape
    for (let i = 0; i < objects.length; i++) {
        const {vertexBufferObject, indexBufferObject, indexCount} = buffers[i];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);


        gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(colorAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

        gl.enableVertexAttribArray(positionAttrLoc);
        gl.enableVertexAttribArray(colorAttrLoc);


        utils.translate(matricies.world, objects[i]);
        
        shaderDrawElements(gl, indexCount);
    }

    drawMiniAxis(gl, canvas, matricies.proj, miniAxisData, {positionAttrLoc, colorAttrLoc}, matUniformLocs);
}