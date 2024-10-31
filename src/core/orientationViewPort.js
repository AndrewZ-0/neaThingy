import * as utils from "../utils/viewHelper.js"
import {Sphere, Cylinder} from "./objects.js"
import {camera} from "./camera.js"

const axisViewportSize = 150;

let axisViewMatrix = utils.createMat4();
const axisProjMatrix = utils.ortho(-1.5, 1.5, -1.5, 1.5, -1.2, 1.2); 


export function initMiniAxis(gl) {
    const xAxisCylinder = new Cylinder(0.4, 0, 0, 0.04, 0.8, 4, [1, 0, 0], "horizontalX");
    const yAxisCylinder = new Cylinder(0, 0.4, 0, 0.04, 0.8, 4, [0, 1, 0], "horizontalY");
    const zAxisCylinder = new Cylinder(0, 0, 0.4, 0.04, 0.8, 4, [0, 0, 1], "horizontalZ");

    const axisBuffers = {
        x: createAxisBuffer(gl, xAxisCylinder),
        y: createAxisBuffer(gl, yAxisCylinder),
        z: createAxisBuffer(gl, zAxisCylinder),
    };

    const xAxisSphere = new Sphere(0.8, 0, 0, 0.2, 8, [1, 0, 0]);
    const yAxisSphere = new Sphere(0, 0.8, 0, 0.2, 8, [0, 1, 0]);
    const zAxisSphere = new Sphere(0, 0, 0.8, 0.2, 8, [0, 0, 1]);

    const sphereBuffers = {
        x: createSphereBuffer(gl, xAxisSphere),
        y: createSphereBuffer(gl, yAxisSphere),
        z: createSphereBuffer(gl, zAxisSphere),
    };

    return {axisBuffers, sphereBuffers};
}


function createAxisBuffer(gl, cylinder) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cylinder.getVertexData(), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cylinder.getIndexData(), gl.STATIC_DRAW);
    
    return {vertexBuffer, indexBuffer, indexCount: cylinder.indices.length};
}

function createSphereBuffer(gl, sphere) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.getVertexData(), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.getIndexData(), gl.STATIC_DRAW);
    
    return {vertexBuffer, indexBuffer, indexCount: sphere.indices.length};
}


export function drawMiniAxis(gl, canvas, projMatrix, buffers, attrLocs, locMats) {
    gl.viewport(gl.canvas.clientWidth - axisViewportSize, 0, axisViewportSize, axisViewportSize);

    camera.getOrientationViewMatrix(axisViewMatrix);

    gl.uniformMatrix4fv(locMats.view, false, axisViewMatrix);
    gl.uniformMatrix4fv(locMats.proj, false, axisProjMatrix);

    drawCylinder(gl, buffers.axisBuffers.x, attrLocs);
    drawCylinder(gl, buffers.axisBuffers.y, attrLocs);
    drawCylinder(gl, buffers.axisBuffers.z, attrLocs);

    drawSphere(gl, buffers.sphereBuffers.x, attrLocs);
    drawSphere(gl, buffers.sphereBuffers.y, attrLocs);
    drawSphere(gl, buffers.sphereBuffers.z, attrLocs);


    //restore matrix, uniform matrix and viewport
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.uniformMatrix4fv(locMats.proj, false, projMatrix);
}


function bindStandardBuffers(gl, attrLocs) {
    gl.vertexAttribPointer(attrLocs.positionAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(attrLocs.colorAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(attrLocs.positionAttrLoc);
    gl.enableVertexAttribArray(attrLocs.colorAttrLoc);
}

function drawCylinder(gl, axisBuffer, attrLocs) {
    gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer.vertexBuffer);
    bindStandardBuffers(gl, attrLocs);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axisBuffer.indexBuffer);
    gl.drawElements(gl.TRIANGLES, axisBuffer.indexCount, gl.UNSIGNED_SHORT, 0);
}

function drawSphere(gl, sphereBuffer, attrLocs) {
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer.vertexBuffer);
    bindStandardBuffers(gl, attrLocs);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffer.indexBuffer);
    gl.drawElements(gl.TRIANGLES, sphereBuffer.indexCount, gl.UNSIGNED_SHORT, 0);
}


