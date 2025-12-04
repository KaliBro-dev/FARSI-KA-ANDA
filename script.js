// Function to update the visual missed counter
function updateMissedDisplay() {
    // Show 'X' for each missed egg up to the maximum
    let missedText = '';
    for (let i = 0; i < MAX_MISSED; i++) {
        if (i < missedCount) {
            missedText += ' ❌'; // Red X for missed
        } else {
            missedText += ' 🥚'; // Egg icon for remaining lives
        }
    }
    missedDisplay.textContent = missedText.trim();
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(eggSpawnInterval);
    
    // Display the final score, but keep the display minimal
    alert(`Final Score: ${score}`);
    
    // Show a small overlay reminder
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 1;
    infoOverlay.style.pointerEvents = 'auto';
    infoOverlay.querySelector('p:first-child').textContent = `GAME OVER! Score: ${score}`;
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
    
    // Hide overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 0;
    infoOverlay.style.pointerEvents = 'none';
    
    // Restart loops
    startGame();
}

function startGame() {
    // Hide instructions overlay
    const infoOverlay = document.getElementById('info-overlay');
    infoOverlay.style.opacity = 0;
    infoOverlay.style.pointerEvents = 'none';

    // Game loop (runs 60 times per second for smooth movement)
    gameLoopInterval = setInterval(updateGame, 1000 / 60); 

    // Egg spawning loop
    eggSpawnInterval = setInterval(() => {
        if (!isGameOver) {
            createEgg();
        }
    }, 1500); 
    
    // Initialize the missed display
    updateMissedDisplay();
}
