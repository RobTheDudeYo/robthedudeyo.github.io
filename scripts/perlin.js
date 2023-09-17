
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

const a_number = Math.floor(Math.random() * 100)

console.log(a_number)


ctx.fillStyle = 'rgba(209, 244, 11, 1)';
ctx.fillRect(0, 0, width, height);

function run() {
    ctx.fillStyle = 'rgba(209, 244, 11, 1)';
    ctx.fillRect(0, 0, width, height);
    deltaTime = (Date.now() - lastTime) / 10;
    lastTime = Date.now();




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

let touching = false
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