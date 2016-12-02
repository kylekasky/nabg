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
            storeScore();
            hideGame();
            hideTopBar();
            hideBombs();
            showGameOver();
            resetGameTimer();
            determineWinner();
            socket.emit('newlevelchoice');
            socket.emit('getlevelchoice');
            removeTitlePlayerList();
            gameState = HOLD;
            break;
        case RESET:
            if (isGameOver) {
                isGameOver = false;
                movePlayerNames();
                resetPlayers();
                hideGameOver();
                resetLevelBuild();
            }
            gameState = TITLE;
            break;
        default:
            break;
    }
    stage.update();
}

function removeTitlePlayerList() {
    titlePlayerList.forEach(function (player, index) {
        player.visible = false;
        stage.removeChild(player);
    });
}

function getCurrentHighScore() {
    return parseInt(document.cookie.split(';')[0].split('=')[1]);
}

function storeScore() {
    if (getCurrentHighScore() < playerData[0].score) {
        document.cookie = "highscore=" + playerData[0].score + ";";
    }
    updateHighScore();
}

function determineWinner() {
    socket.emit("who won");
}

function removeFromStage(item) {
    stage.removeChild(item);
}

function resetLevelBuild() {
    MAX_BOMBS_DEPLOYABLE = 1;
    levelOneStageObjects.forEach(removeFromStage);
    levelTwoStageObjects.forEach(removeFromStage);
    levelThreeStageObjects.forEach(removeFromStage);
    breakableTiles.forEach(removeFromStage);
    unbreakableTiles.forEach(removeFromStage);
    levelOneStageObjects = [];
    levelTwoStageObjects = [];
    levelThreeStageObjects = [];
    breakableTiles = [];
    unbreakableTiles = [];
    topBarUI = {};
    topBarObjects = [];
    redXArray = [];
    socket.emit('newlevelchoice');
    switch (levelChoice) {
        case 0: levelOneBuild(); break;
        case 1: levelTwoBuild(); break;
        case 2: levelThreeBuild(); break;
        default:
            // console.log("Level decision error"); 
            break;
    }
    switch (levelChoice) {
        case 0: playAreaScreen = playAreaScreen1; break;
        case 1: playAreaScreen = playAreaScreen2; break;
        case 2: playAreaScreen = playAreaScreen3; break;
        default:
            // console.log("Level decision error"); 
            break;
    }
    topBarUIBuild();
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
    switch (levelChoice) {
        case 0: showLevelOne(); break;
        case 1: showLevelTwo(); break;
        case 2: showLevelThree(); break;
        default:
            // console.log("Level decision error"); 
            break;
    }
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
