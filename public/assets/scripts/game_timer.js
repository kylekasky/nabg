var frameCount = 0;
var gameTimer = 0;

function resetGameTimer() {
    gameTimer = 0;
    gameTimerText.text = "Time: " + gameTimer;
}
function runGameTimer() {
    frameCount += 1;
    if (frameCount % (FPS / 10) === 0) {
        gameTimer = frameCount / FPS;
        gameTimerText.text = "Time: " + gameTimer;
    }

    for (var i = 0; i < explosions.length; i++) {
        for (var j = 0; j < breakableTiles.length; j++) {
            var collision = this.ndgmr.checkPixelCollision(breakableTiles[j], explosions[i], .8);
            if (collision) {
                stage.removeChild(breakableTiles[j]);
                breakableTiles.splice(j, 1);
            }
        }
        var collision = this.ndgmr.checkPixelCollision(currentPlayer.sprite, explosions[i], .8);
        if (collision) {

        }
    }
}
