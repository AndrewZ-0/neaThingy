import {masterRenderer} from "./renderer.js";
import * as utils from "../utils/linearAlgebra.js";


function getNormalizedDeviceCoords(mouseX, mouseY) {
    const clientRect = masterRenderer.canvas.getBoundingClientRect();

    return {
        x: 2 * (mouseX - clientRect.left) / clientRect.width - 1, 
        y: 1 - 2 * (mouseY - clientRect.top) / clientRect.height
    };
}

//broken for some wierd reason, I think either the proj or the view matrix is broken
function getRayFromNDC(x, y) {
    const invertedProjectionMatrix = utils.invertMat4(masterRenderer.matricies.proj);
    
    const rayClip = {x, y, z: -1, w: 1}; //clip space
    const rayEye = utils.transformMat4(rayClip, invertedProjectionMatrix);

    rayEye.z = -1;
    rayEye.w = 0;

    const invertedViewMatrix = utils.invertMat4(masterRenderer.matricies.view);
    const rayWorld = utils.transformMat4(rayEye, invertedViewMatrix);

    const rayDir = utils.normaliseVec3(rayWorld);
    
    return rayDir;
}

function objectIntersectsRay(object, rayOrigin, rayDir) {
    const r = object.getBoundingSphereRadius();
    
    const h = utils.subVec3(object, rayOrigin); //from camera to sphere origin

    return utils.dotVec3(h, rayDir) >= (utils.dotVec3(h, h) - r * r) ** 0.5;
}

function minDist(object, rayOrigin) {
    const h = utils.subVec3(object, rayOrigin);
    
    return utils.magnitudeVec3(h) - object.getBoundingSphereRadius();
}


export function raycastMouseCollisionCheck(mouseX, mouseY) {
    const {x, y} = getNormalizedDeviceCoords(mouseX, mouseY);
    const rayDir = getRayFromNDC(x, y); 
    const rayOrigin = masterRenderer.camera.coords;

    //console.log(rayDir);

    let selectedObject = null;
    let minDistance = Infinity;

    for (let i = 0; i < masterRenderer.objects.length; i++) {
        if (objectIntersectsRay(masterRenderer.objects[i], rayOrigin, rayDir)) {
            const currentMinDistance = minDist(masterRenderer.objects[i], rayOrigin);

            //console.log(currentMinDistance)

            if (currentMinDistance < minDistance) {
                selectedObject = masterRenderer.objects[i];
                minDistance = currentMinDistance;
            }
        }
    }

    let i = null;
    if (selectedObject) {
        const name = selectedObject.name;
        //console.log(`Selected object: ${name}`);

        i = masterRenderer.objects.indexOf(selectedObject);
    } 
    /*
    else {
        console.log('No object selected');
    }
    */
    masterRenderer.handleSelection(i);
}

