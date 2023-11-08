const gameContainer = document.querySelector('.game-container');
const snake = document.querySelector('.snake');
const food = document.querySelector('.food');

let snakeX = 5;
let snakeY = 5;
let foodX = 10;
let foodY = 10;
let score = 0;
let speed = 1;
let dx = 1; // Initial direction (right)
let dy = 0;

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 15);
    foodY = Math.floor(Math.random() * 15);
    food.style.left = foodX * 20 + 'px';
    food.style.top = foodY * 20 + 'px';
}

function moveSnake() {
    snakeX += dx;
    snakeY += dy;
    snake.style.left = snakeX * 20 + 'px';
    snake.style.top = snakeY * 20 + 'px';

    if (snakeX === foodX && snakeY === foodY) {
        score++;
        speed += 0.2;
        updateFoodPosition();
    }
}

function handleKey(event) {
    // Allow the player to change direction using arrow keys
    if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
    }
}

document.addEventListener('keydown', handleKey);

function autoMoveSnake() {
    moveSnake();
    if (snakeX >= 15 || snakeX < 0 || snakeY >= 15 || snakeY < 0) {
        alert('Game Over! Your Score: ' + score);
        snakeX = 5;
        snakeY = 5;
        score = 0;
        speed = 1;
        dx = 1;
        dy = 0;
        updateFoodPosition();
    }
    requestAnimationFrame(autoMoveSnake);
}

updateFoodPosition();
autoMoveSnake();
