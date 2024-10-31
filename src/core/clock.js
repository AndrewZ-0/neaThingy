
export const FPS = 60; //annoyingly, webgl does not support changing fps so I'm kinda stuck with this now
export let deltaT = 1/60;


let last_t = window.performance.now();
let new_t;

export let current_fps;

export function updateFps() {
    current_fps = 1 / deltaT; 
}

export function updateDeltaT() {
    new_t = window.performance.now();
    deltaT = (new_t - last_t) / 1000;  //since performance.now() gives time in miliseocnds
    last_t = new_t;
}

//updateDeltaT();