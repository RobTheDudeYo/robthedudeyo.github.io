
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


let star_location = 0

class Mouse {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.colour = 'rgba(0, 0, 0, 1)'
    }

    update() {
        this.x = mouseX
        this.y = mouseY
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2)
        ctx.fill()
    }
}

class Dot {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.vector = { x: 10, y: 0 }
        this.radius = radius
        this.color = color
    }

    update() {
        let dx = mouseX - this.x
        let dy = mouseY - this.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        this.vector.x += dx / dist
        this.vector.y += dy / dist
        this.x += this.vector.x
        this.y += this.vector.y
        this.vector.x *= 0.996
        this.vector.y *= 0.996
        if (this.x < 0 || this.x > width) {
            this.vector.x *= -1
        } else if (this.y < 0 || this.y > height) {
            this.vector.y *= -1
        }
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}

const mouse = new Mouse(centerX, centerY)
const dot = new Dot(centerX + 10, centerY + 50, 10, 'rgba(0, 0, 0, 1)')

let touching = false

ctx.fillStyle = 'rgba(209, 244, 11, 1)';
ctx.fillRect(0, 0, width, height);

function run() {
    ctx.fillStyle = 'rgba(209, 244, 11, 0.1)';
    ctx.fillRect(0, 0, width, height);
    deltaTime = (Date.now() - lastTime) / 10;
    lastTime = Date.now();

    mouse.update()
    dot.update()
    mouse.draw()
    dot.draw()


    update_fps()
    requestAnimationFrame(run);
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