(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("./models");
var Game = (function () {
    function Game(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvasContext = this.canvas.getContext('2d');
        if (this.canvasContext === null) {
            throw new Error('Unable to get 2D rendering context.');
        }
        this.boat = new models_1.Boat(this.canvas.width / 2 - 40, this.canvas.height - 50);
        this.parachutists = [];
        this.score = 0;
        this.lives = 3;
        this.airplaneX = this.canvas.width;
        this.airplaneDirection = -1;
        this.airplane = new Image();
        this.airplane.src = './images/plane.png';
        this.parachutistImage = new Image();
        this.parachutistImage.src = './images/parachutist.png';
        this.boatImage = new Image();
        this.boatImage.src = './images/boat.png';
        this.seaImage = new Image();
        this.seaImage.src = './images/sea.png';
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.spawnParachutist();
        this.gameLoop();
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    Game.prototype.handleMouseMove = function (event) {
        this.boat.x = event.clientX - this.canvas.offsetLeft - this.boat.width / 2;
    };
    Game.prototype.handleKeyDown = function (event) {
        if (event.key === 'ArrowLeft') {
            this.boat.moveLeft();
        }
        else if (event.key === 'ArrowRight') {
            this.boat.moveRight();
        }
    };
    Game.prototype.spawnParachutist = function () {
        var _this = this;
        var x = this.airplaneX + 40;
        var parachutist = new models_1.Parachutist(x, 50);
        this.parachutists.push(parachutist);
        setTimeout(function () {
            _this.spawnParachutist();
        }, 2000);
    };
    Game.prototype.checkCollision = function () {
        var _this = this;
        this.parachutists.forEach(function (parachutist) {
            if (parachutist.x < _this.boat.x + _this.boat.width &&
                parachutist.x + parachutist.width > _this.boat.x &&
                parachutist.y + parachutist.height > _this.boat.y &&
                parachutist.y < _this.boat.y + _this.boat.height) {
                if (parachutist.active == true) {
                    parachutist.active = false;
                    _this.score += 10;
                    _this.updateScoreDisplay();
                }
            }
            if (parachutist.y + parachutist.height >= _this.canvas.height &&
                parachutist.active == true) {
                parachutist.active = false;
                _this.lives--;
                _this.updateScoreDisplay();
                if (_this.lives === 0) {
                    _this.endGame();
                }
            }
        });
    };
    Game.prototype.updateScoreDisplay = function () {
        var scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = "Score: ".concat(this.scorePad(this.score, 4), " | Lives: ").concat(this.lives);
        }
    };
    Game.prototype.endGame = function () {
        alert("Game Over! Your final score is ".concat(this.score));
    };
    Game.prototype.scorePad = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(this.seaImage, 0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(this.airplane, this.airplaneX, 20, 100, 50);
        this.airplaneX += 2 * this.airplaneDirection;
        if (this.airplaneX <= -100 || this.airplaneX >= this.canvas.width) {
            this.airplaneDirection *= -1;
        }
        this.canvasContext.drawImage(this.boatImage, this.boat.x, this.boat.y, this.boat.width, this.boat.height);
        this.parachutists.forEach(function (parachutist) {
            if (parachutist.active == true) {
                _this.canvasContext.drawImage(_this.parachutistImage, parachutist.x, parachutist.y, parachutist.width, parachutist.height);
            }
            parachutist.update();
        });
        this.checkCollision();
        requestAnimationFrame(this.gameLoop.bind(this));
    };
    return Game;
}());
new Game('gameCanvas');

},{"./models":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./parachutist.model"), exports);
__exportStar(require("./boat.model"), exports);

},{"./boat.model":2,"./parachutist.model":4}],4:[function(require,module,exports){
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

},{}]},{},[1]);
