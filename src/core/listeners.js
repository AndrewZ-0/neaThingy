import {camera, toggleCameraMode} from "./camera.js"
import {toggleShaderMode} from "./shaders.js"

export let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false
};

function handleKeyDown(event) {
    switch (event.key.toLowerCase()) {
        case "w":
            keys.w = true;
            break;
        case "a":
            keys.a = true;
            break;
        case "s":
            keys.s = true;
            break;
        case "d":
            keys.d = true;
            break;
        case "shift":
            keys.shift = true;
            break;
        case " ":
            keys.space = true;
            break;
        default:
            break;
    }
}

function handleKeyUp(event, canvas) {
    switch (event.key.toLowerCase()) {
        case "w":
            keys.w = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "s":
            keys.s = false;
            break;
        case "d":
            keys.d = false;
            break;
        case "shift":
            keys.shift = false;
            break;
        case " ":
            keys.space = false;
            break;
        case "p":
            toggleShaderMode();
            break;
        case "c":
            unbindCameraCallbacks(canvas);
            toggleCameraMode();
            bindCameraCallbacks(canvas);
            break;
        default:
            break;
    }
}

function unbindCameraCallbacks(canvas) {
    //have to bind the callbacks to the specific instance of camera because of js "this" being dumb
    canvas.removeEventListener("mousemove", currentCameraMouseMoveCallback);
    canvas.removeEventListener("mousedown", currentCameraMouseButtonCallback);
    canvas.removeEventListener("mouseup", currentCameraMouseButtonCallback);
    canvas.removeEventListener("mouseleave", currentCameraMouseButtonCallback);
}

function bindCameraCallbacks(canvas) {
    //have to bind the callbacks to the specific instance of camera because of js "this" being dumb
    currentCameraMouseMoveCallback = camera.mouseMoveCallback.bind(camera);
    currentCameraMouseButtonCallback = camera.mouseButtonCallback.bind(camera);
    canvas.addEventListener("mousemove", currentCameraMouseMoveCallback);
    canvas.addEventListener("mousedown", currentCameraMouseButtonCallback);
    canvas.addEventListener("mouseup", currentCameraMouseButtonCallback);
    canvas.addEventListener("mouseleave", currentCameraMouseButtonCallback);
}



let currentCameraMouseMoveCallback;
let currentCameraMouseButtonCallback;




export function bindAll(canvas) {
    document.addEventListener(
        "keydown", function(event) {
            handleKeyDown(event);
        }
    );
    document.addEventListener(
        "keyup", function(event) {
            handleKeyUp(event, canvas);
        }
    );

    bindCameraCallbacks(canvas);
}

export function bindVisabilityChange(lambda) {
    document.addEventListener("visibilitychange", lambda)
}
