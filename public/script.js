var currentPlayer;
var stage;
var queue;
var sprites;
var FPS = 30;
var playerSprite;
var checkingForMovement = false;
var socket;
var gameReady = false;
var playerSprites = [];
var explosionSprite;
var playerData = [];
var dead = false;

const HOLD = 0;
const CONSTRUCT = 100;
const TITLE = 200;
const INSTRUCTIONS = 300;
const START_GAME = 400;
const START_LEVEL = 500;
const IN_GAME = 600;
const GAME_OVER = 700;

var gameState = HOLD;

$('document').ready(function () {
    socket = io();
    $('#message_form').hide();

    $('#client_info').submit(function (evt) {
        evt.preventDefault();
        var temp = '';
        socket.emit('get clients', temp);
    });

    //need to add a player to the divs and the new players need to have all the players that were there first
    //when someone disconnects they need to dissapear

    //    socket.on("client joined", function(newestPlayer) {
    //    });

    $('#lives').submit(function (evt) {
        evt.preventDefault();
        var temp = {
            name: currentPlayer.name
        }
        socket.emit('life changed', temp);
    });

    $('#message_form').submit(function (evt) {
        evt.preventDefault();
        var temp = {
            name: currentPlayer.name,
            msg: $('#msg').val()
        }
        socket.emit('chat message', temp);
        $('#msg').val("");
    });

    $('#name_form').submit(function (evt) {
        evt.preventDefault();
        var playerName = document.getElementById('name').value;
        currentPlayer = {
            range: 1,
            bomb: {},
            bombClones: [],
            lives: 3,
            moveSpeed: 4,
            name: playerName,
            powerup: 'None',
            ready: false,
            score: 0,
            sid: socket.id,
            sprite: playerSprite
        }
        socket.emit('new player', playerName);
        $('#message_form').show();
        $('#name_form').hide();
    });

    $('#powerup').submit(function (evt) {
        evt.preventDefault();
        var temp = {
            name: currentPlayer.name,
            power: 'cat'
        }
        socket.emit('powerup changed', temp);
    });

    $('#score').submit(function (evt) {
        evt.preventDefault();
        var temp = {
            name: currentPlayer.name
        }
        socket.emit('score changed', temp);
    });

    socket.on("bomb place recieved", function (bombRecieved) {
        placeBomb(bombRecieved);
    });

    socket.on("chat received", function (data) {
        $('#messages').prepend($('<li>').text(data.name + ' says: ' + data.message));
    });

    socket.on("coords change", function (coords) {
        console.log(playerSprites);
        playerSprites[coords.who].x = coords.x;
        playerSprites[coords.who].y = coords.y;
        stage.update();
    });

    socket.on("game state change", function (state) {
        console.log("new state: " + state)
        gameState = state;
    });

    socket.on('life change', function (life) {
        // $('#messages').prepend($('<li>').text(life.name + ' now has ' + life.num + ' lives'));
        // $('#' + life.name + 'Lives').text('Lives: ' + life.num);

        for (var i = 0; i < playerData.length; i++) {
            if (life.name == playerData[i].name) {
                playerData[i].lives = life.num;
                var lifeText = stage.getChildByName("player" + playerData[i].slotId + "lives");
                lifeText.text = life.num;
                if (life.num == 0) {
                    socket.emit("dead", currentPlayer.name);
                    stage.removeChild(currentPlayer.playerSprite);
                    dead = true;
                }
            }
        }
        // updateHUD();
    });

    socket.on('name received', function (players) {
        //currentPlayer = players[players.length - 1].name; //setting up player when form is submitted
        var newestPlayer = players[players.length - 1].name;
        document.getElementById('players').innerHTML = '';

        for (var i = 0; i < players.length; i++) {
            playerSprites[i].x = players[i].coords.x;
            playerSprites[i].y = players[i].coords.y;
            addPlayer(players[i].name, players[i].score, players[i].lives, players[i].powerup, players[i].playerSlotId);
            if (players[i].name == currentPlayer.name) {
                currentPlayer.sprite = playerSprites[i];
            }
        }

        $('#messages').prepend($('<li>').text(newestPlayer + ' has joined the game'));
    });

    // socket.on('new player join successful', function (playerInfo) {
    //     if (socket.id === playerInfo) {
    //         console.log('join successful');
    //         currentPlayer = playerInfo.player;
    //     }
    // });

    socket.on('player ready check', function (areAllPlayersReady) {
        if (areAllPlayersReady) {
            gameReady = true;
            console.log('allPlayersReady');
            gameState = START_GAME;
        }
    });

    socket.on('powerup change', function (powerup) {
        $('#messages').prepend($('<li>').text(powerup.name + ' got ' + powerup.power + ' powerup'));
        $('#' + powerup.name + 'PowerUp').text('Power Up: ' + powerup.power);
    });

    socket.on('remove player', function (idToRemove) {
        console.log('remove player handler');

        var containerToRemove = stage.getChildByName("player" + idToRemove);

        stage.removeChild(containerToRemove);
        stage.update();

        // $('#player' + idToRemove).remove();
    });

    socket.on('score change', function (score) {
        // $('#messages').prepend($('<li>').text(score.name + ' now has ' + score.num + ' points'));
        // $('#' + score.name + 'Score').text('Score: ' + score.num);

        for (var i = 0; i < playerData.length; i++) {
            if (score.name == playerData[i].name) {
                playerData[i].lives = score.num;
                var scoreText = stage.getChildByName("player" + playerData[i].slotId + "score");
                scoreText.text = score.num;
            }
        }
    });

    socket.on('disconnected', function () {
        alert('Sorry but this game is full');
    });

    initGame();
});

function initGame() {
    setupCanvas();
    loadFiles();
}

function setupCanvas() {
    var canvas = document.getElementById("game");
    canvas.width = 800;
    canvas.height = 600;
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
}

var cacheVersion = new Date().getTime();
var jsEnd = ".js?a=" + cacheVersion;

manifest = [
    {
        src: "scripts/visibility" + jsEnd
    },
    {
        src: "scripts/init" + jsEnd
    },
    {
        src: "scripts/build_buttons" + jsEnd
    },
    {
        src: "scripts/build_screens" + jsEnd
    },
    {
        src: "scripts/game_timer" + jsEnd
    },
    {
        src: "scripts/key_commands" + jsEnd
    },
    {
        src: "scripts/game_loop" + jsEnd
    },
    {
        src: "scripts/game_data" + jsEnd
    },
    {
        src: "scripts/game_player" + jsEnd
    },
    {
        src: "scripts/ndgmr.Collision" + jsEnd
    },
    {
        src: "images/game over.png",
        id: "gameOverScreen"
    },
    {
        src: "images/instructions.png",
        id: "instructionsScreen"
    },
    {
        src: "images/levelone bg.png",
        id: "playAreaScreen"
    },
    {
        src: "images/title.png",
        id: "titleScreen"
    },
    {
        src: "images/sprite0.png",
        id: "playerSprite0"
    },
    {
        src: "images/sprite1.png",
        id: "playerSprite1"
    },
    {
        src: "images/sprite2.png",
        id: "playerSprite2"
    },
    {
        src: "images/sprite3.png",
        id: "playerSprite3"
    },
    {
        src: "images/unbreakabletree.png",
        id: "unbreakableTree"
    },
    {
        src: "images/breakableflower.png",
        id: "breakableFlower"
    },
    {
        src: "images/explosion.png",
        id: "explosion"
    },
    {
        src: "images/ready.png",
        id: "readyBtn"
    },
    {
        src: "images/start button.png",
        id: "playBtn"
    },
    {
        src: "images/instructions button.png",
        id: "instructionsBtn"
    },
    {
        src: "images/main menu button.png",
        id: "mainmenuBtn"
    },
    {
        src: "images/continue button.png",
        id: "continueBtn"
    },
    {
        src: "images/extrabomb.png",
        id: "extraBomb"
    },
    {
        src: "images/regbomb.png",
        id: "regularBomb"
    },
    {
        src: "images/breakableflower.png",
        id: "flower"
    },
    {
        src: "images/unbreakabletree.png",
        id: "tree"
    }

];

function loadFiles(event) {
    queue = new createjs.LoadQueue(true, "assets/");

    queue.on("complete", loadComplete, this);
    queue.loadManifest(manifest);
}

function startLoop() {
    createjs.Ticker.addEventListener('tick', loop);
    createjs.Ticker.setFPS(FPS);
}

function setImageStack() {
    stage.addChild(gameOverScreen);
    stage.addChild(titleScreen);
    stage.addChild(playAreaScreen);
    stage.addChild(instructionScreen);

    hideItems(titleScreen, playAreaScreen, instructionScreen, gameOverScreen);
}

function loadComplete(event) {
    titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));
    playAreaScreen = new createjs.Bitmap(queue.getResult("playAreaScreen"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructionsScreen"));
    gameOverScreen = new createjs.Bitmap(queue.getResult("gameOverScreen"));

    gameState = CONSTRUCT;

    setImageStack();

    playerSpriteInit();
    explosionSpriteInit();
    startLoop();
}

function updateHUD() {
    for (var i = 0; i < playerData.length; i++) {
        playerData[i].nameText = playerData[i].name;
        playerData[i].scoreText = playerData[i].score;
        playerData[i].livesText = playerData[i].lives;
        playerData[i].powerupText = playerData[i].powerup;
    }
    stage.update();
}


function addPlayer(name, score, lives, powerup, slotId) {
    var existingContainer = stage.getChildByName("player" + slotId);
    if (existingContainer) {
        stage.removeChild(existingContainer);
    }

    var playerContainer = new createjs.Container();

    var playerName = new createjs.Text(name, "12px Arial", "#000");
    playerName.x = 20;
    playerName.y = 75 * slotId + 20;
    playerName.name = "player" + slotId + "name";
    stage.addChild(playerName);

    var playerScore = new createjs.Text(score, "12px Arial", "#000");
    playerScore.x = 20;
    playerScore.y = 75 * slotId + 35;
    playerScore.name = "player" + slotId + "score";
    stage.addChild(playerScore);

    var playerLives = new createjs.Text(lives, "12px Arial", "#000");
    playerLives.x = 20;
    playerLives.y = 75 * slotId + 50;
    playerLives.name = "player" + slotId + "lives";
    stage.addChild(playerLives);

    var playerPowerUp = new createjs.Text(powerup, "12px Arial", "#000");
    playerPowerUp.x = 20;
    playerPowerUp.y = 75 * slotId + 65;
    playerPowerUp.name = "player" + slotId + "powerup";
    stage.addChild(playerPowerUp);

    playerContainer.name = "player" + slotId;

    stage.addChild(playerContainer);

    playerData.push({
        name: name,
        nameText: playerName,
        score: score,
        scoreText: playerScore,
        lives: lives,
        livesText: playerLives,
        powerup: powerup,
        powerupText: playerPowerUp,
        slotId: slotId
    });


    // var playerDiv = document.createElement('div');
    // var playerName = document.createElement('p');
    // playerName.innerHTML = name;

    // var playerScore = document.createElement('p');
    // playerScore.setAttribute('id', name + 'Score');
    // playerScore.innerHTML = 'Score: ' + score;

    // var playerLives = document.createElement('p');
    // playerLives.setAttribute('id', name + 'Lives');
    // playerLives.innerHTML = 'Lives: ' + lives;

    // var playerPowerUp = document.createElement('p');
    // playerPowerUp.setAttribute('id', name + 'PowerUp');
    // playerPowerUp.innerHTML = 'Power Up: ' + powerup;

    // playerDiv.appendChild(playerName);
    // playerDiv.appendChild(playerScore);
    // playerDiv.appendChild(playerLives);
    // playerDiv.appendChild(playerPowerUp);

    // playerDiv.id = 'player' + slotId;
    // $('#players').append(playerDiv);
}


function playerSpriteInit() {
    var walksheets = [];
    for (var i = 0; i < 4; i++) {
        walksheets.push(new createjs.SpriteSheet({
            images: [queue.getResult("playerSprite" + i)],
            frames: [[0, 0, 28, 28], [28, 0, 28, 28], [56, 0, 28, 28], [0, 28, 28, 28], [28, 28, 28, 28], [56, 28, 28, 28], [0, 56, 28, 28], [28, 56, 28, 28], [56, 56, 28, 28], [0, 84, 28, 28], [28, 84, 28, 28], [56, 84, 28, 28]],
            animations: {
                walkDown: [0, 2, "walkDown", .35],
                walkLeft: [3, 5, "walkLeft", .35],
                walkRight: [6, 8, "walkRight", .35],
                walkUp: [9, 11, "walkUp", .35]
            }
        }));

        playerSprite = new createjs.Sprite(walksheets[i]);
        playerSprite.x = 10000;
        playerSprite.y = 10000;
        playerSprite.gotoAndPlay("walkRight");  //loops through the animation frames (1-12) as defined above
        playerSprite.visible = false;
        stage.addChild(playerSprite);
        playerSprites.push(playerSprite);
    }
}

function explosionSpriteInit() {
    var explosion = new createjs.SpriteSheet({
        images: [queue.getResult("explosion")],
        frames: [[0, 0, 32, 32], [32, 0, 32, 32], [64, 0, 32, 32], [96, 0, 32, 32], [0, 32, 32, 32], [32, 32, 32, 32], [64, 32, 32, 32], [96, 32, 32, 32], [0, 64, 32, 32], [32, 64, 32, 32], [64, 64, 32, 32], [96, 64, 32, 32], [0, 96, 32, 32], [32, 96, 32, 32], [64, 96, 32, 32], [96, 96, 32, 32]],
        animations: {
            boom: [0, 15, "false"]
        }
    });

    explosionSprite = new createjs.Sprite(explosion);
    explosionSprite.gotoAndPlay("boom");
    explosionSprite.visible = false;
}