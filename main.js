
async function main(shader_name = "periodic") {
    let canvas = document.getElementById("wallpaper");
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("no webgl2 lol");
        return;
    }

    let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
        loadText("./" + shader_name + "/shader.vertex"),
        loadText("./" + shader_name + "/shader.fragment"),
    ]);

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let timeUniformLocation = gl.getUniformLocation(program, "u_time");
    let randomUniformLocation = gl.getUniformLocation(program, "u_random");
    let cloudstextureUniformLocation = gl.getUniformLocation(program, "u_clouds_texture");
    let mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");

    canvas.addEventListener('mousemove', (e) => {
        let pos = getMousePos(canvas, e);
        gl.uniform2f(mouseUniformLocation, pos.x, canvas.height - pos.y);
    });

    let cloudsTexture = new Image();
    cloudsTexture.src = "./clouds.png";
    await new Promise((resolve) => {
        cloudsTexture.onload = () => resolve();
    });
    let clouds_texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, clouds_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cloudsTexture);
    gl.generateMipmap(gl.TEXTURE_2D);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    resizeCanvasToDisplaySize(gl.canvas);

    let positions = [
        0, 0,
        0, gl.canvas.height,
        gl.canvas.width, 0,
        0, gl.canvas.height,
        gl.canvas.width, gl.canvas.height,
        gl.canvas.width, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset
    );
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeUniformLocation, performance.now() / 1000);
    gl.uniform1f(randomUniformLocation, Math.random());
    gl.uniform1i(cloudstextureUniformLocation, 0);

    let primitiveType = gl.TRIANGLES;
    let count = 6;
    gl.drawArrays(primitiveType, offset, count);

    let running = true;

    while (running) {
        if (resizeCanvasToDisplaySize(gl.canvas)) {
            positions = [
                0, 0,
                0, gl.canvas.height,
                gl.canvas.width, 0,
                0, gl.canvas.height,
                gl.canvas.width, gl.canvas.height,
                gl.canvas.width, 0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        }
        gl.uniform1f(timeUniformLocation, performance.now() / 1000);
        gl.drawArrays(primitiveType, 0, count);
        let shaderSelect = document.getElementById("shader-select");
        if (shaderSelect) {
            if (shaderSelect.value !== shader_name) {
                running = false;
                gl.deleteTexture(clouds_texture);
                gl.deleteBuffer(positionBuffer);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                canvas.replaceWith(canvas.cloneNode(true));
                await main(shaderSelect.value);
                break;
            }
        }
        await new Promise(requestAnimationFrame);
    }

}

//
//
//


async function loadText(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.text();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.round(canvas.clientWidth * dpr);
    const displayHeight = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        return true;
    }
    return false;
}
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}



main();