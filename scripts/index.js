


const colours = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'brown',
    'white',
]


let deltaTime = 0;
let lastTime = Date.now();


const canvas = document.getElementById('header-canvas');
const ctx = canvas.getContext('2d');

let portrait = false
if (window.innerWidth < window.innerHeight) {
    portrait = true
}

const width = canvas.width = portrait ? window.innerWeight : window.innerWidth;
const height = canvas.height = portrait ? window.innerHidth : 1000;
const rotation = 90;
const centerX = portrait ? window.innerHeight / 2 : window.innerWidth / 2;
const centerY = portrait ? (window.innerWidth / 2) - 1000 : window.innerHeight / 2;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;


class Rob {
    constructor(colour = 8, x = centerX, y = centerY, parent = this) {
        this.colour = colour
        this.opacity = 1
        this.x = x
        this.y = y
        this.speed = 0
        this.angle = 0
        this.targetX = parent.x
        this.targetY = parent.y
        this.birth = Date.now()
        this.parent = parent
    }

    move(targetX = this.parent.x, targetY = this.parent.y) {
        this.targetX = targetX
        this.targetY = targetY
        this.angle = Math.atan2(targetY - this.y, targetX - this.x)
        this.speed = this.distance_from_target() * 25
        this.x += Math.cos(this.angle) * this.speed * deltaTime
        this.y += Math.sin(this.angle) * this.speed * deltaTime
    }

    distance_from_target() {
        let result = Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2))
        return result
    }



    draw(x = this.x, y = this.y) {
        ctx.font = `600 400px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colours[this.colour];
        if (portrait) {
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText('rob', x, y);
            ctx.rotate(-rotation * Math.PI / 180);
        } else {
            ctx.fillText('rob', x, y);
        }
    }
}





const mainRob = new Rob("white", centerX, centerY)
const mouseRob = new Rob("white")
const robs = [new Rob("white", centerX, centerY, mouseRob)]

let ticker = Date.now()
let colourChange = false

let colourIndex = 0

function run() {
    ctx.clearRect(0, 0, width, height);
    mouseRob.move(mouseX, mouseY)
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    if (robs.length < (colours.length - 1) * 3) {
        console.log("new rob")
        robs.push(new Rob(colourIndex, mainRob.x, mainRob.y, parent = robs[robs.length - 1] ? robs[robs.length - 1] : mainRob))
        colourIndex++
        if (colourIndex >= colours.length - 1) {
            colourIndex = 0
        }
    }
    // mainRob.draw()
    robs[0].colour = 8
    robs[0].move(mouseX, mouseY)

    for (let i = robs.length - 1; i > 0; i--) {
        robs[i].move()
        robs[i].draw()

    }
    robs[0].draw()

    requestAnimationFrame(run);
}


canvas.addEventListener('mousemove', update_mouse_pos)
function update_mouse_pos(event) {
    if (portrait) {
        mouseX = event.clientY
        mouseY = -event.clientX
    } else {
        mouseX = event.clientX
        mouseY = event.clientY
    }
}

run()