
// rob

let deltaTime = 0;
let lastTime = Date.now();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const centerX = width / 2;
const centerY = height / 2;
let mouseX = centerX;
let mouseY = centerY;

let word = "rob"
if (Math.random() < 0.01) {
    word = "nob"
}

let star_location = 0


class Ball {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.speed = 0
        this.angle = 0
    }

    update(deltaTime) {
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x)
        this.speed = ((Math.abs(mouseX - this.x) / 10) + (Math.abs(mouseY - this.y) / 10)) / 2
        this.x += Math.cos(this.angle) * this.speed * deltaTime * 100
        this.y += Math.sin(this.angle) * this.speed * deltaTime * 100
        if (this.x < 0) {
            this.x = 0
            this.speed = 0
        } else if (this.x > width) {
            this.x = width
            this.speed = 0
        } else if (this.y < 0) {
            this.y = 0
            this.speed = 0
        } else if (this.y > height) {
            this.y = height
            this.speed = 0
        }
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}

const ball1 = new Ball(centerX, centerY, 10, 'rgba(0, 0, 0, 1)')

let touching = false

ctx.fillStyle = 'rgba(209, 244, 11, 1)';
ctx.fillRect(0, 0, width, height);
function run() {
    ctx.fillStyle = 'rgba(209, 244, 11, 1)';
    ctx.fillRect(0, 0, width, height);
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    ball1.update(deltaTime)
    ball1.draw()


    update_fps()
    requestAnimationFrame(run);
}



const fps_counter = document.getElementsByClassName("fps-counter")[0];
let fpses = [];
function update_fps() {
    fpses.push(1 / deltaTime)
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
if (is_mobile) {
    document.addEventListener('touchstart', (e) => {
        e.preventDefault()
        let pos = getMousePos(canvas, e.touches[0])
        mouseX = pos.x
        mouseY = pos.y
        touching = true
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
    // how to get mouse position on canvas from https://stackoverflow.com/a/17130415
    // (thanks for the link, github copilot!)
    let area = canvas.getBoundingClientRect();
    return {
        x: event.clientX - area.left,
        y: event.clientY - area.top
    }
}

run()