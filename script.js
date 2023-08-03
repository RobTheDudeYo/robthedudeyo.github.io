const resolution = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * 0.90;
const grain = resolution / 10000;

let speed_constant = grain * 5;
const ballSize = grain * 400;
let lives = 3;

const balls = [];
const servingBalls = [];
const blocks = [];

let gameState = 'start';
let deltaTime = Date.now();
let lastTime = Date.now();

class Block {
}

class Ball {
    constructor(vX, vY, x, y) {
        // set up the ball
        this.element = document.createElement('div');
        this.element.id = 'ball';
        this.element.style.width = ballSize + 'px';
        this.element.style.height = ballSize + 'px';
        this.serve = true;
        this.x = x != null ? x : parseInt(Math.random() * resolution);
        this.y = y != null ? y : parseInt(Math.random() * resolution);
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.velocityX = vX != null ? vX : grain * Math.random() * 100;
        this.velocityY = vY != null ? vY : grain * Math.random() * 50 - 5;
    }

    move() {
        if (!this.serve) {
            const scaledVelocityX = (this.velocityX * deltaTime);
            const scaledVelocityY = (this.velocityY * deltaTime);
            // move the ball
            this.x += scaledVelocityX;
            this.y += scaledVelocityY;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;

            // check for collisions
            if ((this.x <= 0 && this.velocityX < 0) || (this.x >= (resolution - ballSize) && this.velocityX > 0)) {
                this.x = (this.x <= 0 ? 0 : resolution - ballSize);
                this.velocityX = -this.velocityX;
            }
            if (this.y <= 0 && this.velocityY < 0) {
                this.y = (this.y <= 0 ? 0 : resolution - ballSize);
                this.velocityY = -this.velocityY;
            } else if (this.y >= (resolution - ballSize) && this.velocityY > 0) {
                // the ball has hit the bottom of the screen
                // remove the element from the DOM and the balls array
                this.serve = true;
                servingBalls.push(this);
                return;
            }
            // normalise the velocity
            this.velocityMagnitude = (this.velocityX ** 2 + this.velocityY ** 2) ** 0.5;
            this.vx_norm = this.velocityX / this.velocityMagnitude;
            this.vy_norm = this.velocityY / this.velocityMagnitude;

            this.velocityX = this.vx_norm * speed_constant;
            this.velocityY = this.vy_norm * speed_constant;
        } else {
            // if the ball is serving, keep it on the paddle
            this.x = thePaddle.x + thePaddle.width / 2 - ballSize / 2;
            this.y = thePaddle.y - ballSize;
            this.velocityX = grain * 10;
            this.velocityY = -(grain * 10);
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    checkCollision(object) {
        // check for collisions with the paddle
        if (object instanceof Paddle) {
            // check for collisions with the top of the paddle only
            if (this.y + ballSize >= object.y && this.y <= object.y + object.height && this.velocityY > 0) {
                if (this.x + ballSize >= object.x && this.x <= object.x + object.width) {
                    this.velocityY = -this.velocityY;
                }
            }
        } else if (object instanceof Block) {
            if (this.y + ballSize >= object.y && this.y <= object.y + object.height) {
                if (this.x + ballSize >= object.x && this.x <= object.x + object.width) {
                    this.y = object.y - ballSize;
                    this.velocityY = -this.velocityY;
                    object.element.remove();
                    blocks.splice(blocks.indexOf(object), 1);
                }
            }
        }
    }
}

class Paddle {
    constructor() {
        this.element = document.createElement('div');
        this.element.id = 'paddle';
        this.element.style.width = grain * 2000 + 'px';
        this.element.style.height = grain * 400 + 'px';
        this.element.style.left = (resolution - parseInt(this.element.style.width)) / 2 + 'px';
        this.element.style.top = resolution - parseInt(this.element.style.height) * 2 + 'px';
        this.width = parseInt(this.element.style.width);
        this.x = parseInt(this.element.style.left);
        this.y = parseInt(this.element.style.top);
        this.width = parseInt(this.element.style.width);
        this.height = parseInt(this.element.style.height);
        this.speed = speed_constant;
        this.direction = 0;
    }

    move() {
        this.direction = currentDirection;
        const scaledVelocityX = (this.speed * deltaTime) * this.direction;
        // move the paddle
        this.x += scaledVelocityX;
        // check for collisions
        if (this.x <= 0) {
            this.x = 0;
        } else if (this.x >= (resolution - this.width)) {
            this.x = resolution - this.width;
        }
        this.element.style.left = `${this.x}px`;
    }
}

const actionButtonText = document.createElement('p');
function mainLoop() {
    if (gameState === 'start') {
        actionButtonText.innerHTML = 'Start';
        startScreen();
    } else if (gameState === 'game') {
        if (servingBalls.length > 0) {
            actionButtonText.innerHTML = 'Serve';
        } else {
            actionButtonText.innerHTML = '';
        }
        gameLoop(deltaTime);
    } else if (gameState === 'end') {
        endScreen();
    }
    deltaTime = Date.now() - lastTime;
    lastTime = Date.now();
    requestAnimationFrame(mainLoop);
}


function startScreen() {
    // if the start screen isn't built yet, build it
    if (!document.getElementById('startPanel')) {
        // set up the start screen
        const startPanel = document.createElement('div');
        startPanel.id = 'startPanel';
        startPanel.className = 'panel';
        startPanel.style.width = resolution + 'px';
        startPanel.style.height = resolution + 'px';
        if (window.innerHeight < window.innerWidth) {
            startPanel.style.top = (window.innerHeight - resolution) / 2 + 'px';
        } else {
            startPanel.style.top = (window.innerWidth - resolution) / 2 + 'px';
        }
        startPanel.style.left = (window.innerWidth - resolution) / 2 + 'px';

        const titleText = document.createElement('h1');
        titleText.id = 'titleText';
        titleText.innerHTML = "Robsanoid";
        titleText.style.fontSize = grain * 2000 + 'px';
        startPanel.appendChild(titleText);

        const pressStart = document.createElement('h2');
        pressStart.id = 'pressStart';
        if (window.innerHeight > window.innerWidth) {
            pressStart.innerHTML = "Press Start";
        } else {
            pressStart.innerHTML = "Press Space";
        }
        pressStart.style.fontSize = grain * 1000 + 'px';
        startPanel.appendChild(pressStart);


        document.body.appendChild(startPanel);
        // wait 1ms otherwise the transition doesn't work
        setTimeout(() => {
            startPanel.style.opacity = 1;
        }, 1);
    }
}

const thePaddle = new Paddle();

function gameLoop() {
    // if the game window isn't built yet, build it
    if (!document.getElementById('gamePanel')) {
        for (let i = 0; i < 3; i++) {
            balls.push(new Ball());
            servingBalls.push(balls[i]);
        }
        lives = 3;
        const gamePanel = document.createElement('div');
        gamePanel.id = 'gamePanel';
        gamePanel.className = 'panel';
        gamePanel.style.width = resolution + 'px';
        gamePanel.style.height = resolution + 'px';
        if (window.innerHeight < window.innerWidth) {
            gamePanel.style.top = (window.innerHeight - resolution) / 2 + 'px';
        } else {
            gamePanel.style.top = (window.innerWidth - resolution) / 2 + 'px';
        }
        gamePanel.style.left = (window.innerWidth - resolution) / 2 + 'px';
        // wait 1ms otherwise the transition doesn't work
        setTimeout(() => {
            for (let i = 0; i < balls.length; i++) {
                gamePanel.appendChild(balls[i].element);
            }
            gamePanel.appendChild(thePaddle.element);
            document.body.appendChild(gamePanel);
            gamePanel.style.opacity = 1;
        }, 1);
    } else {
        // run the game
        thePaddle.move(deltaTime);
        if (balls.length > 0) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].checkCollision(thePaddle);
                for (let j = 0; j < balls.length; j++) {
                    if (i !== j) {
                        balls[i].checkCollision(balls[j]);
                    }
                }
                balls[i].move(deltaTime);
            }
        }
        if (lives < 1) {
            gameState = 'end';
        }
    }
}

// Define a variable to store the current movement direction
let currentDirection = 0;


// Add constrols for desktop
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        currentDirection = -1;
    } else if (event.key === 'ArrowRight') {
        currentDirection = 1;
    }
    else if (event.key === 'Enter' && gameState === 'start') {
        gameState = 'game';
    }
    else if (event.key === ' ') {
        if (servingBalls[0]) {
            servingBalls[0].serve = false;
            servingBalls.shift();
        } else if (gameState === 'start') {
            gameState = 'game';
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' && currentDirection === -1) {
        currentDirection = 0;
    } else if (event.key === 'ArrowRight' && currentDirection === 1) {
        currentDirection = 0;
    }
});


if (window.innerWidth < window.innerHeight) {
    // controls for mobile
    const leftButton = document.createElement('div');
    leftButton.id = 'leftButton';
    leftButton.className = 'button';
    const leftButtonText = document.createElement('p');
    leftButtonText.innerHTML = 'left';
    leftButton.appendChild(leftButtonText);
    leftButton.style.width = resolution * 0.48 + 'px';
    leftButton.style.height = resolution / 4 + 'px';
    leftButton.style.left = (window.innerWidth - resolution) - window.innerWidth * 0.05 + 'px';
    leftButton.style.top = resolution + window.innerWidth * 0.1 + 'px';
    document.body.appendChild(leftButton);

    const rightButton = document.createElement('div');
    rightButton.id = 'rightButton';
    rightButton.className = 'button';
    const rightButtonText = document.createElement('p');
    rightButtonText.innerHTML = 'right';
    rightButton.appendChild(rightButtonText);
    rightButton.style.width = resolution * 0.48 + 'px';
    rightButton.style.height = resolution / 4 + 'px';
    rightButton.style.left = (window.innerWidth - resolution * 0.48) - window.innerWidth * 0.05 + 'px';
    rightButton.style.top = resolution + window.innerWidth * 0.1 + 'px';
    document.body.appendChild(rightButton);

    const actionButton = document.createElement('div');
    actionButton.id = 'actionButton';
    actionButton.className = 'button';

    actionButton.appendChild(actionButtonText);


    actionButton.style.width = resolution + 'px';
    actionButton.style.height = resolution / 4 + 'px';
    actionButton.style.left = (window.innerWidth - resolution) / 2 + 'px';
    actionButton.style.top = (resolution + resolution / 4) + window.innerWidth * 0.15 + 'px';
    document.body.appendChild(actionButton);

    leftButton.addEventListener("touchstart", () => {
        if (currentDirection === 0) {
            currentDirection = -1;
        }
    });

    leftButton.addEventListener("touchend", () => {
        if (currentDirection === -1) {
            currentDirection = 0;
        }
    });

    leftButton.addEventListener("mousedown", () => {
        if (currentDirection === 0) {
            currentDirection = -1;
        }
    });

    leftButton.addEventListener("mouseup", () => {
        if (currentDirection === -1) {
            currentDirection = 0;
        }
    });

    rightButton.addEventListener("touchstart", () => {
        if (currentDirection === 0) {
            currentDirection = 1;
        }
    });

    rightButton.addEventListener("touchend", () => {
        if (currentDirection === 1) {
            currentDirection = 0;
        }
    });

    rightButton.addEventListener("mousedown", () => {
        if (currentDirection === 0) {
            currentDirection = 1;
        }
    });

    rightButton.addEventListener("mouseup", () => {
        if (currentDirection === 1) {
            currentDirection = 0;
        }
    });

    actionButton.addEventListener("touchend", () => {
        if (gameState === 'start') {
            gameState = 'game';

        } else if (servingBalls[0]) {
            servingBalls[0].serve = false;
            servingBalls.shift();
        }
    });

    actionButton.addEventListener("mouseup", () => {
        if (gameState === 'start') {
            gameState = 'game';

        } else if (servingBalls[0]) {
            servingBalls[0].serve = false;
            servingBalls.shift();
        }
    });

}



requestAnimationFrame(mainLoop);
