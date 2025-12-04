// --- Game Variables ---
const gameContainer = document.getElementById('game-container');
const playerBox = document.getElementById('player-box');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const playerSlider = document.getElementById('player-slider');

const GAME_WIDTH = gameContainer.offsetWidth;
const PLAYER_WIDTH = playerBox.offsetWidth;
const PLAYER_HEIGHT = 120; // Must match CSS height
const EGG_HEIGHT = 25; // Must match CSS height

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
    
    // Give the egg a unique falling speed (between 1 and 3 pixels per frame)
    egg.fallSpeed = 1.5 + Math.random() * 1.5; 
    
    gameContainer.appendChild(egg);
    return egg;
}

function updateGame() {
    if (isGameOver) return;

    const eggs = gameContainer.querySelectorAll('.egg');

    eggs.forEach(egg => {
        let currentY = egg.offsetTop;
        const newY = currentY + egg.fallSpeed;
        
        egg.style.top = newY + 'px';

        // Check if the egg has reached the catching/missing zone
        // This is the vertical position where the egg meets the catcher's top edge
        const catchingHeight = gameContainer.offsetHeight - PLAYER_HEIGHT;

        if (newY >= catchingHeight) {
            
            // 1. Check for collision/catch (Alignment-based auto-grab)
            if (isCollision(egg, playerBox)) {
                egg.remove();
                score++;
                scoreDisplay.textContent = `${score}`;
            } 
            
            // 2. Check if the egg hit the ground (missed)
            else if (newY >= gameContainer.offsetHeight - EGG_HEIGHT) {
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
    // Get current horizontal positions
    const eggX = element1.offsetLeft;
    const eggWidth = element1.offsetWidth;
    
    const playerX = element2.offsetLeft;
    const playerWidth = element2.offsetWidth;
    
    // Check for horizontal overlap: The egg is caught if it's horizontally aligned with the player
    const horizontalOverlap = (
        eggX < playerX + playerWidth && // Egg's left side is left of the player's right side
        eggX + eggWidth > playerX       // Egg's right side is right of the player's left side
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
    infoOverlay.style.pointerEvents = 'auto'; // Allows user to see and interact with overlay
    
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
    
    // Reset slider and player position to center (275)
    playerSlider.value = 275;
    playerBox.style.left = '275px';

    // Hide overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 0;
    infoOverlay.style.pointerEvents = 'none';
    
    // Restart loops
    startGame();
}

function startGame() {
    // Initial setup for slider and player position
    playerSlider.value = 275;
    playerBox.style.left = '275px'; 

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
    }, 1200); // Spawning eggs a bit faster

    updateMissedDisplay();
}

// Start the game when the page loads
startGame();
