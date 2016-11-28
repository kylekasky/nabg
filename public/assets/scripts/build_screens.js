function buildTitle() {
    titleScreen.x = titleScreen.y = 0;
    stage.addChild(titleScreen);

    instructionScreen.x = instructionScreen.y = 0;
    stage.addChild(instructionScreen);

    hideItems(titleScreen, instructionScreen);
}

function showTitle() {
    showItems(playBtn, instructionsBtn, titleScreen, readyBtn);
}

function hideTitle() {
    hideItems(playBtn, instructionsBtn, titleScreen, readyBtn);
}

function showInstructions() {
    showItems(mainmenuBtn, instructionScreen);
}

function hideInstructions() {
    hideItems(mainmenuBtn, instructionScreen);
}

function showGameOver() {
    showItems(mainmenuBtn, gameOverScreen);
}

function hideGameOver() {
    hideItems(mainmenuBtn, gameOverScreen);
}

function showGame() {
    showItems(currentPlayer.sprite, scoreText, gameTimerText, playAreaScreen);
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