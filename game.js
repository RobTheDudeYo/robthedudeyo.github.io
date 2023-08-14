



// Y is the row, X is the column!

class Game {
    constructor(container, levels) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.container.style.width = this.resolution + "px";
        this.container.style.height = this.resolution + "px";
        this.paddle = new Paddle(this.resolution, this.container);
        this.balls = [new Ball(this.resolution, this.container, this.paddle, true)];
        this.blocks = [[], [], [], [], [], [], [], [], [], [], []];
        this.levels = levels;
        this.currentLevel = 1;
        this.currentLevelBlocks = 0;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 2;
        this.sticky = 0;
        this.deltaTime = 0;
        this.lastTime = Date.now();

        this.hud = new interfaceAndHUD(this.resolution, this);
    }

    initialiseLevel(level) {
        this.currentLevel = level;
        this.loadLevel(this.levels[level - 1]);
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

    floatingText(target, number) {
        let text = document.createElement("div");
        text.classList.add("floatingText");
        text.innerHTML = number;
        text.style.left = (target.x + target.width / 2) + "px";
        text.style.top = (target.y + target.height / 2) + "px";
        this.container.appendChild(text);
        setTimeout(() => {
            text.remove();
        }, 1000);
    }

    markServingBall() {
        if (this.balls[0]) {
            let marker = null;
            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i].serving) {
                    this.balls[i].element.classList.add("serving");
                    marker = i;
                    break;
                };
            }
            if (marker != null) {
                if (marker > 0) {
                    for (let i = 0; i < marker; i++) {
                        this.balls[i].element.classList.remove("serving");
                    }
                    for (let i = marker + 1; i < this.balls.length; i++) {
                        this.balls[i].element.classList.remove("serving");
                    }
                } else {
                    for (let i = 1; i < this.balls.length; i++) {
                        this.balls[i].element.classList.remove("serving");
                    }
                }
            }
        }
    }

    countLooseBalls() {
        let count = 0;
        for (let i = 0; i < this.balls.length; i++) {
            if (this.balls[i].serving == false) {
                count++;
            }
        }
        return count;
    }

    run() {
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].move(this.paddle, this.blocks, this.deltaTime, this)
        }
        for (let i = 0; i < this.balls.length; i++) {
            if (this.balls[i].y > this.resolution) {
                this.balls[i].element.remove();
                this.balls.splice(i, 1);
            }
        }
        this.markServingBall();
        if (this.balls.length == 0) {
            this.lives--;
            if (this.lives < 0) {
                game.container.remove();
                return "end";
            }
            this.multiplier = 1;
            this.balls.push(new Ball(this.resolution, this.container, this.paddle, true));
        } else if (this.countLooseBalls() == 0) {
            this.multiplier = 1;
        }

        if (this.currentLevelBlocks < 1) {
            this.currentLevel++;
            if (this.currentLevel > this.levels.length - 1) {
                game.container.remove();
                return "end";
            }
            this.clearLevel();
            this.loadLevel(this.levels[this.currentLevel - 1]);
            this.balls.push(new Ball(this.resolution, this.container, this.paddle, true));
        }
        this.hud.update(this.score, this.lives, this.multiplier, this.sticky);
        this.paddle.move(this.deltaTime);
        return "game";
    }

    loadLevel(level) {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 11; x++) {
                if (level[y][x] == 1) {
                    level[y][x] += 9;
                }
                this.blocks[x][y] = new Block(this.resolution, x, y, level[y][x], this.container, this.balls, this.paddle);
                if ((level[y][x] > 0 && level[y][x] < 8) || level[y][x] > 9) {
                    this.currentLevelBlocks++;
                }
            } // constructor(resolution, x, y, type, panel, balls, paddle)
        }
    }

    clearLevel() {
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].element.remove();
        }
        this.balls = [];
        for (let x = 0; x < 11; x++) {
            for (let y = 0; y < 16; y++) {
                this.blocks[x][y].element.remove();
                this.blocks[x][y] = null;
            }
        }
        this.currentLevelBlocks = 0;
        this.sticky = 0;
    }
}

class Paddle {
    constructor(resolution, panel) {
        this.resolution = resolution;
        this.width = this.resolution / 5;
        this.height = this.resolution / 30;
        this.x = (this.resolution / 2) - (this.width / 2);
        this.y = this.resolution * 0.75;
        this.direction = 0;
        this.speed = this.resolution * 0.00045;
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
    constructor(resolution, panel, paddle, serving, parentBall, direction) {
        this.resolution = resolution;
        this.width = resolution / 50;
        this.height = resolution / 50;
        this.x = parentBall ? parentBall.x : paddle.x;
        this.y = parentBall ? parentBall.y : paddle.y - this.height;
        this.speed = parentBall ? parentBall.speed : resolution * 0.00025;
        this.velocity = parentBall ? { x: parentBall.velocity.x * direction.x, y: parentBall.velocity.y * direction.y } : { x: 0, y: 0 };
        this.serving = serving ? true : false;
        this.paddleLock = (paddle.width / 2) + resolution * 0.03;
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
            this.element.classList.remove("serving");
            return true;
        } else {
            return false;
        }
    }

    move(paddle, blocks, deltaTime, game) {
        if (!this.serving) {
            this.collisionCheck(paddle, blocks, game, deltaTime);
        } else {
            this.x = paddle.x + this.paddleLock;
            this.y = paddle.y - this.height * 0.95;
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
            this.velocity.y = -this.speed * 0.75;
            this.velocity.x = this.speed * (this.x - (paddle.x + (paddle.width / 2))) / (paddle.width / 2);
        }
    }



    collisionCheck(paddle, blocks, game, deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if (this.x < 0 && this.velocity.x < 0 || this.x > this.resolution - this.width && this.velocity.x > 0) {
            this.velocity.x *= -1;
            this.x += (this.velocity.x * deltaTime) / 2;
            this.y += (this.velocity.y * deltaTime) / 2;
        }
        if (this.y < 0 && this.velocity.y < 0) {
            this.y = this.y < 0 ? paddle.y : (this.resolution * 0.925) - this.height;
        }
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        // paddle collision
        if (this.y > paddle.y - this.height && this.y < paddle.y && this.x > paddle.x - this.width && this.x < paddle.x + paddle.width && this.velocity.y > 0) {
            if (game.sticky) {
                this.paddleLock = this.x - paddle.x;
                this.serving = true;
                if (game.sticky > 0) {
                    game.sticky--;
                }
                return;
            }
            if (game.countLooseBalls() == 1) {
                game.multiplier = 1;
            }
            this.adjustedSpeed(paddle);
            return;
        }

        // this current grid location, so it doesn't have to loop through all the blocks
        // instead it just looks in the spaces around the ball
        let gridX = (Math.floor((this.x + (this.width / 2)) / (this.resolution / 11)));
        let gridY = (Math.floor((this.y + (this.width / 2)) / (this.resolution / 25))) - 1;


        let hit = false;
        // first check current grid location, just in case we missed it otherwise
        if (gridY > 0 && gridY < 16) {
            if ((blocks[gridX][gridY].type > 0 && blocks[gridX][gridY].type < 8) || blocks[gridX][gridY].type > 9) {
                console.log("boop")
                this.velocity.x *= -1;
                this.velocity.y *= -1;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                blocks[gridX][gridY].hit(this, game);
                return;
            }
        }

        // check left
        if (gridY > 0 && gridY < 15 && gridX > 0 && !hit) {
            if (blocks[gridX - 1][gridY].type > 0 && this.x < blocks[gridX - 1][gridY].x + blocks[gridX - 1][gridY].width && this.velocity.x < 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                blocks[gridX - 1][gridY].hit(this, game);
                return;
            }
        }
        // check right
        if (gridX < 10 && gridY > 0 && gridY < 15 && !hit) {
            if (blocks[gridX + 1][gridY].type > 0 && this.x + this.width > blocks[gridX + 1][gridY].x && this.velocity.x > 0) {
                this.velocity.x *= -1;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                blocks[gridX + 1][gridY].hit(this, game);
                return;
            }
        }
        // check above
        if (gridY > 0 && gridY < 17 && !hit) {
            if (blocks[gridX][gridY - 1].type > 0 && this.y < blocks[gridX][gridY - 1].y + blocks[gridX][gridY - 1].height && this.velocity.y < 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                this.x += this.velocity.x;
                blocks[gridX][gridY - 1].hit(this, game);
                return;
            }
        }
        // check below
        if (gridY < 15 && !hit) {
            if (blocks[gridX][gridY + 1].type > 0 &&
                this.y + this.height * 1.1 > blocks[gridX][gridY + 1].y &&
                this.velocity.y > 0) {
                this.velocity.y *= -1;
                this.y += this.velocity.y;
                this.x += this.velocity.x;
                blocks[gridX][gridY + 1].hit(this, game);
                return;
            }
        }
    }

    adjustedSpeed(paddle) {
        this.speed += this.resolution * 0.00001;
        if (this.speed > this.resolution * 0.0005) {
            this.speed = this.resolution * 0.0005;
        }
        let paddleCenter = paddle.x + (paddle.width / 2);
        let ballCenter = this.x + (this.width / 2);
        let distance = ballCenter - paddleCenter;
        let maxDistance = paddle.width / 2;
        let angle = (distance / maxDistance) * 50;
        this.velocity.x = Math.sin(angle * (Math.PI / 180)) * this.speed;
        this.velocity.y = -Math.cos(angle * (Math.PI / 180)) * this.speed;
    }

    speedIncrease() {
        this.speed += this.resolution * 0.00001;
        if (this.speed > this.resolution * 0.0005) {
            this.speed = this.resolution * 0.0005;
        }
        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
    }
}


class Block {
    constructor(resolution, x, y, type, panel, balls, paddle) {
        this.resolution = resolution;
        this.width = resolution / 11;
        this.height = resolution / 25;
        this.x = x * this.width
        this.y = (y * this.height) + this.height;
        this.type = type;
        this.subtype = type == 10 ? 1 : 0;
        this.balls = balls;
        this.panel = panel;
        this.paddle = paddle;
        this.element = document.createElement("div");
        this.element.classList = `block b${type + this.subtype}`;
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }

    hit(ball, game) {
        ball.speedIncrease();
        if (this.type != 9) {
            game.score += (game.multiplier + game.currentLevel) * 10;
            game.floatingText(this, Math.floor((game.multiplier + game.currentLevel) * 10) * 10)
            game.multiplier += 0.1;
            game.multiplier = Math.round(game.multiplier * 100) / 100;
        }
        // 1 - normal block
        // 2 - double points
        // 3 - sticky
        // 4 - multiball
        // 5 - fast
        // 6 - wide
        // 7 - narrow
        // 8 - slow
        // 9 - unbreakable

        if (this.type == 10) {
            // normal block
            this.subtype--;
            if (this.subtype < 1) {
                game.currentLevelBlocks--;
                this.type = 0;
                this.subtype = 0;
            }
        } else if (this.type == 2) {
            // double points
            game.multiplier += 1;
            game.multiplier = Math.round(game.multiplier * 100) / 100;
            game.currentLevelBlocks -= 1;
            this.type = 0;
        } else if (this.type == 3) {
            // sticky
            game.sticky += 3;
            game.currentLevelBlocks -= 1;
            this.type = 0;
        } else if (this.type == 4) {
            // multiball
            this.balls.push(new Ball(this.resolution, this.panel, this.paddle, false, ball, { x: -1, y: 1 }));
            this.balls.push(new Ball(this.resolution, this.panel, this.paddle, false, ball, { x: 1, y: -1 }));
            game.currentLevelBlocks -= 1;
            this.type = 0;
        } else if (this.type == 5) {
            game.currentLevelBlocks -= 1;
            this.type = 0;
        } else if (this.type == 6) {
            game.currentLevelBlocks -= 1;
            this.type = 0;
        } else if (this.type == 7) {
            game.currentLevelBlocks -= 1;
            this.type = 0;
        }
        this.element.classList = `block b${this.type + this.subtype}`;
    }
}


class interfaceAndHUD {
    constructor(resolution, game) {
        this.resolution = resolution;
        this.game = game;
        this.panel = document.createElement("div");
        this.panel.classList = "interface panel";
        this.game.container.appendChild(this.panel);
        this.game = game;
        this.score = document.createElement("div");
        this.score.classList = "interface score";
        this.score.innerHTML = "Score: " + this.game.score;
        this.panel.appendChild(this.score);
        this.multiplier = document.createElement("div");
        this.multiplier.classList = "interface multiplier";
        this.multiplier.innerHTML = "X " + this.game.multiplier;
        this.panel.appendChild(this.multiplier);
        this.level = document.createElement("div");
        this.level.classList = "interface level";
        this.level.innerHTML = "Level: " + this.game.currentLevel;
        this.panel.appendChild(this.level);
    }

    update() {
        this.score.innerHTML = `Score: ${(this.game.score * 10).toFixed(0)}`;
        this.multiplier.innerHTML = `X ${this.game.multiplier.toFixed(2)}`;
        this.level.innerHTML = `Level: ${this.game.currentLevel}`;
    }
}