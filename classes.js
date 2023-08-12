



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
        this.currentLevel = 1;
        this.deltaTime = 0;
        this.lastTime = Date.now();
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
        this.velocity = { x: -resolution * 0.0001, y: -resolution * 0.0004 };
        this.element = document.createElement("div");
        this.element.classList = "ball";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    move(paddle, blocks, deltaTime) {
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
        this.collisionCheck(paddle, blocks);
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

    collisionCheck(paddle, blocks) {

        // paddle collision
        if (this.y > paddle.y - this.height && this.y < paddle.y && this.x > paddle.x - this.width && this.x < paddle.x + paddle.width && this.velocity.y > 0) {
            this.velocity.y *= -1;
            this.y += this.velocity.y;
            this.velocity.y *= 1.01;
            return;
        }

        // this current grid location
        let gridX = (Math.floor((this.x + (this.width / 2)) / (this.resolution / 10)));
        let gridY = (Math.floor((this.y + (this.width / 2)) / (this.resolution / 25))) - 1;

        let hit = false;
        // check left
        if (gridY < 15 && gridX > 0) {
            if (blocks[gridX - 1][gridY].type > 0 && this.x < blocks[gridX - 1][gridY].x + blocks[gridX - 1][gridY].width && this.velocity.x < 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                hit = true;
                console.log("hit left")
                if (blocks[gridX - 1][gridY].type < 9) {
                    blocks[gridX - 1][gridY].changeType(blocks[gridX - 1][gridY].type - 1);
                }
            }
        }
        // check right
        if (gridX < 9 && gridY < 15) {
            if (blocks[gridX + 1][gridY].type > 0 && this.x + this.width > blocks[gridX + 1][gridY].x && this.velocity.x > 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                hit = true;
                console.log("hit right")
                if (blocks[gridX + 1][gridY].type < 9) {
                    blocks[gridX + 1][gridY].changeType(blocks[gridX + 1][gridY].type - 1);
                }
            }
        }
        // check above
        if (gridY < 16) {
            if (blocks[gridX][gridY - 1].type > 0 && this.y < blocks[gridX][gridY - 1].y + blocks[gridX][gridY - 1].height && this.velocity.y < 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                hit = true;
                console.log("hit above")
                if (blocks[gridX][gridY - 1].type < 9) {
                    blocks[gridX][gridY - 1].changeType(blocks[gridX][gridY - 1].type - 1);
                }
            }
        }
        // check below
        if (gridY < 15) {
            if (blocks[gridX][gridY + 1].type > 0 && this.y + this.height > blocks[gridX][gridY + 1].y && this.velocity.y > 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                hit = true;
                console.log("hit below")
                if (blocks[gridX][gridY + 1].type < 9) {
                    blocks[gridX][gridY + 1].changeType(blocks[gridX][gridY + 1].type - 1);
                }
            }
        }

        if (hit === false) {
            // check top left
            if (gridX > 0 && gridY > 0 && gridY < 16) {
                if (blocks[gridX - 1][gridY - 1].type > 0 && this.x < blocks[gridX - 1][gridY - 1].x + blocks[gridX - 1][gridY - 1].width && this.y < blocks[gridX - 1][gridY - 1].y + blocks[gridX - 1][gridY - 1].height && this.velocity.x < 0 && this.velocity.y < 0) {
                    this.velocity.x *= -1;
                    this.velocity.y *= -1;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    hit = true;
                    console.log("hit top left")
                    if (blocks[gridX - 1][gridY - 1].type < 9) {
                        blocks[gridX - 1][gridY - 1].changeType(blocks[gridX - 1][gridY - 1].type - 1);
                    }
                }
            }
            // check top right
            if (gridX < 9 && gridY > 0 && gridY < 16) {
                if (blocks[gridX + 1][gridY - 1].type > 0 && this.x + this.width > blocks[gridX + 1][gridY - 1].x && this.y < blocks[gridX + 1][gridY - 1].y + blocks[gridX + 1][gridY - 1].height && this.velocity.x > 0 && this.velocity.y < 0) {
                    this.velocity.x *= -1;
                    this.velocity.y *= -1;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    hit = true;
                    console.log("hit top right")
                    if (blocks[gridX + 1][gridY - 1].type < 9) {
                        blocks[gridX + 1][gridY - 1].changeType(blocks[gridX + 1][gridY - 1].type - 1);
                    }
                }
            }
            // check bottom left
            if (gridX > 0 && gridY < 14) {
                if (blocks[gridX - 1][gridY + 1].type > 0 && this.x < blocks[gridX - 1][gridY + 1].x + blocks[gridX - 1][gridY + 1].width && this.y + this.height > blocks[gridX - 1][gridY + 1].y && this.velocity.x < 0 && this.velocity.y > 0) {
                    this.velocity.x *= -1;
                    this.velocity.y *= -1;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    hit = true;
                    console.log("hit bottom left")
                    if (blocks[gridX - 1][gridY + 1].type < 9) {
                        blocks[gridX - 1][gridY + 1].changeType(blocks[gridX - 1][gridY + 1].type - 1);
                    }
                }
            }
            // check bottom right
            if (gridX < 9 && gridY < 14) {
                if (blocks[gridX + 1][gridY + 1].type > 0 && this.x + this.width > blocks[gridX + 1][gridY + 1].x && this.y + this.height > blocks[gridX + 1][gridY + 1].y && this.velocity.x > 0 && this.velocity.y > 0) {
                    this.velocity.x *= -1;
                    this.velocity.y *= -1;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    hit = true;
                    console.log("hit bottom right")
                    if (blocks[gridX + 1][gridY + 1].type < 9) {
                        blocks[gridX + 1][gridY + 1].changeType(blocks[gridX + 1][gridY + 1].type - 1);
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
        if (type < 0) {
            type = 0;
        }
        this.type = type;
        this.element.classList = `block b${type}`;
    }
}