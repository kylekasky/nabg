function buildTitle() {
    titleScreen.x = titleScreen.y = 0;
    stage.addChild(titleScreen);

    instructionScreen.x = instructionScreen.y = 0;
    stage.addChild(instructionScreen);

    hideItems(titleScreen, instructionScreen);
}

function showTitle() {
    showItems(playBtn, instructionsBtn, titleScreen, readyBtn, playersInGameText);
    for (var i = 0; i < titlePlayerList.length; i++) {
        showItems(titlePlayerList[i]);
    }
}

function hideTitle() {
    hideItems(playBtn, instructionsBtn, titleScreen, readyBtn, playersInGameText);
    for (var i = 0; i < titlePlayerList.length; i++) {
        hideItems(titlePlayerList[i]);
    }
}

function showInstructions() {
    showItems(mainmenuBtn, instructionScreen);
}

function hideInstructions() {
    hideItems(mainmenuBtn, instructionScreen);
}

function showGameOver() {
    showItems(mainmenuBtn, gameOverScreen, winnerName);
    explosions.forEach(function (expl, index) {
        expl.visible = false;
    });
    explosions = [];
    topBarObjects = [];
}

function hideGameOver() {
    hideItems(mainmenuBtn, gameOverScreen, winnerName);
    winnerName.visible = false;
    titlePlayerList = [];
}

function showGame() {
    showItems(currentPlayer.sprite, gameTimerText, playAreaScreen);//took out scoreText
    for (var i = 0; i < playerSprites.length; i++) {
        showItems(playerSprites[i]);
    }
}

function hideGame() {
    hideItems(currentPlayer.sprite, gameTimerText, playAreaScreen);
    for (var i = 0; i < playerSprites.length; i++) {
        hideItems(playerSprites[i]);
    }
    hideLevelOne();
}

function showLevelOne() {
    console.log('build_screens:showLevelOne');
    levelOneStageObjects.forEach(function (item, index) {
        item.visible = true;
    });
}

function hideLevelOne() {
    console.log('build_screens:hideLevelOne');
    levelOneStageObjects.forEach(function (item, index) {
        item.visible = false;
    });

}

function showTopBar() {
    showItems(topBarUI);
    for (var i = 0; i < topBarObjects.length; i++) {
        topBarObjects[i].visible = true;
    }
}

function hideTopBar() {
    hideItems(topBarUI);
    for (var i = 0; i < topBarObjects.length; i++) {
        topBarObjects[i].visible = false;
    }
    for (var i = 0; i < redXArray.length; i++) {
        redXArray[i].visible = false;
    }
}