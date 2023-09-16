
// rob

let deltaTime = 0;
let lastTime = Date.now();

const canvas = document.getElementById('header-canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const font_size = width < height ? width / 3 : height / 2;
const centerX = width / 2;
const centerY = height / 2;
let mouseX = centerX;
let mouseY = centerY;
// console.log("width: ", width)
// console.log("height: ", height)
// console.log("font_size: ", font_size)
// console.log("centerX: ", centerX)
// console.log("centerY: ", centerY)
// console.log("mouseX: ", mouseX)
// console.log("mouseY: ", mouseY)

let word = "rob"
if (Math.random() < 0.01) {
    word = "nob"
}

class Rob {
    constructor(colour = false, x = centerX, y = centerY, parent = false) {
        this.colour = colour ? colour : 180
        this.opacity = 1
        this.x = x
        this.y = y
        this.speed = 0
        this.angle = 0
        this.targetX = parent.x ? parent.x : centerX
        this.targetY = parent.y ? parent.y : centerY
        this.birth = Date.now()
        this.parent = parent
    }

    move(targetX = this.parent.x, targetY = this.parent.y) {
        if (this.x - centerX < 1 && this.y - centerY < 1 && (robs[0] == this)) {
            this.x = centerX
            this.y = centerY
        } else {
            this.angle = Math.atan2(targetY - this.y, targetX - this.x)
            this.speed = this.distance_from_target(targetX, targetY) < 1 ? this.distance_from_target(targetX, targetY) : 100
            this.x += Math.cos(this.angle) * this.speed * deltaTime
            this.y += Math.sin(this.angle) * this.speed * deltaTime

            let angle_to_center = Math.atan2(centerY - this.y, centerX - this.x)
            this.x += Math.cos(angle_to_center) * (this.speed / 6) * deltaTime
            this.y += Math.sin(angle_to_center) * (this.speed / 6) * deltaTime
        }
    }

    distance_from_target(targetX, targetY) {
        return Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2))
    }

    draw(x = this.x, y = this.y, colour = false) {
        ctx.font = `900 ${font_size}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colour ? colour : `hsl(${this.colour}, 65%, 85%)`
        ctx.fillText(word, x, y);
    }
}

const mainRob = new Rob(false, centerX, centerY)
const robs = [new Rob(0, mouseX, mouseY, parent = mainRob)]

let colourIndex = 0
let touching = false

function run() {
    ctx.clearRect(0, 0, width, height);
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    for (let i = 0; i < robs.length; i++) {
        robs[i].move()
        robs[i].colour -= 3.5
    }

    if (((robs.length > 1) && (robs[0].distance_from_target(centerX, centerY) < 0.7)) || (robs[0].x < -width * 0.5 || robs[0].x > width * 1.5 || robs[0].y < -height * 0.5 || robs[0].y > height * 1.5)) {
        clean()
    }
    if (robs.length < 500 && (touching || mouseX != centerX || mouseY != centerY)) {
        robs.push(new Rob(colourIndex, mouseX, mouseY, parent = robs[robs.length - 1]))
    }
    if (!touching) {
        mouseX = centerX
        mouseY = centerY
    }
    colourIndex -= 1

    for (let i = 0; i < robs.length; i++) {
        robs[i].draw()
    }
    mainRob.draw()
    update_fps()
    requestAnimationFrame(run);
}

function clean() {
    robs[0].x = centerX
    robs[0].y = centerY
    if (robs.length > 1) {
        robs.splice(0, 1)
        robs[0].parent = mainRob
        if (((robs.length > 1) && (robs[0].distance_from_target(centerX, centerY) < 0.7)) || (robs[0].x < -width * 0.5 || robs[0].x > width * 1.5 || robs[0].y < -height * 0.5 || robs[0].y > height * 1.5)) {
            clean()
        }
    }
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
    fps_counter.innerHTML = `${Math.round(fps)} fps, ${robs.length} ${word}${robs.length == 1 ? "" : "s"}`
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
    let area = canvas.getBoundingClientRect();
    return {
        x: event.clientX - area.left,
        y: event.clientY - area.top
    }
}

run()