

// rob


let deltaTime = 0;
let lastTime = Date.now();

const fps_counter = document.getElementsByClassName("fps-counter")[0];

const canvas = document.getElementById('header-canvas');
const ctx = canvas.getContext('2d');


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const font_size = width / 4;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let word = "rob"
if (Math.random() < 0.1) {
    word = "nob"
}

class Rob {
    constructor(colour = false, x = mouseX, y = mouseY, parent = false) {
        this.colour = colour ? colour : 100
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
        this.targetX = targetX
        this.targetY = targetY
        this.angle = Math.atan2(targetY - this.y, targetX - this.x)
        this.speed = 100
        this.x += Math.cos(this.angle) * this.speed * deltaTime
        this.y += Math.sin(this.angle) * this.speed * deltaTime

        let angle_to_center = Math.atan2(mainRob.y - this.y, mainRob.x - this.x)
        this.x += Math.cos(angle_to_center) * (this.speed / 6) * deltaTime
        this.y += Math.sin(angle_to_center) * (this.speed / 6) * deltaTime
    }

    distance_from_target(targetX, targetY) {
        return Math.sqrt(Math.pow(this.x - targetX, 2) + Math.pow(this.y - targetY, 2))
    }



    draw(x = this.x, y = this.y, colour = false) {
        ctx.font = `600 ${font_size}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colour ? colour : `hsl(${this.colour}, 65%, 75%)`
        ctx.fillText(word, x, y);
    }
}





const mainRob = new Rob(false, centerX, centerY)
const mouseRob = new Rob(1)
const robs = [new Rob(0, mouseRob.x, mouseRob.y, parent = mainRob)]

let ticker = Date.now()

let colourIndex = 0
let mouseRobColour = 0
let touching = false

function run() {
    ctx.clearRect(0, 0, width, height);
    mouseRob.x = mouseX
    mouseRob.y = mouseY
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();



    if (robs[0].distance_from_target(mainRob.x, mainRob.y) < 1 && robs.length > 1) {
        robs.splice(0, 1)
        robs[0].parent = mainRob
    }
    for (let i = 0; i < robs.length; i++) {
        robs[i].move()
        robs[i].draw()
        robs[i].colour -= 3
    }


    if (robs.length < 500 && (touching || mouseX != centerX || mouseY != centerY)) {
        robs.push(new Rob(colourIndex, mouseRob.x, mouseRob.y, parent = robs[robs.length - 1]))
    }
    if (!touching) {
        mouseX = centerX
        mouseY = centerY
    }
    colourIndex -= 1
    mainRob.draw(centerX, centerY, "white")
    // mouseRob.draw()
    fps_counter.innerHTML = Math.round(1 / deltaTime)
    requestAnimationFrame(run);
}


document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

document.addEventListener('touchstart', (e) => {
    e.preventDefault()
    touching = true
})

document.addEventListener('touchend', (e) => {
    e.preventDefault()
    touching = false
})

document.addEventListener('touchmove', (e) => {
    e.preventDefault()
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
})


run()