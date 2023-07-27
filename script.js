// set up the game panel
const gamePanel = document.getElementById('gamePanel');
const bestResolutions = [840, 720, 420, 360, 240]
const maxResolution = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * 0.95;
const resolution = bestResolutions.find(res => res <= maxResolution);
gamePanel.style.width = resolution + 'px';
gamePanel.style.height = resolution + 'px';
gamePanel.style.top = (window.innerHeight - resolution) / 2 + 'px';
gamePanel.style.left = (window.innerWidth - resolution) / 2 + 'px';
let panelWidth = gamePanel.style.width;
let panelHeight = gamePanel.style.height;

const speed_constant = 10;

let theBall = new Ball();

// listen for clicks on the game panel
gamePanel.addEventListener('click', function () {
    console.log('The game was clicked!');
}
);

function mainLoop() {

    theBall.move();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
