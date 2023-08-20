

const fps = document.querySelector(".fps");
let fpses = [];

let container = document.querySelector(".panel");

let deltaTime = 0;
let lastTime = Date.now();

let gameState = "startMenu";
let startMenu = null;
let game = null;
let endScreen = null;

// game.initialiseLevel(11);

function run() {
    deltaTime = Date.now() - lastTime;
    if (gameState == "startMenu") {
        if (!startMenu) {
            if (game) {
                game.container.innerHTML = "";
                game = null;
            }
            if (endScreen) {
                endScreen.container.innerHTML = "";
                endScreen = null;
            }
            startMenu = new StartMenu(container);
        } else {
            gameState = startMenu.run();
        }
    } else if (gameState == "game") {
        if (!game) {
            if (startMenu) {
                startMenu.container.innerHTML = "";
                startMenu = null;
            };
            game = new Game(container, levels);
            game.initialiseLevel(11);
        }
        game.deltaTime = deltaTime;
        gameState = game.run();
    } else if (gameState == "endScreen") {
        gameState = "startMenu";
    }

    // update fps counter
    fpses.push(1000 / deltaTime);
    if (fpses.length > 10) {
        fpses.shift();
    }
    fps.innerHTML = Math.round(fpses.reduce((a, b) => a + b) / fpses.length) + " fps";

    lastTime = Date.now();
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
leftButton.innerHTML = "&larr;";
buttonContainer.appendChild(leftButton);

const actionButton = document.createElement("div");
actionButton.className = "controlButton action";
actionButton.innerHTML = "&#x1F3AF;";
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
    game.serveBall();
});




setTimeout(() => {
    requestAnimationFrame(run);
}, 1);