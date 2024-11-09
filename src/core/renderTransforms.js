import * as utils from "../utils/viewHelper.js";


export function initUniforms(gl, program) {
    const colourOverrideUniform = gl.getUniformLocation(program, "colourOverride");

    gl.uniform1i(colourOverrideUniform, false);

    return {
        world: gl.getUniformLocation(program, "world"), 
        view: gl.getUniformLocation(program, "view"), 
        proj: gl.getUniformLocation(program, "proj"), 
        colourOverride: colourOverrideUniform, 
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


const lightPosition = [0, 10, 0]; 
const lightColour = [1, 1, 1];
const lightAmbient = [0.1, 0.1, 0.1];
const lightStrength = 200;

export function initLightingUniforms(gl, program) {
    const lightPositionUniformLoc = gl.getUniformLocation(program, "lightPos");
    const lightColourUniformLoc = gl.getUniformLocation(program, "lightColour");
    const lightAmbientUniformLoc = gl.getUniformLocation(program, "lightAmbient");
    const lightStrengthUniformLoc = gl.getUniformLocation(program, "lightStrength");
    const shininessUniformLoc = gl.getUniformLocation(program, "shininess");

    gl.uniform3fv(lightPositionUniformLoc, lightPosition);
    gl.uniform3fv(lightColourUniformLoc, lightColour);
    gl.uniform3fv(lightAmbientUniformLoc, lightAmbient);
    gl.uniform1f(lightStrengthUniformLoc, lightStrength);

    return {
        pos: lightPositionUniformLoc, 
        colour: lightColourUniformLoc,
        ambient: lightAmbientUniformLoc, 
        strength: lightStrengthUniformLoc, 
        shininess: shininessUniformLoc
    }
}