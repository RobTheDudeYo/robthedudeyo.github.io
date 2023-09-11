




let deltaTime = 0;
let lastTime = Date.now();


const canvas = document.getElementById('header-canvas');
const ctx = canvas.getContext('2d');


const width = canvas.width = window.innerWidth;
const height = canvas.height = 1000;
font_size = width / 4;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;


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
        this.speed = this.distance_from_target(targetX, targetY) * 25
        if (this.speed < 1) {
            this.speed = 1
        } else if (this.speed > 100) {
            this.speed = 100
        }
        this.x += Math.cos(this.angle) * this.speed * deltaTime
        this.y += Math.sin(this.angle) * this.speed * deltaTime

        this.targetX = targetX
        this.targetY = targetY
        this.angle = Math.atan2(mainRob.y - this.y, mainRob.x - this.x)
        this.speed = this.distance_from_target(mainRob.x, mainRob.y) * 1
        if (this.speed < 1) {
            this.speed = 1
        } else if (this.speed > 100) {
            this.speed = 100
        }
        this.x += Math.cos(this.angle) * this.speed * deltaTime
        this.y += Math.sin(this.angle) * this.speed * deltaTime
    }

    distance_from_target(targetX, targetY) {
        if (Math.abs(this.x - targetX) < 1 && Math.abs(this.y - targetY) < 1) {
            return 0.5
        }
        return Math.sqrt(Math.pow(this.x - targetX, 2) + Math.pow(this.y - targetY, 2))
    }



    draw(x = this.x, y = this.y, colour = false) {
        ctx.font = `600 ${font_size}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colour ? colour : `hsl(${this.colour}, 100%, 50%)`
        ctx.fillText('rob', x, y);
    }
}





const mainRob = new Rob(false, centerX, centerY)
const mouseRob = new Rob(1)
const robs = [new Rob(0, mouseRob.x, mouseRob.y, parent = mainRob)]

let ticker = Date.now()

let colourIndex = 0
let mouseRobColour = 0

function run() {
    console.log(robs.length)
    ctx.clearRect(0, 0, width, height);
    mouseRob.x = mouseX
    mouseRob.y = mouseY
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    for (let i = robs.length - 1; i >= 0; i--) {
        robs[i].move()
        if (i == 0) {
            if (robs[i].distance_from_target(mainRob.x, mainRob.y) < 10 && robs.length > 1) {
                robs.splice(i, 1)
                robs[0].parent = mainRob
            } else {
                robs[i].draw()
            }
        } else {
            robs[i].draw()
            robs[i].colour += 1
        }
    }

    if (robs.length < 1000) {
        robs.push(new Rob(colourIndex, mouseRob.x, mouseRob.y, parent = robs[robs.length - 1]))
        colourIndex += 10
    }

    // mouseRob.draw()
    mainRob.draw(centerX, centerY, "white")

    // make mouse fall towards the center
    mouseX += (centerX - mouseX) * deltaTime * 0.25
    mouseY += (centerY - mouseY) * deltaTime * 0.25

    setTimeout(() => {
        requestAnimationFrame(run);
    }, 1000 / 60);
}

canvas.addEventListener('touch', update_mouse_pos)
canvas.addEventListener('mousemove', update_mouse_pos)
function update_mouse_pos(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}

run()