

class StartMenu {
    constructor(container) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.score = 0;
        this.title = document.createElement("div");
        this.title.classList.add("startMenuTitle");
        this.title.innerHTML = "Robsanoid";
        this.container.appendChild(this.title);
        this.leaderboard = new Leaderboard(this.container);
        this.buttons = document.createElement("div");
        this.buttons.classList.add("startMenuButtons");
        this.container.appendChild(this.buttons);
        this.optionsButton = document.createElement("div");
        this.optionsButton.classList.add("optionsButton");
        this.optionsButton.innerHTML = "Options";
        this.buttons.appendChild(this.optionsButton);
        this.startButton = document.createElement("div");
        this.startButton.classList.add("startButton");
        this.startButton.innerHTML = "Start";
        this.buttons.appendChild(this.startButton);
        setTimeout(() => {
        this.startButton.addEventListener("touchstart", (e) => {
            gameState = "game";
        });
        this.startButton.addEventListener("click", (e) => {
            gameState = "game";
        });
        }, 1);
    }

    run() {
        return gameState;
    }
}

class Leaderboard {
    constructor(container) {
        this.container = container;
        this.resolution = container.getBoundingClientRect().width < container.getBoundingClientRect().height ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        this.element = document.createElement("div");
        this.element.classList.add("leaderboard");
        this.topText = document.createElement("div");
        this.topText.classList.add("leaderTopText");
        this.topText.innerHTML = "Leaderboard";
        this.element.appendChild(this.topText);
        this.container.appendChild(this.element);
        this.leaders = [
            { name: "Player 1", score: 100 },
            { name: "Player 2", score: 90 },
            { name: "Player 3", score: 80 },
            { name: "Player 4", score: 70 },
            { name: "Player 5", score: 60 },
            { name: "Player 6", score: 50 },
            { name: "Player 7", score: 40 },
            { name: "Player 8", score: 30 },
            { name: "Player 9", score: 20 },
            { name: "Player 10", score: 10 },

        ];
        this.leaders.forEach((leader) => {
            this.element.innerHTML += `<div class="leader">${leader.name}:</div><div class="leaderScore">${leader.score}</div>`;
        });
    }
}