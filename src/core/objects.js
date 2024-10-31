export class Cube {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

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



export class Torus {
    constructor(x, y, z, R, r, radialSegments, tubularSegments) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.R = R; // Major radius
        this.r = r; // Minor radius
        this.radialSegments = radialSegments; // Number of segments around the major radius
        this.tubularSegments = tubularSegments; // Number of segments around the tube
        
        this.vertices = [];
        this.indices = [];
        
        // Create vertices and colors
        for (let i = 0; i <= radialSegments; i++) {
            let u = i / radialSegments * Math.PI * 2; // Angle around the torus

            for (let j = 0; j <= tubularSegments; j++) {
                let v = j / tubularSegments * Math.PI * 2; // Angle around the tube

                // Parametric equation for torus
                let x = (this.R + this.r * Math.cos(v)) * Math.cos(u);
                let y = this.r * Math.sin(v);
                let z = (this.R + this.r * Math.cos(v)) * Math.sin(u);

                // Add vertex coordinates and color (you can modify the colors as needed)
                this.vertices.push(x + this.x, y + this.y, z + this.z, 1.0, 0.5, 0.3); // (X, Y, Z, R, G, B)
            }
        }

        // Create indices for triangles
        for (let i = 0; i < radialSegments; i++) {
            for (let j = 0; j < tubularSegments; j++) {
                let first = (i * (tubularSegments + 1)) + j;
                let second = first + tubularSegments + 1;

                // Two triangles per quad
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
    }
}


export class Sphere {
    constructor(x, y, z, radius, fidelity, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.fidelity = fidelity;
        this.color = color;

        this.vertices = [];
        this.indices = [];
        this.generateSphere();
    }

    generateSphere() {
        const { radius, fidelity } = this;

        // Generate vertices for the entire sphere
        for (let latNumber = 0; latNumber <= fidelity; ++latNumber) {
            const theta = latNumber * Math.PI / fidelity; // Latitude angle, from 0 to π
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= fidelity; ++longNumber) {
                const phi = longNumber * 2 * Math.PI / fidelity; // Longitude angle, from 0 to 2π
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                // Compute vertex positions
                const xPos = radius * cosPhi * sinTheta;
                const yPos = radius * cosTheta;
                const zPos = radius * sinPhi * sinTheta;

                // Push vertex position and color
                this.vertices.push(
                    xPos + this.x, yPos + this.y, zPos + this.z,
                    ...this.color // Add color for each vertex
                );
            }
        }

        // Generate indices for the entire sphere
        for (let latNumber = 0; latNumber < fidelity; ++latNumber) {
            for (let longNumber = 0; longNumber < fidelity; ++longNumber) {
                const first = (latNumber * (fidelity + 1)) + longNumber;
                const second = first + fidelity + 1;

                // Two triangles per quad
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
    }

    getVertexData() {
        return new Float32Array(this.vertices);
    }

    getIndexData() {
        return new Uint16Array(this.indices);
    }
}

export class Cylinder {
    constructor(x, y, z, radius, height, fidelity, color, orientation = "vertical") {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.height = height;
        this.fidelity = fidelity;
        this.color = color;
        this.orientation = orientation; // New parameter for orientation

        this.vertices = [];
        this.indices = [];
        this.generateCylinder();
    }

    generateCylinder() {
        const { radius, height, fidelity, orientation } = this;

        // Generate vertices for the top and bottom circles based on orientation
        for (let i = 0; i <= fidelity; ++i) {
            const theta = i * 2 * Math.PI / fidelity; // Angle around the circle
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            let topVertex, bottomVertex;

            if (orientation === "vertical") {
                // Top circle vertex (for vertical cylinder)
                topVertex = [this.x, this.y + height / 2, this.z + radius * sinTheta];
                bottomVertex = [this.x, this.y - height / 2, this.z + radius * sinTheta];
            } 
            else if (orientation === "horizontalX") {
                // Horizontal cylinder extending along the X-axis
                topVertex = [this.x + height / 2, this.y + radius * sinTheta, this.z + radius * cosTheta];
                bottomVertex = [this.x - height / 2, this.y + radius * sinTheta, this.z + radius * cosTheta];
            } 
            else if (orientation === "horizontalY") {
                // Horizontal cylinder extending along the Y-axis
                topVertex = [this.x + radius * sinTheta, this.y + height / 2, this.z + radius * cosTheta];
                bottomVertex = [this.x + radius * sinTheta, this.y - height / 2, this.z + radius * cosTheta];
            } 
            else if (orientation === "horizontalZ") {
                // Horizontal cylinder extending along the Z-axis
                topVertex = [this.x + radius * cosTheta, this.y + radius * sinTheta, this.z + height / 2];
                bottomVertex = [this.x + radius * cosTheta, this.y + radius * sinTheta, this.z - height / 2];
            }

            // Push vertices based on calculated positions
            this.vertices.push(...topVertex, ...this.color);
            this.vertices.push(...bottomVertex, ...this.color);
        }

        // Generate indices for the cylinder sides
        for (let i = 0; i < fidelity; ++i) {
            const top1 = i * 2; // Top vertex index
            const top2 = (i + 1) * 2; // Next top vertex index
            const bottom1 = i * 2 + 1; // Bottom vertex index
            const bottom2 = (i + 1) * 2 + 1; // Next bottom vertex index

            // Two triangles per rectangle side of the cylinder
            this.indices.push(top1, bottom1, top2); // First triangle
            this.indices.push(top2, bottom1, bottom2); // Second triangle
        }

        // Generate the top face
        const topCenterIndex = this.vertices.length / 6; // Index for the top center vertex
        if (orientation === "vertical") {
            this.vertices.push(this.x, this.y + height / 2, this.z, ...this.color); // Center vertex for top face
        } else if (orientation === "horizontalX") {
            this.vertices.push(this.x + height / 2, this.y, this.z, ...this.color); // Center vertex for top face
        } else if (orientation === "horizontalY") {
            this.vertices.push(this.x, this.y + height / 2, this.z, ...this.color); // Center vertex for top face
        } else if (orientation === "horizontalZ") {
            this.vertices.push(this.x, this.y, this.z + height / 2, ...this.color); // Center vertex for top face
        }

        for (let i = 0; i < fidelity; ++i) {
            const first = i * 2; // First vertex in the top circle
            const second = (i + 1) * 2; // Next vertex in the top circle
            
            // Two triangles for the top face
            this.indices.push(topCenterIndex, first, second);
        }

        // Generate the bottom face
        const bottomCenterIndex = this.vertices.length / 6; // Index for the bottom center vertex
        if (orientation === "vertical") {
            this.vertices.push(this.x, this.y - height / 2, this.z, ...this.color); // Center vertex for bottom face
        } 
        else if (orientation === "horizontalX") {
            this.vertices.push(this.x - height / 2, this.y, this.z, ...this.color); // Center vertex for bottom face
        } 
        else if (orientation === "horizontalY") {
            this.vertices.push(this.x, this.y - height / 2, this.z, ...this.color); // Center vertex for bottom face
        } 
        else if (orientation === "horizontalZ") {
            this.vertices.push(this.x, this.y, this.z - height / 2, ...this.color); // Center vertex for bottom face
        }

        for (let i = 0; i < fidelity; ++i) {
            const first = i * 2 + 1; // First vertex in the bottom circle
            const second = (i + 1) * 2 + 1; // Next vertex in the bottom circle
            
            // Two triangles for the bottom face
            this.indices.push(bottomCenterIndex, second, first);
        }
    }

    getVertexData() {
        return new Float32Array(this.vertices);
    }

    getIndexData() {
        return new Uint16Array(this.indices);
    }
}



