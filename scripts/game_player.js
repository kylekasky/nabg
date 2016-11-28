var explosions = [];
var MAX_BOMBS_DEPLOYABLE = 1;
var MAX_ENEMY_BOMBS = 10;
var enemyBombClones = [];

function buildBomb() {
    currentPlayer.bomb = new createjs.Bitmap(queue.getResult("regularBomb"));
    currentPlayer.bomb.regX = currentPlayer.bomb.getBounds().width / 2;
    currentPlayer.bomb.regy = currentPlayer.bomb.getBounds().height / 2;
    currentPlayer.bomb.visible = false;
}

function checkMovement() {
    if (!dead) {
        if (leftPressed) {
            currentPlayer.sprite.x -= currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.x += currentPlayer.moveSpeed;
        }
        if (rightPressed) {
            currentPlayer.sprite.x += currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.x -= currentPlayer.moveSpeed;
        }
        if (upPressed) {
            currentPlayer.sprite.y -= currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.y += currentPlayer.moveSpeed;
        }
        if (downPressed) {
            currentPlayer.sprite.y += currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.y -= currentPlayer.moveSpeed;
        }
        if (leftPressed || rightPressed || upPressed || downPressed) {
            console.log("telling the server coords");
            socket.emit("coords changed", {
                name: currentPlayer.name,
                x: currentPlayer.sprite.x,
                y: currentPlayer.sprite.y
            });
        }
    }

}

function causeExplosion(center, range, name) {
    var newExplosion = explosionSprite.clone();
    newExplosion.owner = name;
    newExplosion.x = center.x;
    newExplosion.y = center.y;
    newExplosion.visible = true;
    stage.addChild(newExplosion);
    explosions.push(newExplosion);

    for (var i = 0; i < range; i++) {
        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x + (30 * (i + 1));
        newExplosion.y = center.y;
        newExplosion.visible = true;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x;
        newExplosion.y = center.y + (30 * (i + 1));
        newExplosion.visible = true;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x - (30 * (i + 1));
        newExplosion.y = center.y;
        newExplosion.visible = true;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x;
        newExplosion.y = center.y - (30 * (i + 1));
        newExplosion.visible = true;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);
    }
}

function checkExplosions() {
    for (var i = 0; i < MAX_BOMBS_DEPLOYABLE; i++) {
        if (currentPlayer.bombClones[i].visible) {
            if ((frameCount - currentPlayer.bombClones[i].frameSet) >= 90) {
                currentPlayer.bombClones[i].visible = false;
                currentPlayer.bombClones[i].frameSet = -1;

                explosionCenter = {
                    x: currentPlayer.bombClones[i].x,
                    y: currentPlayer.bombClones[i].y,
                }

                causeExplosion(explosionCenter, currentPlayer.range, currentPlayer.name);
            }
        }
    }
    for (var i = 0; i < MAX_ENEMY_BOMBS; i++) {
        if (enemyBombClones[i].visible) {
            if ((frameCount - enemyBombClones[i].frameSet) >= 90) {
                enemyBombClones[i].visible = false;
                enemyBombClones[i].frameSet = -1;
            }
        }
    }
}

function cloneBombs() {
    for (var i = 0; i < MAX_BOMBS_DEPLOYABLE; i++) {
        currentPlayer.bombClones.push(currentPlayer.bomb.clone());
        stage.addChild(currentPlayer.bombClones[i]);
    }
}

function cloneEnemyBombs() {
    for (var i = 0; i < MAX_ENEMY_BOMBS; i++) {
        enemyBombClones.push(currentPlayer.bomb.clone());
        stage.addChild(enemyBombClones[i]);
    }
}

function dropBomb() {
    if (spacePressed && !dead) {
        for (var i = 0; i < MAX_BOMBS_DEPLOYABLE; i++) {
            if (!currentPlayer.bombClones[i].visible) {
                var currentPlayerSprite = currentPlayer.sprite;
                currentPlayer.bombClones[i].frameSet = frameCount;
                currentPlayer.bombClones[i].x = currentPlayerSprite.x + 15;//determine which x coord to place at
                currentPlayer.bombClones[i].y = currentPlayerSprite.y + 15;//determine which y coord to place at
                currentPlayer.bombClones[i].visible = true;
                currentPlayer.bombClones[i].name = currentPlayer.name;
                spacePressed = false;
                console.log('game_player:dropBomb');
                var bombInfoToSend = {
                    name: currentPlayer.name,
                    x: currentPlayer.bombClones[i].x,
                    y: currentPlayer.bombClones[i].y
                }
                socket.emit('bomb place', bombInfoToSend);
                break;
            }
        }
    }
}

function placeBomb(bombToPlace) {
    if (bombToPlace.name !== currentPlayer.name) {
        for (var i = 0; i < MAX_ENEMY_BOMBS; i++) {
            if (!enemyBombClones[i].visible) {
                //var currentPlayerSprite = currentPlayer.sprite;
                enemyBombClones[i].frameSet = frameCount;
                enemyBombClones[i].x = bombToPlace.x;//determine which x coord to place at
                enemyBombClones[i].y = bombToPlace.y;//determine which y coord to place at
                enemyBombClones[i].visible = true;
                //socket.emit('bomb place', currentPlayer.bombClones[i]);
                break;
            }
        }
    }
}


function checkMoveCollision() {
    for (var i = 0; i < breakableTiles.length; i++) {
        var collision = this.ndgmr.checkPixelCollision(breakableTiles[i], currentPlayer.sprite, .8);
        if (collision) return collision;
    }
    for (var i = 0; i < unbreakableTiles.length; i++) {
        var collision = this.ndgmr.checkPixelCollision(unbreakableTiles[i], currentPlayer.sprite, .8);
        if (collision) return collision;
    }
}