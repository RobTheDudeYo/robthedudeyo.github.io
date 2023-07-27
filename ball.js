class Ball {
    constructor() {
        // set up the ball
        this.element = document.createElement('div');
        this.element.id = 'ball';
        this.element.style.width = resolution / 25 + 'px';
        this.element.style.height = resolution / 25 + 'px';
        this.element.style.left = (resolution - parseInt(this.element.style.width)) / 2 + 'px';
        this.element.style.top = (resolution - parseInt(this.element.style.height)) / 2 + 'px';
        gamePanel.appendChild(this.element);
        this.ballSize = parseInt(this.element.style.width);
        this.ballX = parseInt(this.element.style.left);
        this.ballY = parseInt(this.element.style.top);
        this.velocityX = resolution / 100;
        this.velocityY = (resolution / 100) + 1;
    }

    move() {
        // move the dot
        this.ballX += this.velocityX;
        this.ballY += this.velocityY;
        // check for collisions
        if ((this.ballX <= 0 && this.velocityX < 0) || (this.ballX >= (resolution - this.ballSize) && this.velocityX > 0)) {
            this.ballX = (this.ballX <= 0 ? 0 : resolution - this.ballSize);
            this.velocityX = -this.velocityX;
        }
        if ((this.ballY <= 0 && this.velocityY < 0) || (this.ballY >= (resolution - this.ballSize) && this.velocityY > 0)) {
            this.ballY = (this.ballY <= 0 ? 0 : resolution - this.ballSize);
            this.velocityY = -this.velocityY;
        }
        // normalise the velocity
        this.velocityMagnitude = (this.velocityX ** 2 + this.velocityY ** 2) ** 0.5;
        this.vx_norm = this.velocityX / this.velocityMagnitude;
        this.vy_norm = this.velocityY / this.velocityMagnitude;

        this.velocityX = this.vx_norm * speed_constant;
        this.velocityY = this.vy_norm * speed_constant;

        this.element.style.left = `${this.ballX}px`;
        this.element.style.top = `${this.ballY}px`;
    }
}