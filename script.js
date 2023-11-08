const gameContainer = document.querySelector('.game-container');
const snake = document.querySelector('.snake');
const food = document.querySelector('.food');

let snakeX = 10;
let snakeY = 10;
let foodX = 5;
let foodY = 5;
let score = 0;
let speed = 1;

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 15);
    foodY = Math.floor(Math.random() * 15);
    food.style.left = foodX * 20 + 'px';
    food.style.top = foodY * 20 + 'px';
}

function moveSnake() {
    snakeX += speed;
    snake.style.left = snakeX * 20 + 'px';
    snake.style.top = snakeY * 20 + 'px';

    if (snakeX === foodX && snakeY === foodY) {
        score++;
        speed += 0.5;
        updateFoodPosition();
    }
}

function gameLoop() {
    moveSnake();
    if (snakeX >= 15 || snakeX < 0 || snakeY >= 15 || snakeY < 0) {
        alert('Game Over! Your Score: ' + score);
        snakeX = 10;
        snakeY = 10;
        score = 0;
        speed = 1;
        updateFoodPosition();
    }
    requestAnimationFrame(gameLoop);
}

updateFoodPosition();
gameLoop();
