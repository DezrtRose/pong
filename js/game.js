var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 5;

var leftPaddleY = 150;
var leftPlayerPoints = 0;

var pauseGame = false;

var rightPaddleY = 150;
var rightPlayerPoints = 0;

var aiDifficulty = 7;
var winner = '';

const paddleHeight = 100;
const paddleThickness = 15;
const winningPoints = 5;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	difficultySelector = document.getElementById('difficulty');
	difficultySelector.addEventListener('change', function(evt) {
	console.log(this.value);
		aiDifficulty = 6;
		aiDifficulty = parseInt(this.value) + aiDifficulty;
	});
	
	setInterval(function() {
		moveElements();
		drawElements();
	}, 1000/60);
	
	canvas.addEventListener('mousemove', function(evt) {
		var mousePosition = calculateMousePosition(evt);
		leftPaddleY = mousePosition.y - (paddleHeight/2);
	});
	
	canvas.addEventListener('mousedown', function(evt) {
		leftPlayerPoints = rightPlayerPoints = 0;
		pauseGame = false;
	});
}

function ai() {
	var rightPaddleCenter = rightPaddleY + (paddleHeight/2);
	if(rightPaddleCenter < ballY - 35) {
		rightPaddleY += aiDifficulty;
	} else if(rightPaddleCenter > ballY + 35) {
		rightPaddleY -= aiDifficulty;
	}
}

function moveElements() {
	if(pauseGame) {
		return;
	}
	
	// move the right paddle to chase the ball
	ai();
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	// bounce ball off right wall (30 is the padding)
	if(ballX > canvas.width - paddleThickness) {
		if(ballY > rightPaddleY && ballY < (rightPaddleY + paddleHeight)) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (rightPaddleY + paddleHeight/2);
			ballSpeedY = deltaY * 0.2;
		} else {
			leftPlayerPoints++;
			resetBall();
		}
	}
	
	// bounce ball off left wall (20 is the padding)
	if(ballX < paddleThickness) {
		if(ballY > leftPaddleY && ballY < (leftPaddleY + paddleHeight)) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (leftPaddleY + paddleHeight/2);
			ballSpeedY = deltaY * 0.2;
		} else {
			rightPlayerPoints++;
			resetBall();
		}
	}
	
	// bounce ball off bottom wall
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	
	// bounce ball off top wall
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawElements() {
	/* canvas background */
	drawRect(0, 0, canvas.width, canvas.height, 'black');
	
	if(pauseGame) {
		canvasContext.fillStyle = 'white';
		canvasContext.textAlign = 'center';
		canvasContext.font = '20px Arial';
		canvasContext.fillText(winner + ' wins!!! Click to play again!', canvas.width/2, canvas.height/2);
		return;
	}
	
	drawNet();
	
	/* left paddle */
	drawRect(0, leftPaddleY, paddleThickness, paddleHeight, 'white');
	
	/* right paddle */
	drawRect(canvas.width - paddleThickness, rightPaddleY, paddleThickness, paddleHeight, 'white');
	
	/* ball */
	drawCircle(ballX, ballY, 10, 'white');
	
	// display score	
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'center';
	canvasContext.font = '10px Arial';
	canvasContext.fillText(leftPlayerPoints, 50, 50);
	canvasContext.fillText(rightPlayerPoints, canvas.width - 50, 50);
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		drawRect(canvas.width/2-1,i,2,30,'white');
	}
}

function drawCircle(centerX, centerY, radius, color) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function drawRect(X, Y, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(X, Y, width, height);
}

function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	}
}

function resetBall() {
	if(leftPlayerPoints >= winningPoints || rightPlayerPoints >= winningPoints) {
		winner = (leftPlayerPoints >= winningPoints) ? 'Player 1' : 'Player 2';
		pauseGame = true;
	} 
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}