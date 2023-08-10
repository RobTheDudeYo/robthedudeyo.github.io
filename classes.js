



// Y is the row, X is the column!

class Game {
    constructor(container, levels) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.container.style.width = this.resolution + "px";
        this.container.style.height = this.resolution + "px";
        this.paddle = new Paddle(this.resolution, this.container);
        this.balls = [new Ball(this.resolution, this.container)];
        this.blocks = [[], [], [], [], [], [], [], [], [], []];
        this.levels = levels;
        this.currentLevel = 8;
        this.deltaTime = 0;
        this.lastTime = Date.now();
    }

    initialise() {
        // initial setup
        this.loadLevel(this.levels[this.currentLevel]);
    }

    run() {
        this.doCollisions();
        this.moveEverything();
        // updateUI();
    }

    doCollisions() {
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].collisionCheck(this.paddle, this.blocks, this.deltaTime);
        }
    }

    moveEverything() {
        this.paddle.move(this.deltaTime);
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].move(this.deltaTime)
        }
    }

    cycleLevels() {
        // for demonstration purposes
        this.loadLevel(this.levels[this.currentLevel]);
        setTimeout(() => {
            this.clearLevel();
            this.currentLevel++;
            if (this.currentLevel > this.levels.length - 1) {
                this.currentLevel = 0;
            }
            this.cycleLevels();
        }, 1000);
    }

    loadLevel(level) {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 16; y++) {
                this.blocks[x][y] = new Block(this.resolution, x, y, level[y][x], this.container);
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
        this.speed = this.resolution * 0.0005;
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
    constructor(resolution, panel) {
        this.resolution = resolution;
        this.width = resolution / 50;
        this.height = resolution / 50;
        this.x = (resolution / 2) - (this.width / 2);
        this.y = resolution - this.height - (resolution / 5);
        this.velocity = { x: 0.3, y: -0.3 };
        this.element = document.createElement("div");
        this.element.classList = "ball";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    move(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if (this.x < 0 && this.velocity.x < 0 || this.x > this.resolution - this.width && this.velocity.x > 0) {
            this.x = this.x < 0 ? 0 : this.resolution - this.width;
            this.velocity.x *= -1;
        }
        if (this.y < 0 && this.velocity.y < 0 || this.y > this.resolution - this.height && this.velocity.y > 0) {
            this.y = this.y < 0 ? 0 : this.resolution - this.height;
            this.velocity.y *= -1;
        }
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

    collisionCheck(paddle, blocks, deltaTime) {
        if (this.y > paddle.y - this.height && this.y < paddle.y && this.x > paddle.x - this.width && this.x < paddle.x + paddle.width && this.velocity.y > 0) {
            this.velocity.y *= -1;
        }
        // this current grid location
        let gridX = (Math.floor((this.x + (this.width / 2)) / (this.resolution / 10)));
        let gridY = (Math.floor((this.y + (this.width / 2)) / (this.resolution / 25)));

        let the4Blocks = [];
        if (gridX > 0 && gridY < 15) {
            the4Blocks.push(blocks[gridX - 1][gridY]);
        }
        if (gridX < 9 && gridY < 15) {
            the4Blocks.push(blocks[gridX + 1][gridY]);
        }
        if (gridY > 0 && gridY < 15) {
            the4Blocks.push(blocks[gridX][gridY - 1]);
        }
        if (gridY < 15) {
            the4Blocks.push(blocks[gridX][gridY + 1]);
        }

        if (the4Blocks[0] != undefined) {
            for (let i = 0; i < the4Blocks.length; i++) {
                let block = the4Blocks[i];
                if (this.x < block.x + block.width &&
                    this.x + this.width > block.x &&
                    this.y < block.y + block.height &&
                    this.y + this.height > block.y &&
                    block.type > 0
                ) {
                    // determine which side of the block the ball hit, top, left, bottom or right
                    let overlapLeft = this.x + this.width - block.x;
                    let overlapRight = block.x + block.width - this.x;
                    let overlapTop = this.y + this.height - block.y;
                    let overlapBottom = block.y + block.height - this.y;

                    let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                    // only change the velocity of the ball if the side of the block it hit is the closest to the ball
                    if (minOverlap === overlapTop && this.velocity.y > 0 || minOverlap === overlapBottom && this.velocity.y < 0) {
                        console.log("hit top or bottom");
                        if (block.type > 0) {
                            if (block.type != 9) {
                                block.changeType(block.type - 1);
                            }
                            this.velocity.y *= -1;
                        }
                    }
                    if (minOverlap === overlapLeft && this.velocity.x > 0 || minOverlap === overlapRight && this.velocity.x < 0) {
                        console.log("hit left or right");
                        if (block.type > 0) {
                            if (block.type != 9) {
                                block.changeType(block.type - 1);
                            }
                            this.velocity.x *= -1;
                        }
                    }
                }
            }
        }
    }
}


class Block {
    constructor(resolution, x, y, type, panel) {
        this.width = resolution / 10;
        this.height = resolution / 25;
        this.x = x * this.width
        this.y = (y * this.height) + this.height;
        this.type = type;
        this.element = document.createElement("div");
        this.element.classList = `block b${type}`;
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    changeType(type) {
        this.type = type;
        this.element.classList = `block b${type}`;
    }
}