const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const scoreElement = document.querySelector(".score");
const gameOverElement = document.getElementById("game-over");

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const EMPTY = "#000";

// Tetrominoes mit zufälligen Farben
const SHAPES = [
[],
[[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z


];

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const COLORS = [
    EMPTY,
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor()
];

let board = [];
let currentShape;
let currentRow;
let currentCol;
let score = 0;
let gameInterval;
let speed = 500; // Anfangsgeschwindigkeit (500 ms pro Schritt)
let maxSpeed = 100; // Maximale Geschwindigkeit
let speedIncrement = 50; // Erhöhung der Geschwindigkeit pro Punkt


function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = "#222";
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            drawSquare(col, row, board[row][col]);
        }
    }
}

function drawShape() {
    for (let row = 0; row < currentShape.length; row++) {
        for (let col = 0; col < currentShape[row].length; col++) {
            if (currentShape[row][col]) {
                drawSquare(currentCol + col, currentRow + row, COLORS[currentShape[row][col]]);
            }
        }
    }
}

function canMoveTo(row, col, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) {
                continue;
            }
            const newRow = row + r;
            const newCol = col + c;
            if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLUMNS || board[newRow][newCol] !== EMPTY) {
                return false;
            }
        }
    }
    return true;
}

function rotateShape(shape) {
    const newShape = [];
    const rows = shape.length;
    const cols = shape[0].length;
    for (let col = 0; col < cols; col++) {
        newShape[col] = [];
        for (let row = 0; row < rows; row++) {
            newShape[col][row] = shape[row][cols - col - 1];
        }
    }
    return newShape;
}

function clearBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
}

function placeShape() {
    for (let row = 0; row < currentShape.length; row++) {
        for (let col = 0; col < currentShape[row].length; col++) {
            if (currentShape[row][col]) {
                const newRow = currentRow + row;
                const newCol = currentCol + col;
                board[newRow][newCol] = COLORS[currentShape[row][col]];
            }
        }
    }
}

function checkLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== EMPTY)) {
            board.splice(row, 1);
            board.unshift(Array(COLUMNS).fill(EMPTY));
            linesCleared++;
        }
    }
    return linesCleared;
}

function updateScore(linesCleared) {
    if (linesCleared > 0) {
        score += linesCleared * 100;
        // Erhöhe die Geschwindigkeit basierend auf der Punktzahl
        if (speed > maxSpeed) {
            speed -= speedIncrement;
        }
    }
    scoreElement.textContent = "Score: " + score;
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverElement.style.display = "block";
}

function startGame() {
    clearBoard();
    score = 0;
    currentRow = 0;
    currentCol = Math.floor(COLUMNS / 2) - 1;
    currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    if (!canMoveTo(currentRow, currentCol, currentShape)) {
        gameOver();
        return;
    }
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(update, speed); // Verwende die Geschwindigkeit
    gameOverElement.style.display = "none";
}

function update() {
    if (canMoveTo(currentRow + 1, currentCol, currentShape)) {
        currentRow++;
    } else {
        placeShape();
        const linesCleared = checkLines();
        updateScore(linesCleared);
        currentRow = 0;
        currentCol = Math.floor(COLUMNS / 2) - 1;
        currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        if (!canMoveTo(currentRow, currentCol, currentShape)) {
            gameOver();
            return;
        }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawShape();
}

document.addEventListener("keydown", (event) => {
if (event.key === "a" || event.key === "A") {
if (canMoveTo(currentRow, currentCol - 1, currentShape)) {
currentCol--;
}
} else if (event.key === "d" || event.key === "D") {
if (canMoveTo(currentRow, currentCol + 1, currentShape)) {
currentCol++;
}
} else if (event.key === "s" || event.key === "S") {
if (canMoveTo(currentRow + 1, currentCol, currentShape)) {
currentRow++;
}
} else if (event.key === "w" || event.key === "W") {
const rotatedShape = rotateShape(currentShape);
if (canMoveTo(currentRow, currentCol, rotatedShape)) {
currentShape = rotatedShape;
}
} else if (event.key === "Pause") {
// Füge hier deine Pause-Logik hinzu
}
});


startButton.addEventListener("click", startGame);

startGame();


pauseButton.addEventListener("click", () => {
    if (isPaused) {
        isPaused = false;
        gameInterval = setInterval(update, speed);
        pauseButton.textContent = "Pause";
    } else {
        isPaused = true;
        clearInterval(gameInterval);
        pauseButton.textContent = "Resume";
    }
});



