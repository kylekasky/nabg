var frameCount = 0;
var gameTimer = 0;
var tookDamageRecently = false;
var damagedFrame = 0;

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

    if (frameCount - damagedFrame >= 100) tookDamageRecently = false;

    for (var i = 0; i < explosions.length; i++) {
        for (var j = 0; j < breakableTiles.length; j++) {
            try {
                var collision = this.ndgmr.checkPixelCollision(breakableTiles[j], explosions[i], .8);
            } catch (e) {
                console.log('weird thing');
            }
            if (collision) {
                if (chanceForPowerUp()) {
                    socket.emit('drop powerup', {
                        x: explosions[i].x,
                        y: explosions[i].y
                    });
                }
                stage.removeChild(breakableTiles[j]);
                breakableTiles.splice(j, 1);
                var temp = {
                    name: explosions[i].owner
                }
                socket.emit('score changed', temp);
            }
        }
        for (var j = 0; j < currentPlayer.bombClones.length; j++) {
            try {
                var collision = this.ndgmr.checkPixelCollision(currentPlayer.bombClones[j], explosions[i], .8);
            } catch (e) {
                console.log('weird thing');
            }
            if (collision) {
                currentPlayer.bombClones[j].explodeNow = true;
            }
        }
        for (var j = 0; j < enemyBombClones.length; j++) {
            try {
                var collision = this.ndgmr.checkPixelCollision(enemyBombClones[j], explosions[i], .8);
            } catch (e) {
                console.log('weird thing');
            }
            if (collision) {
                enemyBombClones[j].explodeNow = true;
            }
        }
        try {
            var collision = this.ndgmr.checkPixelCollision(currentPlayer.sprite, explosions[i], .8);
        } catch (e) {
            console.log('weird thing');
        }
        if (collision && !tookDamageRecently) {
            var temp = {
                name: currentPlayer.name
            }
            socket.emit('life changed', temp);
            currentPlayer.lives--;
            tookDamageRecently = true;
            damagedFrame = frameCount;
        }
        if (currentPlayer.lives <= 0) socket.emit("dead", currentPlayer.name);
        if (explosions[i].currentAnimation == "hidden") {
            stage.removeChild(explosions[i]);
            explosions.splice(i, 1);
        }
    }

    for (var i = 0; i < powerupDrops.length; i++) {
        try {
            var collision = this.ndgmr.checkPixelCollision(currentPlayer.sprite, powerupDrops[i], .8);
        } catch (e) {
            console.log('weird thing');
        }
        if (collision) {
            powerupDrops[i].visible = false;
            stage.removeChild(powerupDrops[i]);
            var temp = {
                name: currentPlayer.name,
                power: powerupDrops[i].name
            }
            powerupDrops.splice(i, 1);
            socket.emit('powerup changed', temp);
        } else if ((frameCount - powerupDrops[i].frameSet) >= 150) {
            powerupDrops[i].visible = false;
            stage.removeChild(powerupDrops[i]);
            powerupDrops.splice(i, 1);
        }
    }

}

function chanceForPowerUp() {
    var num = Math.floor(Math.random() * 100);
    return num >= 80;
}