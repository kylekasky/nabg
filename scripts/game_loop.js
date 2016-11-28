function loop() {
    // inLoopMusicMuteCheck();

    switch (gameState) {
        case CONSTRUCT:
            construct();
            gameState = HOLD;
            break;
        case TITLE:
            hideInstructions();
            showTitle();
            break;
        case INSTRUCTIONS:
            hideTitle();
            showInstructions();
            break;
        case START_GAME:
            startGame();
            showGame();
            hideTitle();
            // playMusic();
            gameState = IN_GAME;
            break;
        case IN_GAME:
            gameLoop();
            break;
        case GAME_OVER:
            hideGame();
            showGameOver();
            resetGameTimer();
            determineWinner();
            gameState = HOLD;
            break;
        default:
            break;
    }
    stage.update();
}

function determineWinner() {
    socket.emit("who won");

}

function startGame() {
    //default scores, timers, counts, etc.
    socket.emit("coords changed", {
        name: currentPlayer.name,
        x: currentPlayer.sprite.x,
        y: currentPlayer.sprite.y
    });
    //load first level
    checkingForMovement = true;
    buildBomb();
    cloneBombs();
    cloneEnemyBombs();
    showLevelOne();

}

function cleanUpGame() {
    checkingForMovement = false;
}

function gameLoop() {
    runGameTimer();
    checkMovement();
    dropBomb();
    checkExplosions();
}
