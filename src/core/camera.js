import * as utils from "../utils/linearAlgebra.js";
import {
    updateCameraCartesianCoordsOverlays, updateCameraModeOverlay, 
    updateCameraEulerAnglesOverlays, updateCameraPolarCoordsOverlays
} from "./overlays.js";
import {clock} from "./clock.js";
import {keys, mouseDragging} from "./listeners.js";
import {masterRenderer, axisRenderer} from "./renderer.js";


export let cameraMode = "Y-Polar";


class Camera {
    constructor() {
        this.fov = 45;
        this.near = 0.01;
        this.far = 1000;

        this.cameraSpeed = 6;

        this.sensitivity = 0.001;

        this.coords;

        this.changedSinceLastFrame;
    }

    getProjMat(canvas) {
        return utils.perspective(
            utils.toRadian(this.fov), 
            canvas.clientWidth / canvas.clientHeight, 
            this.near, 
            this.far
        );
    }
}


class CartesianCamera extends Camera {
    constructor(init_coords, init_orientation) {
        super();

        this.coords = {
            x: init_coords.x, 
            y: init_coords.y, 
            z: init_coords.z
        };

        //camera local unit vectors
        this.front = {x: 0, y: 0, z: 0};
        this.right = {x: 0, y: 0, z: 0};
        this.up = {x: 0, y: 0, z: 0};

        //gigachad camera orientation quaternion 
        this.orientation = {
            x: init_orientation.x, 
            y: init_orientation.y, 
            z: init_orientation.z, 
            w: init_orientation.w
        }; 

        //initilise direction vects based on initial camera position
        this.updateDirectionVects();
    }

    updateDirectionVects() {
        utils.transformQuat(this.front, utils.globalFront, this.orientation);
        utils.transformQuat(this.right, utils.globalRight, this.orientation);
        utils.transformQuat(this.up, utils.globalUp, this.orientation);
    }

    handleMovements() {
        if (keys.w || keys.s || keys.d || keys.a || keys.space || keys.shift || keys.left || keys.right || keys.up || keys.down || keys.period || keys.comma) {
            utils.scaleTranslateVec3(this.coords, this.front, this.cameraSpeed * clock.deltaT * (keys.w - keys.s));
            utils.scaleTranslateVec3(this.coords, this.right, this.cameraSpeed * clock.deltaT * (keys.d - keys.a));
            utils.scaleTranslateVec3(this.coords, this.up, this.cameraSpeed * clock.deltaT * (keys.space - keys.shift));
            updateCameraCartesianCoordsOverlays();


            utils.applyQuat(
                this.orientation, utils.getAxisAngle(
                    this.right, this.cameraSpeed * clock.deltaT * (keys.up - keys.down) * 0.08
                )
            ); //pitch
            utils.applyQuat(
                this.orientation, utils.getAxisAngle(
                    this.up, this.cameraSpeed * clock.deltaT * (keys.left - keys.right) * 0.08
                )
            ); //yaw
            utils.applyQuat(
                this.orientation, utils.getAxisAngle(
                    this.front, this.cameraSpeed * clock.deltaT * (keys.period - keys.comma) * 0.08
                )
            ); //roll
            utils.normaliseQuat(this.orientation);
            this.updateDirectionVects();
            updateCameraEulerAnglesOverlays();

            this.changedSinceLastFrame = true;
        }
    }

    //to help overlay calls from outside camera class - polymorphism IG
    updateAllOverlays() {
        updateCameraCartesianCoordsOverlays();
        updateCameraEulerAnglesOverlays();
    }

    //Beefed up version of euler rotaion approach...
    onMouseMove(offset) {
        //create a set of axis relative to camera to apply offsets to
        utils.applyQuat(this.orientation, utils.getAxisAngle(this.up, offset.x * this.sensitivity));  //yaw
        utils.applyQuat(this.orientation, utils.getAxisAngle(this.right, offset.y * this.sensitivity)); //pitch

        utils.normaliseQuat(this.orientation);

        //calculate local direction vectors from camera quat
        this.updateDirectionVects();

        //print out as euler angles because my pea sized brain can not understand 4d coordinates without having 17 simultaneous aneurysms
        updateCameraEulerAnglesOverlays();
    }

    updateCamera(viewMatrix) {
        this.changedSinceLastFrame = mouseDragging;

        this.handleMovements();
    
        this.getViewMatrix(viewMatrix);
    }

    forceUpdateCamera(viewMatrix) {
        //this.handleMovements();
    
        this.getViewMatrix(viewMatrix);

        this.changedSinceLastFrame = true;
        masterRenderer.render();
        axisRenderer.render();
    }

    getViewMatrix(viewMatrix) {
        utils.lookAt(viewMatrix, this.coords, this.front, this.up);
    }

    getOrientationViewMatrix(viewMatrix) {
        utils.lookAt(viewMatrix, utils.globalOrigin, camera.front, camera.up);
    }
}


class PolarCamera extends Camera {
    constructor(init_r, init_alt, init_azi, init_origin = {x: 0, y: 0, z: 0}) {
        super();

        this.localOrigin = {
            x: init_origin.x, 
            y: init_origin.y,
            z: init_origin.z
        }

        this.sensitivity = 0.005;
        this.azi_movement_sf = this.cameraSpeed * clock.deltaT / 2;
        this.alt_movement_sf = this.cameraSpeed * clock.deltaT / 4;

        this.r = init_r; //radial distance
        this.alt = init_alt; //altitude
        this.azi = init_azi; //azimuth

        this.front;

        //this.updatePosition();
    }

    readjustAngles() {
        if (this.azi < -Math.PI) {
            this.azi = Math.PI;
        }
        else if (this.azi > Math.PI) {
            this.azi = -Math.PI;
        }

        if (this.alt < -utils.halfPi) {
            this.alt = -utils.halfPi;
        }
        else if (this.alt > utils.halfPi) {
            this.alt = utils.halfPi;
        }
    }

    updateAllOverlays() {
        updateCameraPolarCoordsOverlays();
    }

    updatePosition() {
        this.readjustAngles();

        this.coords = utils.coordsfromPolar(this.r, this.alt, this.azi);
        this.front = utils.normaliseVec3({
            x: this.localOrigin.x - this.coords.x, 
            y: this.localOrigin.y - this.coords.y, 
            z: this.localOrigin.z - this.coords.z
        });

        this.updateAllOverlays();
    }

    handleMovements() {
        const deltaR = this.cameraSpeed * clock.deltaT * (keys.s - keys.w);
        const deltaAzi = this.azi_movement_sf * (keys.d - keys.a);
        const deltaAlt = this.alt_movement_sf * (keys.space - keys.shift);

        if (deltaR || deltaAzi || deltaAlt) {
            this.r += deltaR;
            this.azi += deltaAzi;
            this.alt += deltaAlt;

            this.readjustAngles();
            this.updatePosition();

            this.changedSinceLastFrame = true;
        }
    }

    onMouseMove(offset) {
        this.alt -= offset.y * this.sensitivity;
        this.azi += offset.x * this.sensitivity;

        this.readjustAngles();
        this.updatePosition();

        this.changedSinceLastFrame = true;
    }

    updateCamera(viewMatrix) {
        this.changedSinceLastFrame = mouseDragging;

        this.handleMovements();

        this.getViewMatrix(viewMatrix);
    }

    forceUpdateCamera(viewMatrix) {
        this.updatePosition();
        //this.handleMovements();
    
        this.getViewMatrix(viewMatrix);

        this.changedSinceLastFrame = true;
        masterRenderer.render();
        axisRenderer.render();
    }

    getViewMatrix(viewMatrix) {
        utils.lookAt(viewMatrix, this.coords, this.front, utils.globalUp);
    }

    getOrientationViewMatrix(viewMatrix) {
        utils.lookAt(viewMatrix, this.localOrigin, this.front, utils.globalUp);
    }
}


export function toggleCameraMode() {
    //pretty sure the old camera gets garbage collected... 
    //but if there is a memory leak, now you probably know why :)
    if (cameraMode === "Cartesian") {
        cameraMode = "Y-Polar";

        const r = utils.magnitudeVec3(camera.coords);
        camera = new PolarCamera(
            r, 
            Math.asin(camera.coords.y / r), 
            Math.atan2(camera.coords.x, camera.coords.z)
        );
    }
    else {
        cameraMode = "Cartesian";

        camera = new CartesianCamera(
            utils.coordsfromPolar(camera.r, camera.alt, camera.azi), 
            utils.quatOrientationFromPolar(camera.alt, camera.azi)
        );
        camera.updateAllOverlays();
    }

    updateCameraModeOverlay();
}


//export let camera = new CartesianCamera({x: 0, y: 0, z: 6}, {x: 0, y: 0, z: 0, w: 1});
export let camera = new PolarCamera(6, 0, 0);
