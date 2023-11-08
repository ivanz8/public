// Define canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Bird properties
const bird = {
    x: 50,
    y: canvasHeight / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
};

// Obstacles (pipes)
const obstacles = [];
const obstacleWidth = 50;
const gap = 100;
const obstacleSpeed = 2;

// Game variables
let score = 0;
let isGameOver = false;

// Function to check for collisions
function checkCollision() {
    // Check if the bird hits the ground
    if (bird.y + bird.radius > canvasHeight) {
        endGame();
    }

    // Check if the bird hits any obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (isColliding(bird, obstacles[i])) {
            endGame();
            break;
        }
    }
}

// Function to check if two objects are colliding (circle-circle collision)
function isColliding(obj1, obj2) {
    const distance = Math.sqrt(
        Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
    );

    return distance < obj1.radius + obj2.radius;
}

// Function to create new obstacles
function createObstacle() {
    const obstacle = {
        x: canvasWidth,
        y: Math.random() * (canvasHeight - gap),
    };
    obstacles.push(obstacle);
}

// Function to update the obstacles' positions and check for collisions
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;

        // Remove obstacles that have gone off the screen
        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// Function to update the score
function updateScore() {
    for (let i = 0; i < obstacles.length; i++) {
        if (bird.x === obstacles[i].x + obstacleWidth) {
            score++;
        }
    }
}

// Function to end the game
function endGame() {
    isGameOver = true;
    // Perform actions to end the game, e.g., stop the game loop, display a game over screen.
    // You can also reset the game for a new playthrough.
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!isGameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        checkCollision();
        updateObstacles();
        updateScore();
        drawBird();

        for (let i = 0; i < obstacles.length; i++) {
            drawObstacle(obstacles[i]);
        }

        requestAnimationFrame(gameLoop);
    } else {
        // Display game over screen with the score.
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", canvasWidth / 2 - 80, canvasHeight / 2 - 20);
        ctx.fillText("Score: " + score, canvasWidth / 2 - 40, canvasHeight / 2 + 20);
    }
    
    // Create new obstacles periodically
    if (score % 100 === 0) {
        createObstacle();
    }
}

// Function to draw the bird
function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Function to draw an obstacle
function drawObstacle(obstacle) {
    ctx.fillStyle = "green";
    ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.y);
    ctx.fillRect(obstacle.x, obstacle.y + gap, obstacleWidth, canvasHeight - obstacle.y - gap);
}

// Event listener for jumping the bird
document.addEventListener("keydown", (event) => {
    if (!isGameOver && (event.key === " " || event.key === "ArrowUp")) {
        bird.velocity = -10; // Adjust the jump strength as needed
    }
});

// Start the game loop and create the first obstacle
gameLoop();
createObstacle(); // Initial obstacle
