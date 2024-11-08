import {camera, toggleCameraMode} from "./camera.js";
import {masterRenderer} from "./renderer.js";
import {raycastMouseCollisionCheck} from "./raycast.js"

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
            masterRenderer.toggleShaderMode();
            break;
        case "c":
            toggleCameraMode();
            break;
        default:
            break;
    }
}


let lastX;
let lastY;
export let mouseDragging = false;
let clickFlag = true;

function nextMouseOffset(event) {
    const xoffset = lastX - event.clientX;
    const yoffset = lastY - event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;

    return {x: xoffset, y: yoffset};
}

function handleMouseMove(event) {
    if (mouseDragging) {
        clickFlag = false; //no longer a click

        //get relative change on screen
        const offset = nextMouseOffset(event);

        camera.onMouseMove(offset);
    }
}

function handleMouseButtonDown(event) {
    if (event.button === 0) {
        mouseDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }
}

function handleMouseButtonUp(event) {
    if (event.button === 0) {
        if (clickFlag) {
            raycastMouseCollisionCheck(event.x, event.y);
        }
        else {
            clickFlag = true;
        }

        mouseDragging = false;
    }
}

function handleMouseButtonLeave(event) {
    mouseDragging = false;
    clickFlag = true;
}


function bindCameraCallbacks(canvas) {
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseButtonDown);
    canvas.addEventListener("mouseup", handleMouseButtonUp);
    canvas.addEventListener("mouseleave", handleMouseButtonLeave);
}



export function bindAllControls(canvas) {
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








//legacy -----------------------------------------------------------------------------------
function unbindCameraCallbacks(canvas) {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mousedown", handleMouseButtonDown);
    canvas.removeEventListener("mouseup", handleMouseButtonUp);
    canvas.removeEventListener("mouseleave", handleMouseButtonLeave);
}
//------------------------------------------------------------------------------------------
