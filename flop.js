var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var bird = {
 x: 50,
 y: 50,
 width: 40,
 height: 40,
 speed: 0,
 image: new Image()
};
bird.image.src = 'bird.jpg'; // Path to the bird image

var pipes = [
 {
 x: 200,
 y: 0,
 width: 50,
 height: 200,
 speed: 2
 }
];

var score = 0;
var touchable = 'ontouchstart' in window;

function start() {
 bird.speed = -5;
}

if (touchable) {
 canvas.addEventListener('touchstart', start);
} else {
 window.addEventListener('click', start);
}
window.onkeydown = function(event) {
 if (event.keyCode === 32) {
 bird.speed = -5;
 }
};

function update() {
 bird.speed += 0.5;
 bird.y += bird.speed;

 for (var i = 0; i < pipes.length; i++) {
 pipes[i].x -= pipes[i].speed;

 if (bird.y > canvas.height || bird.x < pipes[i].x + pipes[i].width && bird.x + bird.width > pipes[i].x &&
   bird.y < pipes[i].y + pipes[i].height && bird.y + bird.height > pipes[i].y) {
   gameOver();
 }

 if (pipes[i].x < 0) {
   pipes.shift();
   pipes.push({
     x: canvas.width,
     y: Math.floor(Math.random() * (canvas.height - 200)),
     width: 50,
     height: 200,
     speed: 2 + Math.floor(Math.random() * 3)
   });
 }
 }
}

function drawBird() {
 ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function draw() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 drawBird();
 drawPipes();
 ctx.fillStyle = 'black';
 ctx.fillText('Score: ' + score, 10, 30);
}


function drawPipes() {
 for (var i = 0; i < pipes.length; i++) {
 ctx.fillStyle = 'green';
 ctx.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);
 }
}



function gameOver() {
 bird.x = 50;
 bird.y = 50;
 bird.speed = 0;

 for (var i = 0; i < pipes.length; i++) {
 pipes[i].x = 200 + i * 200;
 pipes[i].y = 0;
 pipes[i].speed = 2 + i;
 }
}

function gameLoop() {
 update();
 draw();
 requestAnimationFrame(gameLoop);
}

gameLoop();
