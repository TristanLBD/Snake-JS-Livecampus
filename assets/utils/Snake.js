import { SnakeBall } from './SnakeBall.js';
import { Food } from './Food.js';
import { stopGame } from './gameLogic.js';

export class Snake {
    constructor() {
        this.direction = { x: 1, y: 0 };
        this.SnakeBall = SnakeBall;
        this.scale = 20;
        this.body = [];
		this.canvas = document.getElementById('gameCanvas');
        this.position = { x: 200, y: 200 };
        this.food = new Food(this.scale, this.canvas.width, this.canvas.height);
        this.score = 0;
        this.rotation = -90;
        this.headImage = new Image();
        this.headImage.src = "../assets/images/head.png";
        this.AppleImage = new Image();
        this.AppleImage.src = "../assets/images/apple.png";
        this.TailImage = new Image();
        this.TailImage.src = "../assets/images/tail.png";
        this.BodyImage = new Image();
        this.BodyImage.src = "../assets/images/body.png";
        this.TurnImage = new Image();
        this.TurnImage.src = "../assets/images/turn.png";
        this.setMovingKeys();
    }

    update() {
        let pos = {
            x: Math.round(this.position.x / this.scale),
            y: Math.round(this.position.y / this.scale)
        };
        let posF = pos;
        if (this.body.length > 0) {
            posF = {
                x: Math.round(this.body[0].position.x / this.scale),
                y: Math.round(this.body[0].position.y / this.scale)
            };
        }

        // Handle head rotation and mouvement direction
        if (this.direction.x === 1 && (this.body.length === 0 || posF.x <= pos.x)) {
            this.direction = { x: 1, y: 0 };
            this.rotation = -90;
        } else if (this.direction.x === -1 && (this.body.length === 0 || posF.x >= pos.x)) {
            this.direction = { x: -1, y: 0 };
            this.rotation = 90;
        } else if (this.direction.y === 1 && (this.body.length === 0 || posF.y <= pos.y)) {
            this.direction = { x: 0, y: 1 };
            this.rotation = 0;
        } else if (this.direction.y === -1 && (this.body.length === 0 || posF.y >= pos.y)) {
            this.direction = { x: 0, y: -1 };
            this.rotation = 180;
        }
        
        //! Remove the last body segment , then add it back as the skake head
        if (this.body.length > 0) {
            this.body[this.body.length - 1].position = {
                x: this.position.x,
                y: this.position.y
            };
            this.body.unshift(this.body.pop());
        }

        this.position = {
            x: this.position.x + this.direction.x * this.scale,
            y: this.position.y + this.direction.y * this.scale
        };

        // Prevent the snake from going out the game box
        if (this.position.x < 0) {
            this.position.x = this.canvas.width - this.scale;
        } else if (this.position.x >= this.canvas.width) {
            this.position.x = 0;
        } else if (this.position.y < 0) {
            this.position.y = this.canvas.height - this.scale;
        } else if (this.position.y >= this.canvas.height) {
            this.position.y = 0;
        }

        // Check if the snake bite itself
        for (let i = 0; i < this.body.length; i++) {
            if (this.position.x === this.body[i].position.x && this.position.y === this.body[i].position.y) {
                alert("Game Over! Your score is " + this.score);
                stopGame(this);
                return;
            }
        }

        this.checkFood();
    }

    // Check if snake ate the food
    checkFood() {
        if (this.position.x === this.food.position.x && this.position.y === this.food.position.y) {
            this.score += this.food.points;
            this.food.generatePosition();
            this.increaseSize();
        }
    }

    increaseSize() {
        let pos = {
            x: this.position.x,
            y: this.position.y
        };
        let snakeBall = new this.SnakeBall(pos);
        this.body.push(snakeBall);
    }

    setMovingKeys() {
        document.addEventListener('keydown', (e) => {
            if (e.key === "ArrowUp" && this.direction.y !== 1) {
                this.direction = { x: 0, y: -1 };
            } else if (e.key === "ArrowDown" && this.direction.y !== -1) {
                this.direction = { x: 0, y: 1 };
            } else if (e.key === "ArrowLeft" && this.direction.x !== 1) {
                this.direction = { x: -1, y: 0 };
            } else if (e.key === "ArrowRight" && this.direction.x !== -1) {
                this.direction = { x: 1, y: 0 };
            }
        });
    }

    draw(ctx) {
        this.drawRotatedImage(ctx, this.headImage, this.position.x, this.position.y,this.rotation);

        let lastBodyPartCoord;
        for (let i = 0; i < this.body.length; i++) {
            if(i == 0) { lastBodyPartCoord = this.position; }
            else { lastBodyPartCoord = this.body[i - 1].position };

            if(this.body.length - 1 == i) { // Tail
                let tailAngle = this.getAngle(lastBodyPartCoord, this.body[i].position, "tail");
                this.drawRotatedImage(ctx, this.TailImage, this.body[i].position.x, this.body[i].position.y,tailAngle);
            } else {
                // horizontal body
                if(this.body[i].position.y == lastBodyPartCoord.y && this.body[i].position.y == this.body[i + 1].position.y) {
                    ctx.drawImage(this.BodyImage, this.body[i].position.x, this.body[i].position.y, this.scale, this.scale);
                } else {
                    let imageAngle,imageSource;

                    if(this.body[i].position.x == lastBodyPartCoord.x && this.body[i].position.x == this.body[i + 1].position.x) {
                        // Vertical body
                        imageAngle = 90;
                        imageSource = this.BodyImage;
                    } else {
                        // Turning body
                        imageAngle = this.getAngle(lastBodyPartCoord, this.body[i].position, this.body[i + 1].position);
                        imageSource = this.TurnImage;
                    }

                    this.drawRotatedImage(ctx, imageSource, this.body[i].position.x, this.body[i].position.y,imageAngle);
                }
            }
        }
        ctx.drawImage(this.AppleImage, this.food.position.x, this.food.position.y, this.scale, this.scale);
    }

    // Get the snake turning angle
    getAngle(prev, current, next) {
        if (next === "tail") {
            if (prev.x === current.x && prev.y > current.y) {
                return 0;
            }
            if (prev.x === current.x && prev.y < current.y) {
                return 180;
            };
            if (prev.y === current.y && prev.x > current.x) {
                return -90;
            }
                ;
            if (prev.y === current.y && prev.x < current.x) {
                return 90 ;
            }; 
        }


        const dx1 = current.x - prev.x;
        const dy1 = current.y - prev.y;
        const dx2 = next.x - current.x;
        const dy2 = next.y - current.y;
        if ((dx1 < 0 && dy1 === 0 && dx2 === 0 && dy2 > 0) || (dx1 === 0 && dy1 < 0 && dx2 > 0 && dy2 === 0)) { return 90; }
        if ((dx1 > 0 && dy1 === 0 && dx2 === 0 && dy2 < 0) || (dx1 === 0 && dy1 > 0 && dx2 < 0 && dy2 === 0)) { return -90; }
        if ((dx1 === 0 && dy1 < 0 && dx2 < 0 && dy2 === 0) || (dx1 > 0 && dy1 === 0 && dx2 === 0 && dy2 > 0)) { return 180; }
        if ((dx1 < 0 && dy1 === 0 && dx2 === 0 && dy2 < 0) || (dx1 === 0 && dy1 > 0 && dx2 > 0 && dy2 === 0)) { return 0; }
        return null;
    }

    drawRotatedImage(ctx, img, x, y, rotation) {
        ctx.save();
        ctx.translate(x + this.scale / 2, y + this.scale / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.drawImage(img, -this.scale / 2, -this.scale / 2, this.scale, this.scale);
        ctx.restore();
    }
}
