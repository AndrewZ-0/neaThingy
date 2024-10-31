import {camera, cameraMode} from "./camera.js"
import {shaderMode} from "./shaders.js"
import * as utils from "../utils/viewHelper.js"
import {current_fps, updateFps} from "./clock.js"

//fps stuff
const FPS_updateCycle = 30;

let last_update_frame = 0

export function updateFpsOverlay() {
    last_update_frame += 1;

    if (last_update_frame === FPS_updateCycle) {
        updateFps();
        //this is an absolutely cursed way of doing fstring
        document.getElementById("fps-overlay").innerHTML = `FPS: ${current_fps.toFixed(3)}`; 

        last_update_frame = 0;
    }
}

export function updateShaderOverlays() {
    document.getElementById("shaderMode-overlay").innerHTML = `ShaderMode: ${shaderMode}`;
}

export function updateCameraModeOverlay() {
    document.getElementById("cameraMode-overlay").innerHTML = `CameraMode: ${cameraMode}`;
    if (cameraMode === "Cartesian") {
        document.getElementById("r-overlay").innerHTML = "";
        document.getElementById("altitude-overlay").innerHTML = "";
        document.getElementById("azimuth-overlay").innerHTML = "";
    }
    else {
        document.getElementById("x-overlay").innerHTML = "";
        document.getElementById("y-overlay").innerHTML = "";
        document.getElementById("z-overlay").innerHTML = "";
        document.getElementById("pitch-overlay").innerHTML = "";
        document.getElementById("yaw-overlay").innerHTML = "";
        document.getElementById("roll-overlay").innerHTML = "";
    }
}

export function updateCameraPerspectiveOverlays() {
    document.getElementById("fov-overlay").innerHTML = `FOV: ${camera.fov}`;
    document.getElementById("near-overlay").innerHTML = `Near: ${camera.near}`;
    document.getElementById("far-overlay").innerHTML = `Far: ${camera.far}`;
}

export function updateCameraCartesianCoordsOverlays() {
    document.getElementById("x-overlay").innerHTML = `X: ${camera.coords.x.toFixed(3)}`; 
    document.getElementById("y-overlay").innerHTML = `Y: ${camera.coords.y.toFixed(3)}`; 
    document.getElementById("z-overlay").innerHTML = `Z: ${camera.coords.z.toFixed(3)}`; 
}

export function updateCameraPolarCoordsOverlays() {
    document.getElementById("r-overlay").innerHTML = `R: ${camera.r.toFixed(3)}`; 
    document.getElementById("altitude-overlay").innerHTML = `Altitude: ${utils.toDegree(camera.alt).toFixed(3)}`; 
    document.getElementById("azimuth-overlay").innerHTML = `Azimuth: ${utils.toDegree(camera.azi).toFixed(3)}`; 
}

export function updateCameraEulerAnglesOverlays() {
    document.getElementById("pitch-overlay").innerHTML = `Pitch: ${
        utils.toDegree(utils.pitchFromQuat(camera.orientation)).toFixed(3)
    }`; 
    document.getElementById("yaw-overlay").innerHTML = `Yaw: ${
        utils.toDegree(utils.yawFromQuat(camera.orientation)).toFixed(3)
    }`; 
    document.getElementById("roll-overlay").innerHTML = `Roll: ${
        utils.toDegree(utils.rollFromQuat(camera.orientation)).toFixed(3)
    }`; 
}

