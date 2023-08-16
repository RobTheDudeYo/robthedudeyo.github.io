

const container = document.querySelector(".gamePanel");
const game = new Game(container, levels);

const fps = document.querySelector(".fps");

let fpses = [];
let gameState = "game"

game.initialiseLevel(11);

function run() {
    if (gameState == "game") {
        gameState = game.run();
    }
    game.deltaTime = Date.now() - game.lastTime;
    game.lastTime = Date.now();
    fpses.push(1000 / game.deltaTime);
    if (fpses.length > 10) {
        fpses.shift();
    }
    fps.innerHTML = Math.round(fpses.reduce((a, b) => a + b) / fpses.length) + " fps";

    requestAnimationFrame(run);
}


// keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft" || e.key.toLowerCase() == "a") {
        if (game.paddle.direction > -1) {
            game.paddle.direction = -1;
        }
    }
    if (e.key == "ArrowRight" || e.key.toLowerCase() == "d") {
        if (game.paddle.direction < 1) {
            game.paddle.direction = 1;
        }
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft" || e.key.toLowerCase() == "a") {
        if (game.paddle.direction == -1) {
            game.paddle.direction = 0;
        }
    }
    if (e.key == "ArrowRight" || e.key.toLowerCase() == "d") {
        if (game.paddle.direction == 1) {
            game.paddle.direction = 0;
        }
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        game.serveBall();
    }
});



// touch buttons
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("buttonContainer");
document.body.appendChild(buttonContainer);
const leftButton = document.createElement("div");
leftButton.className = "controlButton left";
buttonContainer.appendChild(leftButton);
const rightButton = document.createElement("div");
rightButton.className = "controlButton right";
buttonContainer.appendChild(rightButton);
const actionButton = document.createElement("div");
actionButton.className = "controlButton action";
buttonContainer.appendChild(actionButton);


// touch button controls
document.querySelector(".left").addEventListener("touchstart", (e) => {
    if (game.paddle.direction > -1) {
        game.paddle.direction = -1;
    }
});
document.querySelector(".left").addEventListener("touchend", (e) => {
    if (game.paddle.direction == -1) {
        game.paddle.direction = 0;
    }
});
document.querySelector(".right").addEventListener("touchstart", (e) => {
    if (game.paddle.direction < 1) {
        game.paddle.direction = 1;
    }
});
document.querySelector(".right").addEventListener("touchend", (e) => {
    if (game.paddle.direction == 1) {
        game.paddle.direction = 0;
    }
});
document.querySelector(".action").addEventListener("touchstart", (e) => {
    game.serveBall();
});





requestAnimationFrame(run);