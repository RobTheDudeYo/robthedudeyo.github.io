
// rob

let deltaTime = 0;
let lastTime = Date.now();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const clickSound = new Audio('../sounds/click.mp3');
clickSound.volume = 0.1;
function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}



const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const centerX = width / 2;
const centerY = height / 2;
let mouseX = centerX;
let mouseY = centerY;

let collisions = 0;

class Block {
    constructor(x, y, size, mass, velocity, colour) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.mass = mass;
        this.velocity = velocity;
        this.colour = colour;
    }

    collide(other) {
        if (this.x < other.x + other.size && this.x + this.size > other.x) {
            return true;
        }
        return false;
    }

    bounce(other) {
        let v1 = this.velocity;
        let v2 = other.velocity;
        let m1 = this.mass;
        let m2 = other.mass;
        this.velocity = (v1 * (m1 - m2) + 2 * m2 * v2) / (m1 + m2);
        other.velocity = (v2 * (m2 - m1) + 2 * m1 * v1) / (m1 + m2);
    }

    update() {
        this.x += this.velocity;
    }

    draw(x) {
        ctx.fillStyle = this.colour;
        ctx.fillRect(x, this.y, this.size, this.size);
    }
}


let little_block = new Block(width * 0.1, height * 0.9 - width * 0.1, width * 0.1, 1, 0, 'red');
let big_block = new Block(width * 0.21, height * 0.9 - width * 0.3, width * 0.3, 100000000000000, -0.000001, 'blue');


let last_collisions = 0;

function run() {
    deltaTime = (Date.now() - lastTime) / 10;
    lastTime = Date.now();

    update();

    draw();

    if (collisions > last_collisions) {
        playSound();
        last_collisions = collisions;
    }

    requestAnimationFrame(run);
}


function update() {
    for (let i = 0; i < 1000000; i++) {
        little_block.update();
        if (little_block.x < 0) {
            little_block.x = 0;
            if (little_block.velocity < 0) {
                little_block.velocity *= -1;
            }
            collisions++;
        }
        big_block.update();
        if (little_block.collide(big_block)) {
            little_block.bounce(big_block);
            collisions++;
            if (big_block.x < little_block.x) {
                big_block.x = little_block.x - big_block.size;
            }
        }

    }
}


function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    // draw a line from left to right, center of screen
    ctx.beginPath();
    ctx.moveTo(0, height * 0.9);
    ctx.lineTo(width, height * 0.9);
    ctx.stroke();

    if (little_block.x < 0) {
        little_block.draw(0);
    } else {
        little_block.draw(little_block.x);
    }
    if (big_block.x < little_block.size) {
        big_block.draw(little_block.size);
    } else {
        big_block.draw(big_block.x);
    }

    // draw the number of collisions
    ctx.fillStyle = 'black';
    ctx.font = `${width * 0.2}px Courier New`;
    ctx.fillText(collisions, 0, width * 0.15);

    update_fps()
}

const fps_counter = document.getElementsByClassName("fps-counter")[0];
let fpses = [];
function update_fps() {
    fpses.push(100 / deltaTime)
    if (fpses.length > 10) {
        fpses.splice(0, 1)
    }
    let fps = 0
    for (let i = 0; i < fpses.length; i++) {
        fps += fpses[i]
    }
    fps /= fpses.length
    fps_counter.innerHTML = `${Math.round(fps)} fps`
}

const is_mobile = /Mobi|Android/i.test(navigator.userAgent);
let touching = false
let clicked = false
if (is_mobile) {
    document.addEventListener('touchstart', (e) => {
        e.preventDefault()
        let pos = getMousePos(canvas, e.touches[0])
        mouseX = pos.x
        mouseY = pos.y
        touching = true
        if (!clicked) {
            run()
            clicked = true
        }
    })
    document.addEventListener('touchend', (e) => {
        e.preventDefault()
        touching = false
    })
    document.addEventListener('touchmove', (e) => {
        e.preventDefault()
        let pos = getMousePos(canvas, e.touches[0])
        mouseX = pos.x
        mouseY = pos.y
    })
} else {
    document.addEventListener('mousedown', (e) => {
        let pos = getMousePos(canvas, e)
        mouseX = pos.x
        mouseY = pos.y
        touching = true
        if (!clicked) {
            run()
            clicked = true
        }
    })
    document.addEventListener('mouseup', (e) => {
        touching = false
    })
    document.addEventListener('mousemove', (e) => {
        if (touching) {
            let pos = getMousePos(canvas, e)
            mouseX = pos.x
            mouseY = pos.y
        }
    })
}
function getMousePos(canvas, event) {
    let area = canvas.getBoundingClientRect();
    return {
        x: event.clientX - area.left,
        y: event.clientY - area.top
    }
}

draw()

// "click/tap to start"
ctx.fillStyle = 'black';
ctx.font = `900 ${width * 0.05}px Courier New`;
ctx.fillText("click/tap to start", width * 0.1, height * 0.5);
