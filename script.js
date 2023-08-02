const resolution = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * 0.90;
const grain = resolution / 10000;

let speed_constant = grain * 5;
const ballSize = grain * 400;
let lives = 3;

let balls = [];
let blocks = [];

let gameState = 'start';
let deltaTime = Date.now();
let lastTime = Date.now();

class Ball {
    constructor() {
        // set up the ball
        this.element = document.createElement('div');
        this.element.id = 'ball';
        this.element.style.width = ballSize + 'px';
        this.element.style.height = ballSize + 'px';
        this.element.style.left = 1 + 'px';
        this.element.style.top = 1 + 'px';
        this.x = this.element.offsetLeft;
        this.y = this.element.offsetTop;
        this.velocityX = grain * Math.random() * 100;
        this.velocityY = grain * Math.random() * 100;
    }

    move() {
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
        if ((this.y <= 0 && this.velocityY < 0) || (this.y >= (resolution - ballSize) && this.velocityY > 0)) {
            this.y = (this.y <= 0 ? 0 : resolution - ballSize);
            this.velocityY = -this.velocityY;
        }
        // normalise the velocity
        this.velocityMagnitude = (this.velocityX ** 2 + this.velocityY ** 2) ** 0.5;
        this.vx_norm = this.velocityX / this.velocityMagnitude;
        this.vy_norm = this.velocityY / this.velocityMagnitude;

        this.velocityX = this.vx_norm * speed_constant;
        this.velocityY = this.vy_norm * speed_constant;

    }

    checkCollision(object) {
        // check for collision with the object
        if (this.x + ballSize >= object.x && this.x <= object.x + object.width && this.y + ballSize >= object.y && this.y <= object.y + object.height) {
            // collision detected
            // check if the ball is hitting the top or bottom of the paddle
            if (this.y + ballSize >= object.y && this.y <= object.y + object.height && this.velocityY > 0) {
                // the ball is hitting the top or bottom of the paddle
                this.velocityY = -this.velocityY;
            } else {
                // the ball is hitting the side of the paddle
                this.velocityX = -this.velocityX;
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


function mainLoop() {
    if (gameState === 'start') {
        startScreen();
    } else if (gameState === 'game') {
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
        // set up the start button
        const startButton = document.createElement('div');
        startButton.style.width = grain * 2000 + 'px';
        startButton.style.height = grain * 1000 + 'px';
        startButton.style.top = (resolution - parseInt(startButton.style.height)) / 2 + 'px';
        startButton.style.left = (resolution - parseInt(startButton.style.width)) / 2 + 'px';
        startButton.id = 'startButton';
        const startButtonText = document.createElement('p');
        startButtonText.innerHTML = 'Start';
        startButtonText.style.fontSize = grain * 400 + 'px';
        console.log(startButtonText.style.height)
        startButton.appendChild(startButtonText);
        startPanel.appendChild(startButton);
        document.body.appendChild(startPanel);
        // wait 1ms otherwise the transition doesn't work
        setTimeout(() => {
            startPanel.style.opacity = 1;
        }, 1);
    } else {
        // wait for some interaction
        document.getElementById('startButton').onclick = () => {
            startPanel.style.opacity = 0;
            startPanel.addEventListener("transitionend", () => {
                startPanel.parentNode.removeChild(startPanel);
                gameState = 'game';
            });
        };
    }
}

const thePaddle = new Paddle();

function gameLoop() {
    // if the game window isn't built yet, build it
    if (!document.getElementById('gamePanel')) {
        for (let i = 0; i < 100; i++)
            balls.push(new Ball());
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
        // for ball in balls
        if (balls.length < 1) {
            
        }
        for (let i = 0; i < balls.length; i++) {
            balls[i].move(deltaTime);
            balls[i].checkCollision(thePaddle);
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
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' && currentDirection === -1) {
        currentDirection = 0;
    } else if (event.key === 'ArrowRight' && currentDirection === 1) {
        currentDirection = 0;
    }
});
if (window.innerWidth < window.innerHeight) {
    // Add controls for mobile
    // left button and right button, below the gamePanel
    const leftButton = document.createElement('div');
    leftButton.id = 'leftButton';
    leftButton.className = 'button';
    leftButton.style.width = resolution / 2 + 'px';
    leftButton.style.height = resolution / 2 + 'px';
    leftButton.style.left = (window.innerWidth - resolution) / 2 + 'px';
    leftButton.style.top = resolution + 'px';
    document.body.appendChild(leftButton);

    const rightButton = document.createElement('div');
    rightButton.id = 'rightButton';
    rightButton.className = 'button';
    rightButton.style.width = resolution / 2 + 'px';
    rightButton.style.height = resolution / 2 + 'px';
    rightButton.style.left = ((window.innerWidth - resolution) / 2) + (resolution / 2) + 'px';
    rightButton.style.top = resolution + 'px';
    document.body.appendChild(rightButton);

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

}



requestAnimationFrame(mainLoop);
