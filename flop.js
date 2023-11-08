
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const bird = {
    x: 50,
    y: canvasHeight / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
};

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    drawBird();

    requestAnimationFrame(gameLoop);
}

gameLoop();
document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "ArrowUp") {
        bird.velocity = -10; // Adjust the jump strength as needed
    }
});
