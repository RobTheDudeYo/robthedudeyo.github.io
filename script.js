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

// set up the ball
const theBall = document.createElement('div');
theBall.id = 'ball';
theBall.style.width = resolution / 25 + 'px';
theBall.style.height = resolution / 25 + 'px';
theBall.style.left = (resolution - parseInt(theBall.style.width)) / 2 + 'px';
theBall.style.top = (resolution - parseInt(theBall.style.height)) / 2 + 'px';
gamePanel.appendChild(theBall);
let ballSize = parseInt(theBall.style.width);
let ballX = parseInt(theBall.style.left);
let ballY = parseInt(theBall.style.top);
let velocityX = resolution / 100;
let velocityY = (resolution / 100) + 1;

// listen for clicks on the game panel
gamePanel.addEventListener('click', function () {
    console.log('The game was clicked!');
}
);

function main() {

    // check for collisions
    if ((ballX <= 0 && velocityX < 0) || (ballX >= (resolution - ballSize) && velocityX > 0)) {
        console.log(ballX, ballY);
        velocityX = -velocityX;
    }
    if ((ballY <= 0 && velocityY < 0) || (ballY >= (resolution - ballSize) && velocityY > 0)) {
        console.log(ballX, ballY);
        velocityY = -velocityY;
    }

    // move the dot
    ballX += velocityX;
    ballY += velocityY;
    theBall.style.left = `${ballX}px`;
    theBall.style.top = `${ballY}px`;

    requestAnimationFrame(main);

}

requestAnimationFrame(main);

// I presume this means 60fps?
// setInterval(main, 1000 / 60);