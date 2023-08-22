

const resolution = document.body.clientWidth < document.body.clientHeight ? document.body.clientWidth : document.body.clientHeight;

const fps = document.querySelector(".fps");
let fpses = [];
let canvas = document.querySelector(".panel");
canvas.width = resolution*0.9;
canvas.height = resolution*0.9;
let context = canvas.getContext("2d");



let deltaTime = 0;
let lastTime = Date.now();

let gameState = "game";
let startMenu = null;
let game = null;
let endScreen = null;


function run() {
    deltaTime = Date.now() - lastTime;
    lastTime = Date.now();
    if (gameState == "startMenu") {
        gameState = "game";
    } else if (gameState == "game") {
        if (game == null) {
            game = new Game();
            game.initialiseLevel(11);
        }
        game.deltaTime = deltaTime;
        gameState = game.run();
    } else if (gameState == "endScreen") {
        if (game) {
            game = null;
        }
        gameState = "game"
    }

    updateFPS();
    requestAnimationFrame(run);
}

function updateFPS() {
    // update fps counter
    fpses.push(1000 / deltaTime);
    if (fpses.length > 10) {
        fpses.shift();
    }
    fps.innerHTML = Math.round(fpses.reduce((a, b) => a + b) / fpses.length);
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
        if (gameState == "game") {
            game.serveBall();
        } else if (gameState == "startMenu") {
            gameState = "game";
        }
    }
});



// touch buttons
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("buttonContainer");
document.body.appendChild(buttonContainer);

const leftButton = document.createElement("div");
leftButton.className = "controlButton left";
leftButton.innerHTML = "&larr;";
buttonContainer.appendChild(leftButton);

const actionButton = document.createElement("div");
actionButton.className = "controlButton action";
actionButton.innerHTML = "l";
buttonContainer.appendChild(actionButton);

const rightButton = document.createElement("div");
rightButton.className = "controlButton right";
rightButton.innerHTML = "&rarr;";
buttonContainer.appendChild(rightButton);

document.body.appendChild(buttonContainer);


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
    if (gameState == "game") {
        game.serveBall();
    } else if (gameState == "startMenu") {
        gameState = "game";
    }
});




setTimeout(() => {
    requestAnimationFrame(run);
}, 100);