// --- Game Variables ---
const gameContainer = document.getElementById('game-container');
const playerBox = document.getElementById('player-box');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const playerSlider = document.getElementById('player-slider');

const GAME_WIDTH = gameContainer.offsetWidth;
// Updated constants for larger player size:
const PLAYER_WIDTH = 140; 
const PLAYER_HEIGHT = 160; 
const EGG_HEIGHT = 25; 

let score = 0;
let missedCount = 0;
const MAX_MISSED = 3;
let gameLoopInterval;
let eggSpawnInterval;
let isGameOver = false;

// --- Player Movement (Slider Control) ---

playerSlider.addEventListener('input', (e) => {
    if (!isGameOver) {
        // Direct control of player's horizontal position using the slider value
        playerBox.style.left = `${e.target.value}px`;
    }
});

// Keydown for 'R' (Restart only)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && isGameOver) {
        resetGame();
    }
});

// --- Egg Spawning and Movement ---
function createEgg() {
    const egg = document.createElement('div');
    egg.classList.add('egg');
    
    // Start egg at a random X position
    const startX = Math.random() * (GAME_WIDTH - 20); 
    egg.style.left = startX + 'px';
    
    // Give the egg a unique falling speed (between 1.5 and 3 pixels per frame)
    egg.fallSpeed = 1.5 + Math.random() * 1.5; 
    
    gameContainer.appendChild(egg);
    return egg;
}

function updateGame() {
    if (isGameOver) return;

    const eggs = gameContainer.querySelectorAll('.egg');

    // Define the vertical boundaries
    const catchingZoneTop = gameContainer.offsetHeight - PLAYER_HEIGHT;
    const missingLine = gameContainer.offsetHeight - EGG_HEIGHT;

    eggs.forEach(egg => {
        let currentY = egg.offsetTop;
        const newY = currentY + egg.fallSpeed;
        
        // Move the egg
        egg.style.top = newY + 'px';

        // Check if the egg is in the catching/missing zone
        if (newY >= catchingZoneTop) {
            
            // 1. Check for collision/catch (Alignment-based auto-grab)
            if (newY <= catchingZoneTop + PLAYER_HEIGHT && isCollision(egg, playerBox)) {
                
                egg.remove();
                score++;
                scoreDisplay.textContent = `${score}`;
                
            } 
            
            // 2. Check if the egg hit the ground (missed)
            else if (newY >= missingLine) {
                
                // Remove the egg and increment missed count
                egg.remove();
                missedCount++;
                updateMissedDisplay();
                
                if (missedCount >= MAX_MISSED) {
                    endGame();
                }
            }
        }
    });
}

// Simplified Alignment-Based Collision Check
function isCollision(element1, element2) {
    const eggX = element1.offsetLeft;
    const eggWidth = element1.offsetWidth;
    
    const playerX = element2.offsetLeft;
    const playerWidth = element2.offsetWidth;
    
    // Check for horizontal overlap
    const horizontalOverlap = (
        eggX < playerX + playerWidth &&
        eggX + eggWidth > playerX
    );
    
    return horizontalOverlap;
}


// --- Game State Management ---

function updateMissedDisplay() {
    let missedText = '';
    // Show 'X' for missed, 'EGG' for remaining lives
    for (let i = 0; i < MAX_MISSED; i++) {
        if (i < missedCount) {
            missedText += ' ❌'; 
        } else {
            missedText += ' 🥚'; 
        }
    }
    missedDisplay.textContent = missedText.trim();
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(eggSpawnInterval);
    
    // Display the score on the overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 1;
    infoOverlay.style.pointerEvents = 'auto';
    
    infoOverlay.querySelector('p:first-child').innerHTML = `GAME OVER! Final Score: ${score}`;
    infoOverlay.querySelector('p:last-child').textContent = `Press R to restart.`;
}

function resetGame() {
    // Clear all existing eggs
    gameContainer.querySelectorAll('.egg').forEach(egg => egg.remove());
    
    // Reset counters and state
    score = 0;
    missedCount = 0;
    isGameOver = false;
    scoreDisplay.textContent = `0`;
    updateMissedDisplay();
    
    // Reset slider and player position to center (230)
    playerSlider.value = 230;
    playerBox.style.left = '230px';

    // Hide overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 0;
    infoOverlay.style.pointerEvents = 'none';
    
    // Restart loops
    startGame();
}

function startGame() {
    // Initial setup for slider and player position
    playerSlider.value = 230;
    playerBox.style.left = '230px'; 

    // Hide instructions overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 0;
    infoOverlay.style.pointerEvents = 'none';

    // Game loop (runs 60 times per second)
    gameLoopInterval = setInterval(updateGame, 1000 / 60); 

    // Egg spawning loop
    eggSpawnInterval = setInterval(() => {
        if (!isGameOver) {
            createEgg();
        }
    }, 1200); 

    updateMissedDisplay();
}

// Start the game when the page loads
startGame();
