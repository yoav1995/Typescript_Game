"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boat = void 0;
var Boat = (function () {
    function Boat(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 40;
        this.speed = 5;
    }
    Boat.prototype.moveLeft = function () {
        this.x -= this.speed;
    };
    Boat.prototype.moveRight = function () {
        this.x += this.speed;
    };
    return Boat;
}());
exports.Boat = Boat;
//# sourceMappingURL=boat.model.js.map