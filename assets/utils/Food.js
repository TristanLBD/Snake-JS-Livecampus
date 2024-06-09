export class Food {
    constructor(snakeScale, canvasWidth, canvasHeight) {
        this.scale = snakeScale;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.generatePosition();
        this.points = 10;
    }

    generatePosition() {
        this.position = {
            x: Math.floor(Math.random() * (this.canvasWidth / this.scale)) * this.scale,
            y: Math.floor(Math.random() * (this.canvasHeight / this.scale)) * this.scale
        };
    }
}