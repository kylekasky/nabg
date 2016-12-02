var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var playerSlots = [false, false, false, false];
var players = [];

var levelChoice = Math.floor(Math.random() * 3);
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function (socket) {
    var connected = false;
    for (var i = 0; i < playerSlots.length; i++) {
        if (!playerSlots[i]) {
            //connect player
            playerSlots[i] = socket.id;
            connected = true;
            i = playerSlots.length;
        } else {
            console.log(socket.id + " user has connected, but room is full");
            socket.emit('disconnect');
        }
    }

    if (connected) {
        console.log(socket.id + " user has connected");
        socket.nickname = 'Guest';
        socket.on("disconnect", function () {
            console.log(socket.id + "user has disconnected");
            var slotIdToRemove = playerSlots.indexOf(socket.id);
            io.emit('remove player', slotIdToRemove);
            playerSlots[slotIdToRemove] = false;
            for (var i = 0; i < players.length; i++) {
                if (players[i].playerSlotId == slotIdToRemove) {
                    players.splice(i, 1);
                }
            }
        });

        socket.on("getlevelchoice", function () {
            io.emit('levelchoice', levelChoice);
        });

        socket.on('newlevelchoice', function () {
            // console.log("bef" + levelChoice);
            // levelChoice = Math.floor(Math.random() * 3);
            // console.log(levelChoice);
        });

        socket.on("bomb place", function (bombPlaced) {
            console.log('bomb place');
            io.emit('bomb place recieved', bombPlaced);
        });

        socket.on("chat message", function (msg) {
            console.log(msg.msg);
            //console.log(io.sockets.clients());
            io.emit('chat received', {
                message: msg.msg,
                sid: socket.id,
                name: msg.name
            });
        });

        socket.on("dead", function (name) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == name && players[i].lives <= 0) {
                    players[i].dead = true;
                }
            }

            var deadcount = 0;
            for (var i = 0; i < players.length; i++) {
                if (players[i].dead) deadcount++;
            }
            if (deadcount >= (players.length - 1)) io.emit('game state change', 700);
        });

        socket.on("drop powerup", function (explosionLocation) {
            var num = Math.floor(Math.random() * 3);
            var powerup = "";
            switch (num) {
                case 0: powerup = "bomb"; break;
                case 1: powerup = "move"; break;
                case 2: powerup = "range"; break;
                default: break;
            }
            io.emit("powerup dropped", {
                name: powerup,
                x: explosionLocation.x,
                y: explosionLocation.y
            });
        });

        socket.on("game start", function () {
            console.log("game started");
            io.emit('game state change', 400)
        });

        socket.on("get clients", function (msg) {
            console.log('sending clients');
            console.log(io.sockets.clients());
            io.emit('list clients', io.sockets.clients().adapter.sids);
        });

        socket.on('new player', function (name) {
            var slotId = -1;
            for (var i = 0; i < playerSlots.length; i++) {
                if (socket.id === playerSlots[i]) {
                    slotId = i;
                }
            }
            var newPlayer = new Player(name, slotId);
            players.push(newPlayer);
            // io.emit('new player join successful', {
            //     sid: socket.id,
            //     player: newPlayer
            // });
            io.emit('name received', players);
        });

        //player reset should be non-destructive
        socket.on('reset players', function (playersRecieved) {
            var newplayers = [];
            for (var i = 0; i < playersRecieved.length; i++) {
                var newPlayer = new Player(playersRecieved[i].name, playersRecieved[i].slotId);
                newplayers.push(newPlayer);

            }
            players = newplayers;
            console.log('app:reset players');
            io.emit('players reset', newplayers);
            levelChoice++;
            if (levelChoice > 2) levelChoice = 0;
        });
        socket.on('player ready', function (playerName) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == playerName) {
                    players[i].ready = true;
                    //io.emit('powerup change', players[i]);
                }
            }
            var areAllPlayersReady = true;
            for (var i = 0; i < players.length; i++) {
                if (!players[i].ready) {
                    areAllPlayersReady = players[i].ready; //if a player isn't ready this will be set to false for when the emit happens   
                }
            }
            io.emit('player ready check', areAllPlayersReady);
        });

        //set power up
        socket.on('powerup changed', function (powerup) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == powerup.name) {
                    players[i].powerup = powerup.power;
                    io.emit('powerup change', {
                        power: players[i].powerup,
                        sid: socket.id,
                        name: powerup.name
                    });
                }
            }
        });

        socket.on("coords changed", function (coords) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == coords.name) {
                    io.emit('coords change', {
                        x: coords.x,
                        y: coords.y,
                        sid: socket.id,
                        who: i,
                        name: coords.name,
                        animation: coords.animation
                    });
                }
            }
        });

        //decrements lives
        socket.on('life changed', function (life) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == life.name) {
                    if (players[i].lives > 0) {
                        players[i].lives -= 1;
                    }
                    io.emit('life change', {
                        num: players[i].lives,
                        sid: socket.id,
                        name: life.name
                    });
                }
            }
        });

        //increments score
        socket.on('score changed', function (score) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name == score.name) {
                    console.log(players[i].score);
                    players[i].score++;
                    io.emit('score change', {
                        num: players[i].score,
                        sid: socket.id,
                        name: score.name
                    });
                }
            }
        });

        socket.on('who won', function () {
            var winner = false;
            for (var i = 0; i < players.length; i++) {
                if (!players[i].dead) {
                    winner = true;
                    io.emit("winner", players[i].name);
                }
            };
            if (!winner) io.emit("winner", "Nobody");
        });

    } else {
        console.log(socket.id + " user has connected, but room is full2");
        socket.emit('disconnected');
    }
});

function Player(name, slotId) {
    this.lives = 3;
    this.lobbyId = 0;
    this.moveSpeed = 4;
    this.name = name;
    this.powerup = 'None';
    this.playerSlotId = slotId;
    this.ready = false;
    this.score = 0;
    this.dead = false;
    this.coords = {
        x: 50,
        y: 50
    };
    switch (slotId) {
        case 0:
            this.coords = {
                x: 50,
                y: 50
            };
            break;
        case 1:
            this.coords = {
                x: 750,
                y: 50
            };
            break;
        case 2:
            this.coords = {
                x: 750,
                y: 550
            };
            break;
        case 3:
            this.coords = {
                x: 50,
                y: 550
            };
            break;
    }

}

app.use(express.static('public'));
http.listen(process.env.PORT || 3000, function () { });
