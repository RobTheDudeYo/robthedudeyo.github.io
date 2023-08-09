

function main() {
    let container = document.querySelector(".gamePanel");
    const game = new Game(container, levels);
    game.cycleLevels();
}

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
        this.currentLevel = 0;
    }

    cycleLevels() {
        this.loadLevel(this.levels[this.currentLevel]);
        setTimeout(() => {
            this.clearLevel();
            this.currentLevel++;
            if (this.currentLevel > this.levels.length-1) {
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
        this.width = resolution / 5;
        this.height = resolution / 30;
        this.x = (resolution / 2) - (this.width / 2);
        this.y = resolution * 0.85;
        this.element = document.createElement("div");
        this.element.classList = "paddle";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }
}

class Ball {
    constructor(resolution, panel) {
        this.width = resolution / 50;
        this.height = resolution / 50;
        this.x = (resolution / 2) - (this.width / 2);
        this.y = resolution - this.height - (resolution / 5);
        this.element = document.createElement("div");
        this.element.classList = "ball";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }
}

class Block {
    constructor(resolution, x, y, type, panel) {
        this.width = resolution / 10;
        this.height = resolution / 30;
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
}

main();