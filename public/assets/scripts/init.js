var mouseCoords;
var scoreText, score;
var gameTimerText;
var mouseX, mouseY;

function setupHUD() {
    mouseCoords = new createjs.Text("Mouse: ", "12px Arial", "#000");
    mouseCoords.x = 700;
    mouseCoords.y = 10;
    stage.addChild(mouseCoords);

    score = 0;
    scoreText = new createjs.Text("Score: " + score, "12px Arial", "#000");
    scoreText.x = 100;
    scoreText.y = 50;
    stage.addChild(scoreText);

    gameTimerText = new createjs.Text("Time: " + gameTimer, "12px Arial", "#000");
    gameTimerText.x = 700;
    gameTimerText.y = 25;
    stage.addChild(gameTimerText);

    hideItems(scoreText, gameTimerText);
}

function mouseInit() {
    stage.on("stagemousemove", function (evt) {
        mouseX = Math.floor(evt.stageX);
        mouseY = Math.floor(evt.stageY);
        mouseCoords.text = "Mouse: " + mouseX + ", " + mouseY;
    });

}



function construct() {
    setupButtons();
    setupHUD();
    mouseInit();
    showTitle();
    switch (levelChoice) {
        case 0: levelOneBuild(); break;
        case 1: levelTwoBuild(); break;
        case 2: levelThreeBuild(); break;
        default: console.log("Level decision error"); break;
    }


    topBarUIBuild();
}