var levelOneStageObjects = [];
var breakableTiles = [];
var unbreakableTiles = [];
var topBarUI = {};
var topBarObjects = [];
var redXArray = [];
var TILE_SIDE_LENGTH = 30;
var EMPTY = 0;
var GREY_BLOCK = 1;
var BROWN_BLOCK = 2;
var levelOneTiles = [
    [0, 0, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0],
    [0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0],
    [2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2],
    [0, 2, 0, 2, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 2, 0],
    [0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0],
    [2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0],
    [0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0],
    [0, 2, 0, 2, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 2, 0],
    [2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2],
    [0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0],
    [0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0]
];
function levelOneBuild() {
    console.log('game_data:levelOneBuild');
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;
    var numberOfTilesVertically = Math.floor((CANVAS_HEIGHT - 50) / TILE_SIDE_LENGTH);
    var numberOfTilesHorizontally = Math.floor(CANVAS_WIDTH / TILE_SIDE_LENGTH);
    console.log(numberOfTilesHorizontally + " || " + numberOfTilesVertically);
    var tree = new createjs.Bitmap(queue.getResult('tree'));
    var flower = new createjs.Bitmap(queue.getResult('flower'));
    for (var horiz = 0; horiz < numberOfTilesHorizontally; horiz++) {
        for (var vert = 0; vert < numberOfTilesVertically; vert++) {
            switch (levelOneTiles[vert][horiz]) {
                case GREY_BLOCK:
                    //build solid square   
                    //                    var square = new createjs.Shape();
                    //                    square.graphics.beginFill('#DDDDDD').drawRect(0, 0, TILE_SIDE_LENGTH, TILE_SIDE_LENGTH);
                    //                    square.x = horiz * TILE_SIDE_LENGTH + 10; //10 for left and right border as 800 doesn't divide evenly by 30
                    //                    square.y = vert * TILE_SIDE_LENGTH + 55 //50 is the space reserved for top bar and 5 for a border top and bottom
                    //                    square.setBounds(0, 0, TILE_SIDE_LENGTH, TILE_SIDE_LENGTH);
                    //                    stage.addChild(square);
                    //                    levelOneStageObjects.push(square);
                    var treeClone = tree.clone();
                    treeClone.x = horiz * TILE_SIDE_LENGTH + 10;
                    treeClone.y = vert * TILE_SIDE_LENGTH + 55
                    stage.addChild(treeClone);
                    levelOneStageObjects.push(treeClone);
                    unbreakableTiles.push(treeClone);
                    break;
                case BROWN_BLOCK:
                    //                    var box = new createjs.Shape();
                    //                    box.graphics.beginFill('#B9997F').drawRect(0, 0,
                    //                    TILE_SIDE_LENGTH, TILE_SIDE_LENGTH);
                    //                    box.x = horiz * TILE_SIDE_LENGTH + 10;
                    //                    box.y = vert * TILE_SIDE_LENGTH + 55;
                    //                    box.setBounds(0, 0, TILE_SIDE_LENGTH, TILE_SIDE_LENGTH);
                    //                    stage.addChild(box);
                    //                    levelOneStageObjects.push(box);
                    var flowerClone = flower.clone();
                    flowerClone.x = horiz * TILE_SIDE_LENGTH + 10;
                    flowerClone.y = vert * TILE_SIDE_LENGTH + 55
                    stage.addChild(flowerClone);
                    levelOneStageObjects.push(flowerClone);
                    breakableTiles.push(flowerClone);
                    break;
            }
        }
    }

    hideLevelOne();
}

function fillTopBarUI() {
    playerData.forEach(function (player, index) {
        console.log('playerIndex: ' + index);
        if(player.ready) {
            var uiSpriteClone = playerSprites[index].clone(true);
            uiSpriteClone.x = 25 + 175 * index;
            uiSpriteClone.y = 11;
            uiSpriteClone.visible = false;
            uiSpriteClone.gotoAndPlay("walkDown");
            
            var redX = new createjs.Bitmap(queue.getResult('redX'));
            redX.x = 25 + 175 * index;
            redX.y = 11;
            redX.visible = false;
            redXArray.push(redX);
            
            player.nameText.x = 68 + 175 * index;
            player.nameText.y = 11;
            player.nameText.visible = false;
            player.scoreText.x = 68 + 175 * index;
            player.scoreText.y = 11 + 15;
            player.scoreText.visible = false;
            topBarObjects.push(player.nameText);
            topBarObjects.push(player.scoreText);
            topBarObjects.push(uiSpriteClone);
            stage.addChild(uiSpriteClone);
            stage.addChild(redX);
        }
    });
}

function topBarUIBuild() {
    var topBar = new createjs.Shape();
    topBar.graphics.beginFill('#CCDDCC').drawRect(0, 0, CANVAS_WIDTH, 50);
    topBar.x = 0;
    topBar.y = 0;
    topBar.visible = false;
    topBarUI = topBar;
    var titleScreenIndex = stage.getChildIndex(playAreaScreen);
    stage.addChildAt(topBar, titleScreenIndex + 1);
}
//Rework this to accept an (2D?) array with characters denoting which type of block is places (bombable/unbombable)