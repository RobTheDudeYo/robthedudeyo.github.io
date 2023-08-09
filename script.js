

function main() {
    let container = document.querySelector(".gamePanel");
    const game = new Game(container);
    game.updateBlocks(levels[8]);
}

// Y is the row, X is the column!

class Game {
    constructor(container) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.container.style.width = this.resolution + "px";
        this.container.style.height = this.resolution + "px";
        this.paddle = new Paddle(this.resolution);
        this.balls = [new Ball(this.resolution)];
        this.blocks = [[], [], [], [], [], [], [], [], [], []];
    }

    updateBlocks(level) {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 16; y++) {
                this.blocks[x].push(new Block(this.resolution, x, y, level[y][x], this.container));
            }
        }
    }

    clearBlocks() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 16; y++) {
                console.log(this.blocks[x][y].element.classList.remove("block"));
            }
        }
    }


}

class Paddle {
}

class Ball {
}

class Block {
    constructor(resolution, x, y, type, panel) {
        this.width = resolution / 10;
        this.height = resolution / 25;
        this.x = x * this.width
        this.y = (y * this.height) + this.height;
        this.element = document.createElement("div");
        this.element.classList = `block block${type}`;
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        panel.appendChild(this.element);
    }
}

main();