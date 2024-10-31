export let shaderMode = "basic";


function loadShaderFile(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
}

function createShader(gl, source, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createShaderSet(gl, vsURL, fsURL) {
    let vertexShaderSource = loadShaderFile(vsURL);
    let fragmentShaderSource = loadShaderFile(fsURL);

    let vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    program.vShader = vertexShader;
    program.fShader = fragmentShader;

    return program;
}

export function createAllShaders(gl) {
    return createShaderSet(gl, "src/shaders/basic/vertexShader.glsl", "src/shaders/basic/fragmentShader.glsl");
}

export function shaderDrawElements(gl, indicesLength) {
    if (shaderMode === "basic") {
        gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);
    }
    else if(shaderMode === "wire") {
        gl.drawElements(gl.LINES, indicesLength, gl.UNSIGNED_SHORT, 0);
    }
}

export function toggleShaderMode() {
    if (shaderMode === "basic") {
        shaderMode = "wire";
    }
    else if(shaderMode === "wire") {
        shaderMode = "basic";
    }

    updateShaderOverlays();
}



