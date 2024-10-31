import * as utils from "../utils/viewHelper.js"

export function initUniforms(gl, program) {
    return {
        world: gl.getUniformLocation(program, "world"), 
        view: gl.getUniformLocation(program, "view"), 
        proj: gl.getUniformLocation(program, "proj")
    };
}

export function initMatricies(canvas, camera) {
    let matricies = {
        world: utils.createMat4(), 
        view: utils.createMat4(), 
        proj: utils.createMat4()
    };

    utils.identityMat4(matricies.world);
    utils.lookAt(matricies.view, {x: 0, y: 0, z: -8}, utils.globalOrigin, utils.globalUp);

    matricies.proj = utils.perspective(
        utils.toRadian(camera.fov), 
        canvas.clientWidth / canvas.clientHeight, 
        camera.near, camera.far
    );

    return matricies;
}