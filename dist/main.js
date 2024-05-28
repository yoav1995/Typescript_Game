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
//# sourceMappingURL=main.js.map