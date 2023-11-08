var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var bird = {
 x: 50,
 y: 50,
 width: 20,
 height: 20,
 speed: 0
};

var pipe = {
 x: 200,
 y: 0,
 width: 50,
 height: 200,
 speed: 2
};

window.onkeydown = function(event) {
 if (event.keyCode === 32) {
   bird.speed = -5;
 }
};

function update() {
 bird.speed += 0.5;
 bird.y += bird.speed;

 pipe.x -= pipe.speed;

 if (bird.y > canvas.height || bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
   bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) {
   gameOver();
 }
}

function draw() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);

 ctx.fillStyle = 'yellow';
 ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

 ctx.fillStyle = 'green';
 ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
}

function gameOver() {
 bird.x = 50;
 bird.y = 50;
 bird.speed = 0;

 pipe.x = 200;
 pipe.y = 0;
 pipe.speed = 2;
}

function gameLoop() {
 update();
 draw();
 requestAnimationFrame(gameLoop);
}

gameLoop();
