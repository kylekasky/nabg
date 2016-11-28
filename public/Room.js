var roomCount = 0;

var Room = function () {
    this.id = roomCount++;
    this.players = [];
    this.MAX_COUNT = 4;
}

// Tower.prototype.shootBullet = function () {
//     this.bullet.draw();
// }

// Tower.prototype.showRange = function () {
//     if (!this.rangeGraphics) {
//         this.rangeGraphics = new createjs.Graphics().beginFill("#ff0000").drawRect(this.img.x - (this.range + 32), this.img.y - (this.range + 32), this.range * 2, this.range * 2).endFill();
//         rect = new createjs.Shape(this.rangeGraphics);
//         rect.alpha = .3;
//         stage.addChild(rect);
//     }
//     else {
//         rect.graphics.clear().beginFill("#ff0000").drawRect(this.img.x - (this.range + 32), this.img.y - (this.range + 32), this.range * 2, this.range * 2).endFill();
//         stage.update();
//     }

// }

