export function initBuffers(gl, objects) {
    let buffers = new Array(objects.length);
    for (let i = 0; i < objects.length; i++) {
        //create vertex buffer
        let vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].vertices), gl.STATIC_DRAW);

        //create index buffer
        let indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objects[i].indices), gl.STATIC_DRAW);

        buffers[i] = {
            vertexBufferObject,
            indexBufferObject,
            indexCount: objects[i].indices.length
        };
    }

    return buffers;
}

//set attr pointers:
//attr loc, no of elements per attr
//type of elements
//size of individual vertex
//offset from beginning of single vertex to this attr
export function setAttrPointers(gl, buffers, positionAttrLoc, colorAttrLoc) {
    for (let i = 0; i < buffers.length; i++) {
        const {vertexBufferObject} = buffers[i];
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(colorAttrLoc, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

        gl.enableVertexAttribArray(positionAttrLoc);
        gl.enableVertexAttribArray(colorAttrLoc);
    }
}
