const theGame = document.querySelector('.game');


// Set the width and height of the game, so it fits nicely on any screen and is easily divisible
let width = 0;
if (window.innerWidth > window.innerHeight) {
    width = window.innerHeight * 0.9;
} else {
    width = window.innerWidth * 0.9;
}
width = width - (width % 8);
theGame.style.width = width + 'px';
theGame.style.height = width + 'px';
theGame.style.marginTop = (window.innerHeight - width) / 2 + 'px';

theGame.addEventListener('click', function () {
    console.log('The game was clicked!');
}
);

