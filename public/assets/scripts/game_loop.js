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
            hideTitle();
            showGame();
            showTopBar();
            // playMusic();
            gameState = IN_GAME;
            break;
        case IN_GAME:
            gameLoop();
            break;
        case GAME_OVER:
            hideGame();
            hideTopBar();
            hideBombs();
            showGameOver();
            resetGameTimer();
            determineWinner();
            gameState = HOLD;
            break;
        case RESET:
            if(isGameOver) {
                isGameOver = false;
                movePlayerNames();
                resetPlayers();
                hideGameOver();
            }
            gameState = TITLE;
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
    fillTopBarUI();
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

function movePlayerNames() {
    titlePlayerList.forEach(function (playerTextObj, index) {
        playerTextObj.x = 20;
        playerTextObj.y = 35 + index * 15;
    });   
}

function resetPlayers() {
    var abbridgedPlayerData = [];
    playerData.forEach(function (player, index) {
        var abbPlayer = {
            name: player.name,
            slotId: player.slotId
        }
        abbridgedPlayerData.push(abbPlayer);
    });
    socket.emit('reset players', abbridgedPlayerData);
}
