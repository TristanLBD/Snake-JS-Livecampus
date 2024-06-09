import { Snake } from './Snake.js';
import { startGame, stopGame } from './gameLogic.js';

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = new Snake();

document.getElementById('replayButton').addEventListener('click', () => {
    stopGame(snake);
    snake = new Snake();
    startGame(snake, canvas, ctx);
});

startGame(snake, canvas, ctx);