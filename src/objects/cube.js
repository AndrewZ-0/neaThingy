import { Object } from "./objectAbstract.js";



export class Cube extends Object {
    constructor(name, x, y, z, pitch, yaw, roll) {
        super(name, x, y, z, pitch, yaw, roll);
        this.x = x
        this.y = y
        this.z = z
    }

    generate(normalsFlag) {
        this.vertices = [];
        this.indices = [];


        if (normalsFlag) {

            this.vertices = [
            //    X,   Y,   Z        R,  G,   B
                //top
                -1.0, 1.0, -1.0,   0, 1, 0, 0.5, 0.5, 0.5,
                -1.0, 1.0, 1.0,   0, 1, 0,  0.5, 0.5, 0.5,
                1.0, 1.0, 1.0,    0, 1, 0,  0.5, 0.5, 0.5,
                1.0, 1.0, -1.0,   0, 1, 0,  0.5, 0.5, 0.5,
        
                //left
                -1.0, 1.0, 1.0,   -1, 0, 0,  0.75, 0.25, 0.5,
                -1.0, -1.0, 1.0, -1, 0, 0,   0.75, 0.25, 0.5,
                -1.0, -1.0, -1.0, -1, 0, 0,  0.75, 0.25, 0.5,
                -1.0, 1.0, -1.0, -1, 0, 0,   0.75, 0.25, 0.5,
        
                //right
                1.0, 1.0, 1.0,  1, 0, 0,   0.25, 0.25, 0.75,
                1.0, -1.0, 1.0, 1, 0, 0,   0.25, 0.25, 0.75,
                1.0, -1.0, -1.0, 1, 0, 0,  0.25, 0.25, 0.75,
                1.0, 1.0, -1.0,  1, 0, 0, 0.25, 0.25, 0.75,
        
                //front
                1.0, 1.0, 1.0,   0, 0, 1,  1.0, 0.0, 0.15,
                1.0, -1.0, 1.0,  0, 0, 1,   1.0, 0.0, 0.15,
                -1.0, -1.0, 1.0,  0, 0, 1,   1.0, 0.0, 0.15,
                -1.0, 1.0, 1.0,  0, 0, 1,   1.0, 0.0, 0.15,
        
                //back
                1.0, 1.0, -1.0,  0, 0, -1,   0.0, 1.0, 0.15,
                1.0, -1.0, -1.0,   0, 0, -1,  0.0, 1.0, 0.15,
                -1.0, -1.0, -1.0, 0, 0, -1,    0.0, 1.0, 0.15,
                -1.0, 1.0, -1.0,  0, 0, -1,   0.0, 1.0, 0.15,
        
                //bottom
                -1.0, -1.0, -1.0,  0, -1, 0,  0.5, 0.5, 1.0,
                -1.0, -1.0, 1.0,  0, -1, 0,   0.5, 0.5, 1.0,
                1.0, -1.0, 1.0,   0, -1, 0,   0.5, 0.5, 1.0,
                1.0, -1.0, -1.0,  0, -1, 0,   0.5, 0.5, 1.0,
            ];


            this.indices = [
                //top
                0, 1, 2,
                0, 2, 3,
        
                //left
                5, 4, 6,
                6, 4, 7,
        
                //right
                8, 9, 10,
                8, 10, 11,
        
                //front
                13, 12, 14,
                15, 14, 12,
        
                //back
                16, 17, 18,
                16, 18, 19,
        
                //bottom
                21, 20, 22,
                22, 20, 23
            ];

        }

        else {

            //create buffer
            this.vertices = [
            //    X,   Y,   Z        R,  G,   B
                //top
                -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
                -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
                1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
                1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
        
                //left
                -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
                -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
                -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
                -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
        
                //right
                1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
                1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
                1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
                1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
        
                //front
                1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
                1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
                -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
                -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
        
                //back
                1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
                1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
                -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
                -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
        
                //bottom
                -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
                -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
                1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
                1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
            ];

            this.indices = [
                //top
                0, 1, 2,
                0, 2, 3,
        
                //left
                5, 4, 6,
                6, 4, 7,
        
                //right
                8, 9, 10,
                8, 10, 11,
        
                //front
                13, 12, 14,
                15, 14, 12,
        
                //back
                16, 17, 18,
                16, 18, 19,
        
                //bottom
                21, 20, 22,
                22, 20, 23
            ];
        }

    }

    getBoundingSphereRadius() {
        return Math.sqrt(2);
    }
}

