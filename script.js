const version = '0.2.1';

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const resolution = (windowWidth > windowHeight ? windowHeight : windowWidth) * 0.90;
const grain = resolution / 10000;


const balls = [];
const blocks = [];

let score = 0;
let lives = 2;
let multiplier = 1.0;
let gameState = 'start';
let deltaTime = Date.now();
let lastTime = Date.now();


class Block {
    constructor(x, y, type) {
        this.value = 50;
        this.element = document.createElement('div');
        this.x = x * (resolution / 10);
        this.y = y * (resolution / 30) + (resolution / 5);
        this.element.id = 'block';
        this.width = resolution / 10;
        this.height = resolution / 30;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.type = type != null ? type : 0;
    }

}


class Ball {
    constructor(vX, vY, x, y) {
        // set up the ball
        this.element = document.createElement('div');
        this.element.id = 'ball';
        this.speed = grain * 5;
        this.width = grain * 300;
        this.height = grain * 300;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.serve = true;
        this.x = x != null ? x : resolution / 2;
        this.y = y != null ? y : resolution * 0.75;
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

            // check for wall collisions
            if ((this.x <= 0 && this.velocityX < 0) || (this.x >= (resolution - this.width) && this.velocityX > 0)) {
                this.x = (this.x <= 0 ? 0 : resolution - this.width);
                this.velocityX = -this.velocityX;
            }
            if (this.y <= 0 && this.velocityY < 0) {
                this.y = (this.y <= 0 ? 0 : resolution - this.height);
                this.velocityY = -this.velocityY;
            } else if (this.y >= (resolution - this.height) && this.velocityY > 0) {
                // the ball has hit the bottom of the screen
                this.serve = true;
                multiplier = 1.0;
                lives--;
                return;
            }
            // normalise the velocity
            this.velocityMagnitude = (this.velocityX ** 2 + this.velocityY ** 2) ** 0.5;
            this.vx_norm = this.velocityX / this.velocityMagnitude;
            this.vy_norm = this.velocityY / this.velocityMagnitude;

            this.velocityX = this.vx_norm * this.speed;
            this.velocityY = this.vy_norm * this.speed;
        } else {
            // if the ball is serving, keep it on the paddle
            this.x = thePaddle.x + thePaddle.width / 2 - this.width / 2;
            this.y = thePaddle.y - this.height;
            this.velocityX = grain * 5;
            this.velocityY = -(grain * 10);
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    checkCollision(object) {
        // Check for overlap
        if (this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y
        ) {
            // Collision occurred, determine which side
            const overlapLeft = Math.abs(this.x + this.width - object.x);
            const overlapRight = Math.abs(object.x + object.width - this.x);
            const overlapTop = Math.abs(this.y + this.height - object.y);
            const overlapBottom = Math.abs(object.y + object.height - this.y);

            // Find the minimum overlap to determine the side
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft &&
                this.velocityX > 0 ||
                minOverlap === overlapRight &&
                this.velocityX < 0) {
                if (object instanceof Block) {
                    object.element.remove();
                    blocks.splice(blocks.indexOf(object), 1);
                    score += object.value * multiplier;
                    multiplier += 0.1;
                }
                this.velocityX = -this.velocityX;
                this.x += this.velocityX * deltaTime;
                return true;
            } else if (minOverlap === overlapTop &&
                this.velocityY > 0 ||
                minOverlap === overlapBottom &&
                this.velocityY < 0) {
                if (object instanceof Block) {
                    object.element.remove();
                    blocks.splice(blocks.indexOf(object), 1);
                    score += object.value * multiplier;
                    multiplier += 0.1;
                }
                if (object instanceof Paddle) {
                    // Where the ball hits the paddle dictates how it will bounce off the paddle. If the ball hits the middle, it will bounce off at a sharp angle. If it hits the sides, it will bounce off at a 45 degree angle. And if it hits the very edges of the paddle, it will bounce off at a very shallow angle. https://strategywiki.org/wiki/Arkanoid/Gameplay
                    const paddleCenter = object.x + object.width / 2;
                    const ballCenter = this.x + this.width / 2;
                    const distanceFromCenter = ballCenter - paddleCenter;
                    const normalizedDistance = distanceFromCenter / (object.width / 2);
                    const bounceAngle = normalizedDistance * Math.PI / 3;
                    this.velocityX = this.speed * Math.sin(bounceAngle);
                    this.velocityY = -this.speed * Math.cos(bounceAngle);
                    multiplier = 1.0;
                } else {
                    this.velocityY = -this.velocityY;
                    this.y += this.velocityY * deltaTime;
                    return true;
                }
            }
        }
        return false;
    }
}


class Paddle {
    constructor() {
        this.element = document.createElement('div');
        this.element.id = 'paddle';
        this.width = grain * 2000;
        this.height = grain * 400;
        this.x = (resolution - this.width) / 2;
        this.y = resolution - this.height * 2;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.speed = grain * 5;
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
actionButtonText.style.fontSize = grain * 800 + 'px';


function mainLoop() {
    if (gameState === 'start') {
        actionButtonText.innerHTML = 'Start';
        startScreen();
    } else if (gameState === 'game') {
        gameLoop(deltaTime);
        let count
        for (let i = 0; i < balls.length; i++) {
            if (balls[i].serve) {
                count = true;
            }
        }
        if (count) {
            actionButtonText.innerHTML = 'Serve';
        } else {
            actionButtonText.innerHTML = '';
        }
    } else if (gameState === 'end') {
        actionButtonText.innerHTML = 'continue';
        endScreen();
    }
    deltaTime = Date.now() - lastTime;
    lastTime = Date.now();
    requestAnimationFrame(mainLoop);
}

function endScreen() {
    // if the end screen isn't built yet, build it
    if (!document.getElementById('endPanel')) {
        if (document.getElementById('gamePanel')) {
            setTimeout(() => { document.getElementById('gamePanel').remove(); }, 1);
        }
        if (balls.length > 0) {
            balls.forEach(ball => ball.element.remove());
        }
        balls.length = 0;
        if (blocks.length > 0) {
            blocks.forEach(block => block.element.remove());
        }
        blocks.length = 0;
        // set up the end screen
        const endPanel = document.createElement('div');
        endPanel.id = 'endPanel';
        endPanel.className = 'panel';
        endPanel.style.width = resolution + 'px';
        endPanel.style.height = resolution + 'px';
        if (windowHeight < windowWidth) {
            endPanel.style.top = (windowHeight - resolution) / 2 + 'px';
        } else {
            endPanel.style.top = (windowWidth - resolution) / 2 + 'px';
        }
        endPanel.style.left = (windowWidth - resolution) / 2 + 'px';

        const endContainer = document.createElement('div');
        endContainer.id = 'endContainer';
        endContainer.style.width = resolution * 2 + 'px';
        endContainer.style.height = resolution + 'px';
        endPanel.appendChild(endContainer);

        const spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.style.width = resolution + 'px';
        spinner.style.height = resolution + 'px';
        endContainer.appendChild(spinner);

        const scoreText = document.createElement('p');
        scoreText.id = 'endText';
        scoreText.innerHTML = `Score: ${score}`;
        scoreText.style.fontSize = grain * 1000 + 'px';
        scoreText.style.marginTop = resolution * 0.25 + 'px';
        scoreText.style.marginLeft = resolution / 2 + 'px';
        endContainer.appendChild(scoreText);

        const bonusText = document.createElement('p');
        bonusText.id = 'endText';
        let bonus = lives > 0 ? lives * 1000 : 0
        bonusText.innerHTML = `Bonus: ${bonus}<small><small><small> (lives x 1000)</small></small></small>`;
        bonusText.style.fontSize = grain * 500 + 'px';
        bonusText.style.marginTop = resolution * 0.4 + 'px';
        bonusText.style.marginLeft = resolution / 2 + 'px';
        endContainer.appendChild(bonusText);

        const totalText = document.createElement('p');
        totalText.id = 'endText';
        totalText.innerHTML = `Total: ${score + bonus}`;
        totalText.style.fontSize = grain * 1500 + 'px';
        totalText.style.marginTop = resolution * 0.50 + 'px';
        totalText.style.marginLeft = resolution / 2 + 'px';
        endContainer.appendChild(totalText);


        document.body.appendChild(endPanel);
        setTimeout(() => { endPanel.style.opacity = 1; }, 1);
    }
}


function startScreen() {
    // if the start screen isn't built yet, build it
    if (!document.getElementById('startPanel')) {
        if (document.getElementById('endPanel')) {
            setTimeout(() => { document.getElementById('endPanel').remove(); }, 1);
        }
        if (balls.length > 0) {
            balls.forEach(ball => ball.element.remove());
        }
        balls.length = 0;
        if (blocks.length > 0) {
            blocks.forEach(block => block.element.remove());
        }
        blocks.length = 0;
        // set up the start screen
        const startPanel = document.createElement('div');
        startPanel.id = 'startPanel';
        startPanel.className = 'panel';
        startPanel.style.width = resolution + 'px';
        startPanel.style.height = resolution + 'px';
        if (windowHeight < windowWidth) {
            startPanel.style.top = (windowHeight - resolution) / 2 + 'px';
        } else {
            startPanel.style.top = (windowWidth - resolution) / 2 + 'px';
        }
        startPanel.style.left = (windowWidth - resolution) / 2 + 'px';

        const titleText = document.createElement('p');
        titleText.id = 'titleText';
        titleText.innerHTML = `Robsanoid `;
        titleText.style.fontSize = grain * 1800 + 'px';
        startPanel.appendChild(titleText);

        const pressStart = document.createElement('p');
        pressStart.id = 'pressStart';
        if (windowHeight > windowWidth) {
            pressStart.innerHTML = `Press Start<br><br>v${version}`;
        } else {
            pressStart.innerHTML = `Press Space<br><br>v${version}`;
        }
        pressStart.style.fontSize = grain * 1000 + 'px';
        startPanel.appendChild(pressStart);

        document.body.appendChild(startPanel);
        // wait 1ms otherwise the transition doesn't work
        setTimeout(() => { startPanel.style.opacity = 1; }, 1);
    }
}

let thePaddle = new Paddle();

function gameLoop() {
    // if the game window isn't built yet, build it
    if (!document.getElementById('gamePanel')) {
        // setup
        if (document.getElementById('startPanel')) {
            setTimeout(() => { document.getElementById('startPanel').remove(); }, 1);
        }
        lives = 2;
        score = 0;
        const gamePanel = document.createElement('div');
        gamePanel.id = 'gamePanel';
        gamePanel.className = 'panel';
        gamePanel.style.width = resolution + 'px';
        gamePanel.style.height = resolution + 'px';
        if (windowHeight < windowWidth) {
            gamePanel.style.top = (windowHeight - resolution) / 2 + 'px';
        } else {
            gamePanel.style.top = (windowWidth - resolution) / 2 + 'px';
        }
        gamePanel.style.left = (windowWidth - resolution) / 2 + 'px';
        thePaddle = new Paddle();
        gamePanel.appendChild(thePaddle.element);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 6; j++) {
                blocks.push(new Block(i, j));
                gamePanel.appendChild(blocks[blocks.length - 1].element);
            }
        }

        const livesText = document.createElement('p');
        livesText.id = 'livesText';
        livesText.innerHTML = `Lives: ${lives}`;
        livesText.style.fontSize = grain * 350 + 'px';
        livesText.style.left = grain * 100 + 'px';
        livesText.style.bottom = grain * 50 + 'px';
        gamePanel.appendChild(livesText);

        const scoreText = document.createElement('p');
        scoreText.id = 'scoreText';
        scoreText.innerHTML = `Score: ${score}`;
        scoreText.style.fontSize = grain * 350 + 'px';
        scoreText.style.left = grain * 100 + 'px';
        scoreText.style.top = grain * 50 + 'px';
        gamePanel.appendChild(scoreText);

        const multiplierText = document.createElement('p');
        multiplierText.id = 'multiplierText';
        multiplierText.innerHTML = `Multiplier: ${multiplier}`;
        multiplierText.style.fontSize = grain * 350 + 'px';
        multiplierText.style.right = grain * 100 + 'px';
        multiplierText.style.top = grain * 50 + 'px';
        gamePanel.appendChild(multiplierText);

        document.body.appendChild(gamePanel);
        for (let i = 0; i < 1; i++) {
            balls.push(new Ball());
            gamePanel.appendChild(balls[i].element);
        }
        setTimeout(() => { gamePanel.style.opacity = 1; }, 1);// wait 10ms otherwise the transition doesn't work
    } else {
        // run the game
        if (balls.length > 0) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].checkCollision(thePaddle);
                for (let j = 0; j < blocks.length; j++) {
                    if (balls[i].checkCollision(blocks[j])) {
                        break;
                    };
                }
                balls[i].move(deltaTime);
            }
        }
        thePaddle.move(deltaTime);
        if (blocks.length < 1) {
            console.log('you win');
            gameState = 'end';
            return;
        }
        if (lives < 0) {
            gameState = 'end';
            return;
        }
        livesText.innerHTML = `Extra Lives: ${lives}`;
        scoreText.innerHTML = `Score: ${Math.floor(score)}`;
        multiplier = Math.round(multiplier * 10) / 10
        multiplierText.innerHTML = `Multiplier: ${multiplier > 1.1 ? multiplier : 1}`;
    }
}

// Add constrols for desktop
let currentDirection = 0;
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
        if (gameState === 'game') {

            let count = [];
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].serve) {
                    count.push(balls[i]);
                }
            }
            if (count.length > 0) {
                count[0].serve = false;
            }
        }
        else if (gameState === 'start') {
            gameState = 'game';
            return;
        }
        else if (gameState === 'end') {
            gameState = 'start';
            return;
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


if (windowWidth < windowHeight) {
    // controls for mobile
    const leftButton = document.createElement('div');
    leftButton.id = 'leftButton';
    leftButton.className = 'button';
    const leftButtonText = document.createElement('p');
    leftButtonText.style.fontSize = grain * 800 + 'px';
    leftButtonText.innerHTML = 'left';
    leftButton.appendChild(leftButtonText);
    leftButton.style.width = resolution * 0.48 + 'px';
    leftButton.style.height = resolution / 4 + 'px';
    leftButton.style.left = (windowWidth - resolution) - windowWidth * 0.05 + 'px';
    leftButton.style.top = resolution + windowWidth * 0.1 + 'px';
    document.body.appendChild(leftButton);

    const rightButton = document.createElement('div');
    rightButton.id = 'rightButton';
    rightButton.className = 'button';
    const rightButtonText = document.createElement('p');
    rightButtonText.style.fontSize = grain * 800 + 'px';
    rightButtonText.innerHTML = 'right';
    rightButton.appendChild(rightButtonText);
    rightButton.style.width = resolution * 0.48 + 'px';
    rightButton.style.height = resolution / 4 + 'px';
    rightButton.style.left = (windowWidth - resolution * 0.48) - windowWidth * 0.05 + 'px';
    rightButton.style.top = resolution + windowWidth * 0.1 + 'px';
    document.body.appendChild(rightButton);

    const actionButton = document.createElement('div');
    actionButton.id = 'actionButton';
    actionButton.className = 'button';
    actionButton.appendChild(actionButtonText);
    actionButton.style.width = resolution + 'px';
    actionButton.style.height = resolution / 4 + 'px';
    actionButton.style.left = (windowWidth - resolution) / 2 + 'px';
    actionButton.style.top = (resolution + resolution / 4) + windowWidth * 0.15 + 'px';
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

    actionButton.addEventListener("touchend", () => {
        if (gameState === 'game') {
            let count = [];
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].serve) {
                    count.push(balls[i]);
                }
            }
            if (count.length > 0) {
                count[0].serve = false;
            }
        }
        else if (gameState === 'end') {
            gameState = 'start';
            return;
        }
        else if (gameState === 'start') {
            gameState = 'game';
            return;
        }
    });
}

requestAnimationFrame(mainLoop);
