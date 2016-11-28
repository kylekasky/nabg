var levelOneStageObjects = [];
var breakableTiles = [];
var unbreakableTiles = [];
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
//Rework this to accept an (2D?) array with characters denoting which type of block is places (bombable/unbombable)