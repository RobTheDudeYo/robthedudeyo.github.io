



// Y is the row, X is the column!

class Game {
    constructor(container, levels) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.container.style.width = this.resolution + "px";
        this.container.style.height = this.resolution * 0.925 + "px";
        this.paddle = new Paddle(this.resolution, this.container);
        this.balls = [new Ball(this.resolution, this.container, this.paddle, true)];
        this.blocks = [[], [], [], [], [], [], [], [], [], []];
        this.levels = levels;
        this.currentLevel = 11;
        this.deltaTime = 0;
        this.lastTime = Date.now();
    }

    serveBall() {
        if (this.balls[0]) {
            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i].serve()) {
                    return;
                };
            }
        }
    }

    initialise() {
        // initial setup
        this.loadLevel(this.levels[this.currentLevel - 1]);
        // this.cycleLevels();
    }

    run() {
        this.moveEverything();
        // updateUI();
    }


    moveEverything() {
        this.paddle.move(this.deltaTime);
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].move(this.paddle, this.blocks, this.deltaTime)
        }
        for (let i = 0; i < this.balls.length; i++) {
            if (this.balls[i].y > this.resolution) {
                this.balls[i].element.remove();
                this.balls.splice(i, 1);
            }
        }
        if (this.balls.length == 0) {
            this.balls.push(new Ball(this.resolution, this.container, this.paddle, true));
        }
    }

    cycleLevels() {
        // for demonstration purposes
        this.loadLevel(this.levels[this.currentLevel]);
        this.currentLevel++;
        if (this.currentLevel > this.levels.length - 1) {
            this.currentLevel = 0;
        }
        setTimeout(() => {
            this.clearLevel();
            this.cycleLevels();
        }, 1000);
    }

    loadLevel(level) {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 10; x++) {
                this.blocks[x][y] = new Block(this.resolution, x, y, level[y][x], this.container, this.balls, this.paddle);
            }
        }
    }

    clearLevel() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 16; y++) {
                this.blocks[x][y].element.remove();
                this.blocks[x][y] = null;
            }
        }
    }
}

class Paddle {
    constructor(resolution, panel) {
        this.resolution = resolution;
        this.width = this.resolution / 5;
        this.height = this.resolution / 30;
        this.x = (this.resolution / 2) - (this.width / 2);
        this.y = this.resolution * 0.85;
        this.direction = 0;
        this.speed = this.resolution * 0.0004;
        this.element = document.createElement("div");
        this.element.classList = "paddle";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    move(deltaTime) {
        this.x += (this.direction * this.speed) * deltaTime;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.resolution - this.width) {
            this.x = this.resolution - this.width;
        }
        this.element.style.left = this.x + "px";
    }
}

class Ball {
    constructor(resolution, panel, paddle, serving, otherBall) {
        this.resolution = resolution;
        this.width = resolution / 50;
        this.height = resolution / 50;
        this.x = otherBall ? otherBall.x : paddle.x;
        this.y = otherBall ? otherBall.y : paddle.y - this.height;
        this.speed = otherBall ? otherBall.speed : resolution * 0.00025;
        this.velocity = otherBall ? { x: otherBall.velocity.x * 0.9, y: otherBall.velocity.y * 0.9 } : { x: 0, y: 0 };
        this.serving = serving ? serving : false;
        this.element = document.createElement("div");
        this.element.classList = "ball";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    serve() {
        if (this.serving) {
            this.serving = false;
            return true;
        } else {
            return false;
        }
    }

    move(paddle, blocks, deltaTime) {
        this.collisionCheck(paddle, blocks);
        if (!this.serving) {
            this.x += this.velocity.x * deltaTime;
            this.y += this.velocity.y * deltaTime;
            if (this.x < 0 && this.velocity.x < 0 || this.x > this.resolution - this.width && this.velocity.x > 0) {
                this.x = this.x < 0 ? 0 : this.resolution - this.width;
                this.velocity.x *= -1;
            }
            if (this.y < 0 && this.velocity.y < 0) {
                this.y = this.y < 0 ? 0 : (this.resolution * 0.925) - this.height;
                this.velocity.y *= -1;
            }
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
        } else {
            if (this.x < paddle.x + this.width) {
                this.x = paddle.x + this.width;
            }
            else if (this.x > paddle.x + paddle.width - (this.width * 2)) {
                this.x = paddle.x + paddle.width - (this.width * 2);
            }
            this.y = paddle.y - this.height * 0.95;
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
            this.velocity.y = -this.speed * 0.75;
            this.velocity.x = this.speed * (this.x - (paddle.x + (paddle.width / 2))) / (paddle.width / 2);
        }
    }

    adjustedSpeed(paddle) {
        this.speed += this.resolution * 0.00005;
        if (this.speed > this.resolution * 0.0005) {
            this.speed = this.resolution * 0.0005;
        }
        let paddleCenter = paddle.x + (paddle.width / 2);
        let ballCenter = this.x + (this.width / 2);
        let distance = ballCenter - paddleCenter;
        let maxDistance = paddle.width / 2;
        let angle = (distance / maxDistance) * 45;
        this.velocity.x = Math.sin(angle * (Math.PI / 180)) * this.speed;
        this.velocity.y = -Math.cos(angle * (Math.PI / 180)) * this.speed;
        return this.speed;
    }


    collisionCheck(paddle, blocks) {
        // paddle collision
        if (this.y > paddle.y - this.height && this.y < paddle.y && this.x > paddle.x - this.width && this.x < paddle.x + paddle.width && this.velocity.y > 0) {
            // Where the ball hits the paddle dictates how it will bounce off the paddle. If the ball hits the middle, it will bounce off at a sharp angle. If it hits the sides, it will bounce off at a 45 degree angle. And if it hits the very edges of the paddle, it will bounce off at a very shallow angle. https://strategywiki.org/wiki/Arkanoid/Gameplay
            this.speed = this.adjustedSpeed(paddle)
            return;
        }

        // this current grid location
        let gridX = (Math.floor((this.x + (this.width / 2)) / (this.resolution / 10)));
        let gridY = (Math.floor((this.y + (this.width / 2)) / (this.resolution / 25))) - 1;

        let hit = false;
        // check left
        if (gridY > 0 && gridY < 15 && gridX > 0) {
            if (blocks[gridX - 1][gridY].type > 0 && this.x < blocks[gridX - 1][gridY].x + blocks[gridX - 1][gridY].width && this.velocity.x < 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                hit = true;
                if (blocks[gridX - 1][gridY].type < 9) {
                    blocks[gridX - 1][gridY].hit(this);
                }
            }
        }
        // check right
        if (gridX < 9 && gridY > 0 && gridY < 15) {
            if (blocks[gridX + 1][gridY].type > 0 && this.x + this.width > blocks[gridX + 1][gridY].x && this.velocity.x > 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                hit = true;
                if (blocks[gridX + 1][gridY].type < 9) {
                    blocks[gridX + 1][gridY].hit(this);
                }
            }
        }
        // check above
        if (gridY > 0 && gridY < 17) {
            if (blocks[gridX][gridY - 1].type > 0 && this.y < blocks[gridX][gridY - 1].y + blocks[gridX][gridY - 1].height && this.velocity.y < 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                hit = true;
                if (blocks[gridX][gridY - 1].type < 9) {
                    blocks[gridX][gridY - 1].hit(this);
                }
            }
        }
        // check below
        if (gridY < 15) {
            if (blocks[gridX][gridY + 1].type > 0 && this.y + this.height > blocks[gridX][gridY + 1].y && this.velocity.y > 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                hit = true;
                if (blocks[gridX][gridY + 1].type < 9) {
                    blocks[gridX][gridY + 1].hit(this);
                }
            }
        }
        if (!hit) {
            // check top left
            if (gridX > 0 && gridY > 1 && gridY < 16) {
                if (blocks[gridX - 1][gridY - 1].type > 0 && this.x < blocks[gridX - 1][gridY - 1].x + blocks[gridX - 1][gridY - 1].width && this.y < blocks[gridX - 1][gridY - 1].y + blocks[gridX - 1][gridY - 1].height && this.velocity.x < 0 && this.velocity.y < 0) {
                    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                        this.velocity.x *= -1;
                    } else {
                        this.velocity.y *= -1;
                    }
                    if (blocks[gridX - 1][gridY - 1].type < 9) {
                        blocks[gridX - 1][gridY - 1].hit(this);
                    }
                }
            }
            // check top right
            if (gridX < 9 && gridY > 1 && gridY < 16) {
                if (blocks[gridX + 1][gridY - 1].type > 0 && this.x + this.width > blocks[gridX + 1][gridY - 1].x && this.y < blocks[gridX + 1][gridY - 1].y + blocks[gridX + 1][gridY - 1].height && this.velocity.x > 0 && this.velocity.y < 0) {
                    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                        this.velocity.x *= -1;
                    } else {
                        this.velocity.y *= -1;
                    }
                    if (blocks[gridX + 1][gridY - 1].type < 9) {
                        blocks[gridX + 1][gridY - 1].hit(this);
                    }
                }
            }
            // check bottom left
            if (gridX > 0 && gridY < 14) {
                if (blocks[gridX - 1][gridY + 1].type > 0 && this.x < blocks[gridX - 1][gridY + 1].x + blocks[gridX - 1][gridY + 1].width && this.y + this.height > blocks[gridX - 1][gridY + 1].y && this.velocity.x < 0 && this.velocity.y > 0) {
                    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                        this.velocity.x *= -1;
                    } else {
                        this.velocity.y *= -1;
                    }
                    if (blocks[gridX - 1][gridY + 1].type < 9) {
                        blocks[gridX - 1][gridY + 1].hit(this);
                    }
                }
            }
            // check bottom right
            if (gridX < 9 && gridY < 15) {
                if (blocks[gridX + 1][gridY + 1].type > 0 && this.x + this.width > blocks[gridX + 1][gridY + 1].x && this.y + this.height > blocks[gridX + 1][gridY + 1].y && this.velocity.x > 0 && this.velocity.y > 0) {
                    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                        this.velocity.x *= -1;
                    } else {
                        this.velocity.y *= -1;
                    }
                    if (blocks[gridX + 1][gridY + 1].type < 9) {
                        blocks[gridX + 1][gridY + 1].hit(this);
                    }
                }
            }
        }
    }
}


class Block {
    constructor(resolution, x, y, type, panel, balls, paddle) {
        this.resolution = resolution;
        this.width = resolution / 10;
        this.height = resolution / 25;
        this.x = x * this.width
        this.y = (y * this.height) + this.height;
        this.type = type;
        this.balls = balls;
        this.panel = panel;
        this.paddle = paddle;
        this.element = document.createElement("div");
        this.element.classList = `block b${type}`;
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    hit(ball) {
        this.type--;
        if (this.type < 0) {
            type = 0;
        }
        if (this.type == 1) {
            this.balls.push(new Ball(this.resolution, this.panel, this.paddle, false, ball));
            this.balls.push(new Ball(this.resolution, this.panel, this.paddle, false, ball));
        }
        this.element.classList = `block b${this.type}`;
    }
}


