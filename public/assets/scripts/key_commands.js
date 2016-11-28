var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_A = 65;
var KEYCODE_W = 87;
var KEYCODE_D = 68;
var KEYCODE_S = 83;
var KEYCODE_SPACE = 32;
var leftPressed = false;
var rightPressed = false;
var downPressed = false;
var upPressed = false;
var spacePressed = false;

//Forcing arrow key movement to allow for game chat

function handleKeyDown(evt) {
    if (!evt) { var evt = window.event; }  //browser compatibility
    //console.log(evt.keyCode);
    switch (evt.keyCode) {
        case KEYCODE_LEFT: leftPressed = true; return false;
        case KEYCODE_RIGHT: rightPressed = true; return false;
        case KEYCODE_UP: upPressed = true; return false;
        case KEYCODE_DOWN: downPressed = true; return false;
        // case KEYCODE_A: leftPressed = true; return false;
        // case KEYCODE_D: rightPressed = true; return false;
        // case KEYCODE_W: upPressed = true; return false;
        // case KEYCODE_S: downPressed = true; return false;
        case KEYCODE_SPACE: spacePressed = true; return false;
    }
}

function handleKeyUp(evt) {
    if (!evt) { var evt = window.event; }  //browser compatibility
    switch (evt.keyCode) {
        case KEYCODE_LEFT: leftPressed = false; break;
        case KEYCODE_RIGHT: rightPressed = false; break;
        case KEYCODE_UP: upPressed = false; break;
        case KEYCODE_DOWN: downPressed = false; break;
        // case KEYCODE_A: leftPressed = false; break;
        // case KEYCODE_D: rightPressed = false; break;
        // case KEYCODE_W: upPressed = false; break;
        // case KEYCODE_S: downPressed = false; break;
        case KEYCODE_SPACE: spacePressed = false; break;
    }
}

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;