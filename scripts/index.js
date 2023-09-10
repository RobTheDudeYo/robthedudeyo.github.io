


const colours = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'brown',
]


let deltaTime = 0;
let lastTime = Date.now();


const canvas = document.getElementById('header-canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight < window.innerWidth ? 1000 : window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;


// class for an instance of 'rob'
class Rob {
    // rob is what is written at the top of my website in a canvas, there will be multiple robs of various sizes and colours moving left and right but offset so you can see all the colours, lining up in the middle of the screen
    constructor(colour = 'white', x = centerX, y = centerY, targetX = centerX, targetY = centerY) {
        this.colour = colour
        this.opacity = 1
        this.x = x
        this.y = y
        this.speed = 1
        this.targetX = targetX ? targetX : this.x
        this.targetY = targetY ? targetY : this.y
        this.birth = Date.now()
    }

    move(targetX = this.targetX, targetY = this.targetY) {
        this.targetX = targetX
        this.targetY = targetY
        this.speed = this.distance_from_target()*2
        let angle = Math.atan2(targetY - this.y, targetX - this.x)
        this.x += Math.cos(angle) * this.speed * deltaTime
        this.y += Math.sin(angle) * this.speed * deltaTime
        if (Date.now() - this.birth > 1000) {
            this.opacity -= 0.075
            if (this.opacity <= 0) {
            robs.splice(robs.indexOf(this), 1)
            }
        }
    }

    distance_from_target() {
        let result = Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2))
        return result
    }



    draw(x = this.x, y = this.y) {
        ctx.font = `600 400px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.colour;
        ctx.globalAlpha = this.opacity
        ctx.fillText('rob', x, y);
    }
}




let mouseX = centerX
let mouseY = centerY

const mainRob = new Rob("white")
const mouseRob = new Rob("white")
const robs = [new Rob(colours[0], centerX, centerY, mouseX, mouseY)]

let ticker = Date.now()

let colourIndex = 0

function run() {
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    if (Date.now() - ticker > 100) {
        robs.push(new Rob(colours[colourIndex], centerX, centerY, mouseX, mouseY))
        ticker = Date.now()
        colourIndex++
        if (colourIndex >= colours.length) {
            colourIndex = 0
        }
    }
    console.log(robs.length)




    ctx.clearRect(0, 0, width, height)

    if (robs[0]) {
        for (i = robs.length - 1; i >= 0; i--) {
            robs[i].draw()
            robs[i].move(mouseX, mouseY)
        }
    }
    // mouseRob.draw(mouseX, mouseY)
    mainRob.draw()

    requestAnimationFrame(run);
}


canvas.addEventListener('mousemove', update_mouse_pos)
function update_mouse_pos(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}

run()