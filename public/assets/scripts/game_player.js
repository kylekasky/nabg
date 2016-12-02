var explosions = [];
var MAX_BOMBS_DEPLOYABLE = 1;
var MAX_ENEMY_BOMBS = 20;
var enemyBombClones = [];
var lastAnimation = "walkDown";

function buildBomb() {
    currentPlayer.bomb = new createjs.Bitmap(queue.getResult("regularBomb"));
    currentPlayer.bomb.regX = currentPlayer.bomb.getBounds().width / 2;
    currentPlayer.bomb.regy = currentPlayer.bomb.getBounds().height / 2;
    currentPlayer.bomb.visible = false;
}

function checkMovement() {
    if (!dead) {
        var animation = "walkDown";
        if (leftPressed) {
            animation = "walkLeft";
            if (currentPlayer.sprite.x > -1) currentPlayer.sprite.x -= currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.x += currentPlayer.moveSpeed;
        }
        if (rightPressed) {
            animation = "walkRight";
            if (currentPlayer.sprite.x < 770) currentPlayer.sprite.x += currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.x -= currentPlayer.moveSpeed;
        }
        if (upPressed) {
            animation = "walkUp";
            if (currentPlayer.sprite.y > 50) currentPlayer.sprite.y -= currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.y += currentPlayer.moveSpeed;
        }
        if (downPressed) {
            animation = "walkDown";
            if (currentPlayer.sprite.y < 570) currentPlayer.sprite.y += currentPlayer.moveSpeed;
            if (checkMoveCollision()) currentPlayer.sprite.y -= currentPlayer.moveSpeed;
        }
        if (leftPressed || rightPressed || upPressed || downPressed) {
            socket.emit("coords changed", {
                name: currentPlayer.name,
                x: currentPlayer.sprite.x,
                y: currentPlayer.sprite.y,
                animation: animation
            });
        }

        if (lastAnimation != animation) {
            currentPlayer.sprite.gotoAndPlay(animation);
            lastAnimation = animation;
        }
    }

}

function causeExplosion(center, range, name) {
    createjs.Sound.play("explosionSound");
    var newExplosion = explosionSprite.clone();
    newExplosion.owner = name;
    newExplosion.x = center.x;
    newExplosion.y = center.y;
    newExplosion.visible = true;
    newExplosion.frameSet = frameCount;
    stage.addChild(newExplosion);
    explosions.push(newExplosion);

    for (var i = 0; i < range; i++) {
        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x + (30 * (i + 1));
        newExplosion.y = center.y;
        newExplosion.visible = true;
        newExplosion.frameSet = frameCount;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x;
        newExplosion.y = center.y + (30 * (i + 1));
        newExplosion.visible = true;
        newExplosion.frameSet = frameCount;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x - (30 * (i + 1));
        newExplosion.y = center.y;
        newExplosion.visible = true;
        newExplosion.frameSet = frameCount;
        stage.addChild(newExplosion);
        explosions.push(newExplosion);

        newExplosion = explosionSprite.clone();
        newExplosion.owner = name;
        newExplosion.x = center.x;
        newExplosion.y = center.y - (30 * (i + 1));
        newExplosion.visible = true;
        newExplosion.frameSet = frameCount;
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
                    x: currentPlayer.bombClones[i].x - 15,
                    y: currentPlayer.bombClones[i].y,
                }

                causeExplosion(explosionCenter, currentPlayer.range, currentPlayer.name);
            }
        }
        //        if (enemyBombClones[i].visible) {
        //            if ((frameCount - enemyBombClones[i].frameSet) >= 90) {
        //                enemyBombClones[i].visible = false;
        //                enemyBombClones[i].frameSet = -1;
        //
        //                explosionCenter = {
        //                    x: enemyBombClones[i].x - 15,
        //                    y: enemyBombClones[i].y,
        //                }
        //
        //                causeExplosion(explosionCenter, enemyBombClones[i].range, enemyBombClones[i].name);
        //            }
        //        }
    }
    for (var i = 0; i < MAX_ENEMY_BOMBS; i++) {
        if (enemyBombClones[i].visible) {
            if ((frameCount - enemyBombClones[i].frameSet) >= 90) {
                enemyBombClones[i].visible = false;
                enemyBombClones[i].frameSet = -1;

                explosionCenter = {
                    x: enemyBombClones[i].x - 15,
                    y: enemyBombClones[i].y,
                }

                causeExplosion(explosionCenter, enemyBombClones[i].range, enemyBombClones[i].name);
            }
        }
    }
}
//this will need to be called if a multiple powerup bombs is picked up
function cloneBombs() {
    for (var i = 0; i < currentPlayer.bombClones.length; i++) {
        stage.removeChild(currentPlayer.bombClones[i]);
    }
    currentPlayer.bombClones = [];
    for (var i = 0; i < MAX_BOMBS_DEPLOYABLE; i++) {
        currentPlayer.bombClones.push(currentPlayer.bomb.clone());
        stage.addChild(currentPlayer.bombClones[i]);
    }
}

function cloneEnemyBombs() {
    for (var i = 0; i < enemyBombClones.length; i++) {
        stage.removeChild(enemyBombClones[i]);
    }
    enemyBombClones = [];
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
                currentPlayer.bombClones[i].y = currentPlayerSprite.y;//determine which y coord to place at
                currentPlayer.bombClones[i].visible = true;
                currentPlayer.bombClones[i].name = currentPlayer.name;
                spacePressed = false;
                //console.log('game_player:dropBomb');
                var bombInfoToSend = {
                    name: currentPlayer.name,
                    x: currentPlayer.bombClones[i].x,
                    y: currentPlayer.bombClones[i].y,
                    range: currentPlayer.range
                }
                socket.emit('bomb place', bombInfoToSend);
                break;
            }
        }
    }
}

function hideBombs() {
    for (var i = 0; i < MAX_BOMBS_DEPLOYABLE; i++) {
        currentPlayer.bombClones[i].visible = false;
    }

    for (var i = 0; i < MAX_ENEMY_BOMBS; i++) {
        enemyBombClones[i].visible = false;
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
                enemyBombClones[i].name = bombToPlace.name;
                enemyBombClones[i].range = bombToPlace.range;
                //socket.emit('bomb place', currentPlayer.bombClones[i]);
                break;
            }
        }
    }
}


function checkMoveCollision() {
    for (var i = 0; i < breakableTiles.length; i++) {
        var collision = this.ndgmr.checkPixelCollision(breakableTiles[i], currentPlayer.sprite, .8);
        if (collision) {
            return collision;
        }
    }
    for (var i = 0; i < unbreakableTiles.length; i++) {
        var collision = this.ndgmr.checkPixelCollision(unbreakableTiles[i], currentPlayer.sprite, .8);
        if (collision) {
            return collision;
        }
    }
}