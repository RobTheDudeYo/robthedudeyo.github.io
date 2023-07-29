// set up the game panel
const bestResolutions = [840, 720, 420, 360, 240]
const maxResolution = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * 0.95;
const resolution = bestResolutions.find(res => res <= maxResolution);
let panelWidth = resolution;
let panelHeight = resolution;

class Ball {
    constructor() {
        // set up the ball
        this.element = document.createElement('div');
        this.element.id = 'ball';
        this.element.style.width = resolution / 25 + 'px';
        this.element.style.height = resolution / 25 + 'px';
        this.element.style.left = (resolution - parseInt(this.element.style.width)) / 2 + 'px';
        this.element.style.top = (resolution - parseInt(this.element.style.height)) / 2 + 'px';
        this.ballSize = parseInt(this.element.style.width);
        this.ballX = parseInt(this.element.style.left);
        this.ballY = parseInt(this.element.style.top);
        this.velocityX = resolution / 100;
        this.velocityY = (resolution / 100) + 1;
    }

    move(deltaTime) {
        const scaledVelocityX = this.velocityX * deltaTime;
        const scaledVelocityY = this.velocityY * deltaTime;
        // move the ball
        this.ballX += scaledVelocityX;
        this.ballY += scaledVelocityY;
        // check for collisions
        if ((this.ballX <= 0 && this.velocityX < 0) || (this.ballX >= (resolution - this.ballSize) && this.velocityX > 0)) {
            this.ballX = (this.ballX <= 0 ? 0 : resolution - this.ballSize);
            this.velocityX = -this.velocityX;
        }
        if ((this.ballY <= 0 && this.velocityY < 0) || (this.ballY >= (resolution - this.ballSize) && this.velocityY > 0)) {
            this.ballY = (this.ballY <= 0 ? 0 : resolution - this.ballSize);
            this.velocityY = -this.velocityY;
        }
        // normalise the velocity
        this.velocityMagnitude = (this.velocityX ** 2 + this.velocityY ** 2) ** 0.5;
        this.vx_norm = this.velocityX / this.velocityMagnitude;
        this.vy_norm = this.velocityY / this.velocityMagnitude;

        this.velocityX = this.vx_norm * speed_constant;
        this.velocityY = this.vy_norm * speed_constant;

        this.element.style.left = `${this.ballX}px`;
        this.element.style.top = `${this.ballY}px`;
    }
}
class paddle {
    constructor(gameWidth, gameHeight) {
        this.width = 150;
        this.height = 30;

        this.maxSpeed = 7;
        this.speed = 0;

        this.position = {
            x: gameWidth / 2 - this.width / 2,
            y: gameHeight - this.height - 10
        };
    }

    draw(ctx) {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {
        if (!deltaTime) return;
        this.position.x += this.speed;

        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > 800) this.position.x = 800 - this.width;
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }
}

let speed_constant = 0.5;

let theBall = new Ball();
let thePaddle = new paddle(resolution, resolution);


let gameState = 'start';
let deltaTime = 0;
let lastTime = Date.now();

function mainLoop() {
    if (gameState === 'start') {
        startScreen();
    } else if (gameState === 'game') {
        gameLoop(deltaTime, theBall);
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
        buildStartScreen();
    } else {
        // check for startButton clicks
        document.getElementById('startButton').onclick = () => {
            document.body.removeChild(startPanel);
            lastTime = Date.now();
            gameState = 'game';
        };
    }

    function buildStartScreen() {
        // set up the start screen
        const startPanel = document.createElement('div');
        startPanel.id = 'startPanel';
        startPanel.className = 'panel';
        document.body.appendChild(startPanel);
        startPanel.style.width = resolution + 'px';
        startPanel.style.height = resolution + 'px';
        startPanel.style.top = (window.innerHeight - resolution) / 2 + 'px';
        startPanel.style.left = (window.innerWidth - resolution) / 2 + 'px';
        // set up the start button
        const startButton = document.createElement('div');
        startButton.style.width = resolution / 5 + 'px';
        startButton.style.height = resolution / 10 + 'px';
        startButton.style.top = (resolution - parseInt(startButton.style.height)) / 2 + 'px';
        startButton.style.left = (resolution - parseInt(startButton.style.width)) / 2 + 'px';
        startButton.id = 'startButton';
        const startButtonText = document.createElement('p');
        startButtonText.innerHTML = 'Start';
        startButton.appendChild(startButtonText);
        startPanel.appendChild(startButton);
    }

}

let lives = 3;
function gameLoop(deltaTime, theBall) {
    // if the game window isn't built yet, build it
    if (!document.getElementById('gamePanel')) {
        // set up the game panel
        lives = 3;
        const gamePanel = document.createElement('div');
        gamePanel.id = 'gamePanel';
        gamePanel.className = 'panel';
        document.body.appendChild(gamePanel);
        gamePanel.style.width = resolution + 'px';
        gamePanel.style.height = resolution + 'px';
        gamePanel.style.top = (window.innerHeight - resolution) / 2 + 'px';
        gamePanel.style.left = (window.innerWidth - resolution) / 2 + 'px';
        gamePanel.appendChild(theBall.element);
    } else {
        // run the game
        theBall.move(deltaTime);
        if (lives = 0) {
            gameState = 'end';
        }
    }
}


requestAnimationFrame(mainLoop);
