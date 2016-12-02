var playBtn, instructionsBtn, mainmenuBtn, continueBtn;

function initButtons() {
    playBtn = new createjs.Bitmap(queue.getResult("playBtn"));
    // playBtnHover = new createjs.Bitmap(queue.getResult("playBtnHover"));
    // playBtnClick = new createjs.Bitmap(queue.getResult("playBtnClick"));
    instructionsBtn = new createjs.Bitmap(queue.getResult("instructionsBtn"));
    // instructionsBtnHover = new createjs.Bitmap(queue.getResult("instructionsBtnHover"));
    // instructionsBtnClick = new createjs.Bitmap(queue.getResult("instructionsBtnClick"));
    mainmenuBtn = new createjs.Bitmap(queue.getResult("mainmenuBtn"));
    // mainmenuBtnHover = new createjs.Bitmap(queue.getResult("mainmenuBtnHover"));
    // mainmenuBtnClick = new createjs.Bitmap(queue.getResult("mainmenuBtnClick"));
    // continueBtn = new createjs.Bitmap(queue.getResult("continueBtn"));
    // continueBtnHover = new createjs.Bitmap(queue.getResult("continueBtnHover"));
    // continueBtnClick = new createjs.Bitmap(queue.getResult("continueBtnClick"));
    readyBtn = new createjs.Bitmap(queue.getResult("readyBtn"));
}

function setupButtons() {
    initButtons();

    playBtn.x = 650;
    playBtn.y = 500;
    // stage.addChild(playBtn);

    playBtn.on("click", function (evt) {
        // console.log("Play Clicked");
        if (gameReady) {
            socket.emit("game start")
        } else {
            alert("Not all players are ready");
        }
    });
    // playBtn.on("mouseover", function (evt) {
    //     console.log("Play Mouse Over");
    // });
    // playBtn.on("mouseout", function (evt) {
    //     console.log("Play Mouse Out");
    // });
    // playBtn.on("mousedown", function (evt) {
    //     console.log("Play Mouse Down");
    // });

    instructionsBtn.x = 330;
    instructionsBtn.y = 400;
    stage.addChild(instructionsBtn);

    instructionsBtn.on("click", function (evt) {
        // console.log("Instructions Clicked");
        gameState = INSTRUCTIONS;
    });
    // instructionsBtn.on("mouseover", function (evt) {
    //     console.log("Instructions Mouse Over");
    // });
    // instructionsBtn.on("mouseout", function (evt) {
    //     console.log("Instructions Mouse Out");
    // });
    // instructionsBtn.on("mousedown", function (evt) {
    //     console.log("Instructions Mouse Down");
    // });

    mainmenuBtn.x = 600;
    mainmenuBtn.y = 500;
    stage.addChild(mainmenuBtn);

    mainmenuBtn.on("click", function (evt) {
        // console.log("Main Menu Clicked");
        gameState = RESET;
    });
    // mainmenuBtn.on("mouseover", function (evt) {
    //     console.log("Main Menu Mouse Over");
    // });
    // mainmenuBtn.on("mouseout", function (evt) {
    //     console.log("Main Menu Mouse Out");
    // });
    // mainmenuBtn.on("mousedown", function (evt) {
    //     console.log("Main Menu Mouse Down");
    // });

    readyBtn.x = 300;
    readyBtn.y = 300;
    readyBtn.on("click", function (evt) {
        //ready
        socket.emit('player ready', currentPlayer.name);
    });
    stage.addChild(readyBtn);


    hideItems(playBtn, instructionsBtn, mainmenuBtn, readyBtn);
}