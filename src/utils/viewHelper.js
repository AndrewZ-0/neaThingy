export const globalOrigin = {x: 0, y: 0, z: 0};
export const globalFront = {x: 0, y: 0, z: -1};
export const globalRight = {x: 1, y: 0, z: 0};
export const globalUp = {x: 0, y: 1, z: 0};

export let identityMatrix = createMat4();
identityMat4(identityMatrix);


export const halfPi = Math.PI / 2;

//can't believe this is not a built in function..
export function toDegree(radian) {
    return radian * (180 / Math.PI);
}

export function toRadian(degrees) {
    return degrees * (Math.PI / 180);
}

//fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk
//Shut up, I totally did not yoink this from wikipedia
export function pitchFromQuat(q) {
    return Math.atan2(
        2 * (q.w * q.x + q.y * q.z),
        1 - 2 * (q.x * q.x + q.y * q.y)
    );
}

export function yawFromQuat(q) {
    const thingthatidontknowthenameof = Math.atan2(
        Math.sqrt(1 + 2 * (q.w * q.y - q.x * q.z)), 
        Math.sqrt(1 - 2 * (q.w * q.y - q.x * q.z))
    )
    return 2 * thingthatidontknowthenameof - halfPi;
}

export function rollFromQuat(q) {
    return Math.atan2(
        2 * (q.w * q.z + q.x * q.y), 
        1 - 2 * (q.y * q.y + q.z * q.z)
    );
}


//------------------------------------------------------------------------------------------
//p->y
//y->r
//r->p

//angles in radians
//don't really need this now, was using it for controlling roll during testing
export function setQuaternian(q, pitch, yaw, roll) {
    const cr = Math.cos(roll / 2);
    const sr = Math.sin(roll / 2);
    const cp = Math.cos(pitch / 2);
    const sp = Math.sin(pitch / 2);
    const cy = Math.cos(yaw / 2);
    const sy = Math.sin(yaw / 2);

    q[0] = sp * cy  - cp * sy * sr;  // x
    q[1] = cp * sy  + sp * cy * sr;  // y
    q[2] = cp * cy * sr - sp * sy ;  // z
    q[3] = cp * cy  + sp * sy * sr;  // w
}
//------------------------------------------------------------------------------------------


export function scaleVec3(vec, sf) {
    vec.x *= sf;
    vec.y *= sf;
    vec.z *= sf;
}


export function scaleTranslateVec3(vec, unitVec, sf) {
    vec.x += unitVec.x * sf;
    vec.y += unitVec.y * sf;
    vec.z += unitVec.z * sf;
}

export function magnitudeVec3(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
}

export function divVec3(vec, mag) {
    if (mag) {
        return {
            x: vec.x / mag, 
            y: vec.y / mag, 
            z: vec.z / mag
        };
    } 
    else {
        return {x: 0, y: 0, z: 0};
    }
}

export function normalizeVec3(vec) {
    return divVec3(vec, magnitudeVec3(vec));
}

export function crossVec3(a, b) {
    return {
        x: a.y * b.z - a.z * b.y, 
        y: a.z * b.x - a.x * b.z, 
        z: a.x * b.y - a.y * b.x
    };
}

export function dotVec3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

//modified lookAt function which I "borrowed" from the gl-matrix module
//made it a little bit more readable: despite some negligable performance loss
const EPSILON = 0.000001;
export function lookAt(viewOut, eye, front, up) {
    if (Math.abs(front.x) < EPSILON && Math.abs(front.y) < EPSILON && Math.abs(front.z) < EPSILON) {
        identityMat4(viewOut);
    }
    else {
        const z = divVec3(front, -magnitudeVec3(front));
        const x = normalizeVec3(crossVec3(up, z));
        const y = normalizeVec3(crossVec3(z, x));

        const xw = -dotVec3(x, eye);
        const yw = -dotVec3(y, eye);
        const zw = -dotVec3(z, eye);
    
        viewOut[0] = x.x;
        viewOut[1] = y.x;
        viewOut[2] = z.x;
        viewOut[3] = 0; 
        viewOut[4] = x.y;
        viewOut[5] = y.y;
        viewOut[6] = z.y;
        viewOut[7] = 0;
        viewOut[8] = x.z;
        viewOut[9] = y.z;
        viewOut[10] = z.z;
        viewOut[11] = 0;
        viewOut[12] = xw;
        viewOut[13] = yw;
        viewOut[14] = zw;
        viewOut[15] = 1;
    }
}

export function transformQuat(out, vec, q) {
    //God I'm smart: since crossVec only uses x, y, z passing it a vec4 such as q does not matter
    let uv = crossVec3(q, vec);
    let uuv = crossVec3(q, uv);

    scaleVec3(uv, q.w * 2);

    scaleVec3(uuv, 2);

    out.x = vec.x + uv.x + uuv.x;
    out.y = vec.y + uv.y + uuv.y;
    out.z = vec.z + uv.z + uuv.z;
}


export function getAxisAngle(axis, delta) {
    delta /= 2;
    const s = Math.sin(delta);

    return {
        x: s * axis.x, 
        y: s * axis.y, 
        z: s * axis.z, 
        w: Math.cos(delta)
    };
}

//note to self, multiplying two quats is non-commtitive so a*=b is not the ame as a=b*a
export function applyQuat(a, b) {
    a.x = b.x * a.w + b.w * a.x + b.y * a.z - b.z * a.y;
    a.y = b.y * a.w + b.w * a.y + b.z * a.x - b.x * a.z;
    a.z = b.z * a.w + b.w * a.z + b.x * a.y - b.y * a.x;
    a.w = b.w * a.w - b.x * a.x - b.y * a.y - b.z * a.z;
}

export function normaliseQuat(q) {
    const mag = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);

    q.x /= mag;
    q.y /= mag;
    q.z /= mag;
    q.w /= mag;
}

export function identityMat4(mat) {
    mat[0] = 1;
    mat[1] = 0;
    mat[2] = 0;
    mat[3] = 0;
    mat[4] = 0;
    mat[5] = 1;
    mat[6] = 0;
    mat[7] = 0;
    mat[8] = 0;
    mat[9] = 0;
    mat[10] = 1;
    mat[11] = 0;
    mat[12] = 0;
    mat[13] = 0;
    mat[14] = 0;
    mat[15] = 1;
}

export function createMat4() {
    return [
        0, 0, 0, 1, 
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1
    ];
}

export function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

    return [
        f / aspect, 0, 0, 0, 
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1, 
        0, 0, 2 * far * near * nf, 0
    ];
}


export function translate(mat, vec) {
    mat[12] = mat[0] * vec.x + mat[4] * vec.y + mat[8] * vec.z + mat[12];
    mat[13] = mat[1] * vec.x + mat[5] * vec.y + mat[9] * vec.z + mat[13];
    mat[14] = mat[2] * vec.x + mat[6] * vec.y + mat[10] * vec.z + mat[14];
    mat[15] = mat[3] * vec.x + mat[7] * vec.y + mat[11] * vec.z + mat[15];
}




//new ------------------------------------------------------------------------------------------
export function ortho(left, right, bottom, top, near, far) {
    const rl_diff = right - left;
    const tb_diff = top - bottom;
    const fn_diff = far - near;
    const rl_sum = right + left;
    const tb_sum = top + bottom;
    const fn_sum = far + near;

    return [
        2 / rl_diff, 0, 0, 0,
        0, 2 / tb_diff, 0, 0,
        0, 0, -2 / fn_diff, 0,
        -rl_sum / rl_diff, -tb_sum / tb_diff, -fn_sum / fn_diff, 1
    ];
}


export function coordsfromPolar(r, alt, azi) {
    const ca = Math.cos(alt);
    return {
        x: r * ca * Math.sin(azi), 
        y: r * Math.sin(alt), 
        z: r * ca * Math.cos(azi)
    }
}

//derrived this function by modifying and simplifying the standard euler to quat function 
//since polar coord has y-axis fixed, no roll is introduced
export function quatOrientationFromPolar(alt, azi) {
    const halfPitch = -alt / 2;
    const halfYaw = azi / 2;

    const cp = Math.cos(halfPitch);
    const sp = Math.sin(halfPitch);
    const cy = Math.cos(halfYaw);
    const sy = Math.sin(halfYaw);

    return {
        x: sp * cy, 
        y: cp * sy, 
        z: -sp * sy, 
        w: cp * cy
    };
}



//new ------------------------------------------------------------------------------------------