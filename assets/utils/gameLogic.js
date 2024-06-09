import { Scoreboard } from './Scoreboard.js';

let gameLoopInterval;
let scoreboard = new Scoreboard();

function startGame(snake, canvas, ctx) {
    gameLoopInterval = setInterval(function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();

        snake.draw(ctx);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + snake.score, 10, 30);
    }, 128);
}

function stopGame(snake) {
    clearInterval(gameLoopInterval);

    let isAnHighscore = scoreboard.checkIfHighScore(snake.score);
    if(isAnHighscore) { scoreboard.handleForm(snake.score) };

    scoreboard.showBestScores();
}

export { startGame, stopGame };