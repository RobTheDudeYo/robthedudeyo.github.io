

let container = document.querySelector(".gamePanel");
const game = new Game(container, levels);

const fps = document.querySelector(".fps");

let fpses = [];
let gamestate = "game"
function run() {
    if (gamestate == "game") {
        gamestate = game.run();
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


// paddle controls
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

// ball controls
document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        game.serveBall();
    }
});

// touch buttons
// document.querySelector(".left").addEventListener("touchstart", (e) => {
//     if (game.paddle.direction > -1) {
//         game.paddle.direction = -1;
//     }
// });
// document.querySelector(".left").addEventListener("touchend", (e) => {
//     if (game.paddle.direction == -1) {
//         game.paddle.direction = 0;
//     }
// });
// document.querySelector(".right").addEventListener("touchstart", (e) => {
//     if (game.paddle.direction < 1) {
//         game.paddle.direction = 1;
//     }
// });
// document.querySelector(".right").addEventListener("touchend", (e) => {
//     if (game.paddle.direction == 1) {
//         game.paddle.direction = 0;
//     }
// });
// document.querySelector(".action").addEventListener("touchstart", (e) => {
//     game.serveBall();
// });





requestAnimationFrame(run);