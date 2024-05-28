"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parachutist = void 0;
var Parachutist = (function () {
    function Parachutist(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.width = 20;
        this.height = 20;
        this.active = true;
        this.isOnBoat = false;
    }
    Parachutist.prototype.update = function () {
        if (this.active) {
            this.y += this.speed;
        }
    };
    return Parachutist;
}());
exports.Parachutist = Parachutist;
//# sourceMappingURL=parachutist.model.js.map