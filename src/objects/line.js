import {RenderObject} from "./objectAbstract.js";

export class Line extends RenderObject {
    constructor(name, x, y, z, direction, colour) {
        super(name, x, y, z, 0, 0, 0);

        this.direction = direction; //[dx, dy, dz] dir vec
        this.colour = colour;
        this.length = 10000; //arbitrary length in each direction
    }

    generate(normalsFlag) {
        this.vertices = [];
        this.indices = [];

        //calc two points in the dir vec from the origin, at +/- length
        const startX = this.x - this.length * this.direction[0];
        const startY = this.y - this.length * this.direction[1];
        const startZ = this.z - this.length * this.direction[2];
        
        const endX = this.x + this.length * this.direction[0];
        const endY = this.y + this.length * this.direction[1];
        const endZ = this.z + this.length * this.direction[2];

        this.vertices.push(startX, startY, startZ, ...this.colour);
        this.vertices.push(endX, endY, endZ, ...this.colour);

        this.indices.push(0, 1);
    }
}
