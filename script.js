// --- Game Variables ---
const gameContainer = document.getElementById('game-container');
const playerBox = document.getElementById('player-box');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');

const GAME_WIDTH = gameContainer.offsetWidth;
const PLAYER_WIDTH = playerBox.offsetWidth;
const PLAYER_SPEED = 15; // Pixels per key press

let score = 0;
let missedCount = 0;
const MAX_MISSED = 3;

let gameLoopInterval;
let eggSpawnInterval;
let isGameOver = false;

// --- Player Movement ---
function updatePlayerPosition(direction) {
    if (isGameOver) return;
    
    let currentX = playerBox.offsetLeft;
    let newX;

    if (direction === 'left') {
        newX = currentX - PLAYER_SPEED;
    } else if (direction === 'right') {
        newX = currentX + PLAYER_SPEED;
    }

    // Keep the player within the game boundaries
    if (newX >= 0 && newX <= GAME_WIDTH - PLAYER_WIDTH) {
        playerBox.style.left = newX + 'px';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        updatePlayerPosition('left');
    } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        updatePlayerPosition('right');
    } else if (e.key.toLowerCase() === 'r' && isGameOver) {
        // Restart game on 'R' key press when game over
        resetGame();
    }
});

// --- Egg Spawning and Movement ---
function createEgg() {
    const egg = document.createElement('div');
    egg.classList.add('egg');
    
    // Start egg at a random X position
    const startX = Math.random() * (GAME_WIDTH - 20); // 20 is the egg width
    egg.style.left = startX + 'px';
    
    // Give the egg a unique falling speed (between 1 and 3 pixels per frame)
    egg.fallSpeed = 1 + Math.random() * 2; 
    
    gameContainer.appendChild(egg);
    return egg;
}

function updateGame() {
    if (isGameOver) return;

    // Get all eggs currently in the game
    const eggs = gameContainer.querySelectorAll('.egg');

    eggs.forEach(egg => {
        let currentY = egg.offsetTop;
        const newY = currentY + egg.fallSpeed;
        
        egg.style.top = newY + 'px';

        // Check for collision with the bottom or the player
        if (newY >= gameContainer.offsetHeight - playerBox.offsetHeight) {
            
            // Check if the egg hit the ground (missed)
            if (newY >= gameContainer.offsetHeight - egg.offsetHeight) {
                // Remove the egg and increment missed count
                egg.remove();
                missedCount++;
                missedDisplay.textContent = `Missed: ${missedCount} / ${MAX_MISSED}`;
                
                if (missedCount >= MAX_MISSED) {
                    endGame();
                }
                
            } 
            // Check for collision with the player (caught)
            else if (isCollision(egg, playerBox)) {
                egg.remove();
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        }
    });
}

// Simple Axis-Aligned Bounding Box (AABB) Collision Detection
function isCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    // Adjust rects to be relative to the game container
    const containerRect = gameContainer.getBoundingClientRect();

    const e1 = {
        left: rect1.left - containerRect.left,
        right: rect1.right - containerRect.left,
        top: rect1.top - containerRect.top,
        bottom: rect1.bottom - containerRect.top
    };

    const e2 = {
        left: rect2.left - containerRect.left,
        right: rect2.right - containerRect.left,
        top: rect2.top - containerRect.top,
        bottom: rect2.bottom - containerRect.top
    };
    
    // Check if their bounding boxes overlap
    return (
        e1.left < e2.right &&
        e1.right > e2.left &&
        e1.top < e2.bottom &&
        e1.bottom > e2.top
    );
}


// --- Game State Management ---
function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(eggSpawnInterval);
    
    alert(`Game Over! You caught ${score} eggs. Press 'R' to play again!`);
}

function resetGame() {
    // Clear all existing eggs
    gameContainer.querySelectorAll('.egg').forEach(egg => egg.remove());
    
    // Reset counters and state
    score = 0;
    missedCount = 0;
    isGameOver = false;
    scoreDisplay.textContent = `Score: 0`;
    missedDisplay.textContent = `Missed: 0 / ${MAX_MISSED}`;
    
    // Restart loops
    startGame();
}

function startGame() {
    // Game loop (runs 60 times per second for smooth movement)
    gameLoopInterval = setInterval(updateGame, 1000 / 60); 

    // Egg spawning loop (creates a new egg every 1 to 2 seconds)
    eggSpawnInterval = setInterval(() => {
        if (!isGameOver) {
            createEgg();
        }
    }, 1500); // Average spawn time of 1.5 seconds
}

// Start the game when the page loads
startGame();
