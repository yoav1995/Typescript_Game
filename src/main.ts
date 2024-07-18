import { Boat, Parachutist } from "./models";

//------Important comment------
// I didnt write class for the airplane because it doesn't have properties except for X,Y for the movement and Image
// The Boat and Parachutist instead, needs more properties because of the interaction they have with other objects.

//------Object's classes-----//

//-------------Main Game Class------------
const LEFT_DIRECTION = -1;
const RIGHT_DIRECTION = 1;
const PARACHUTIST_OFFSET = 40;
class Game {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D | null;
  boat: Boat;
  parachutists: Parachutist[];
  airplane: HTMLImageElement;
  parachutistImage: HTMLImageElement;
  boatImage: HTMLImageElement;
  seaImage: HTMLImageElement;
  score: number;
  lives: number;
  airplaneX: number;
  airplaneDirection: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvasContext = this.canvas.getContext("2d");

    if (this.canvasContext === null) {
      throw new Error("Unable to get 2D rendering context.");
    }

    this.boat = new Boat(this.canvas.width / 2 - 40, this.canvas.height - 50);
    this.parachutists = []; // That way i can drop more than 1 parachutist simultaneously
    this.score = 0;
    this.lives = 3;
    this.airplaneX = this.canvas.width;
    this.airplaneDirection = LEFT_DIRECTION;

    // Load images
    this.airplane = new Image();
    this.airplane.src = "./images/plane.png";

    this.parachutistImage = new Image();
    this.parachutistImage.src = "./images/parachutist.png";

    this.boatImage = new Image();
    this.boatImage.src = "./images/boat.png";

    this.seaImage = new Image();
    this.seaImage.src = "./images/sea.png";

    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.spawnParachutist();
    this.gameLoop();

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    this.boat.x = event.clientX - this.canvas.offsetLeft - this.boat.width / 2;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.boat.moveLeft();
    } else if (event.key === "ArrowRight") {
      this.boat.moveRight();
    }
  }

  spawnParachutist() {
    const x = this.airplaneX + PARACHUTIST_OFFSET; // Spawn directly below airplane
    const parachutist = new Parachutist(x, 50); // Start position below airplane
    this.parachutists.push(parachutist);
    setTimeout(() => {
      this.spawnParachutist();
    }, 2000);
  }

  // --------This is the heart of the game-------
  // In this method i want to check several conditions:
  // Is the parachutist colide with the boat? if does succsess!
  // Is the parachutist reached the sea? failed!
  // Right after the collision, is the specific parachutist is active?
  // This is important for preventig a case where the parachutists found the boat but the user still lost a life.

  checkCollision() {
    this.parachutists.forEach((parachutist) => {
      if (
        parachutist.x < this.boat.x + this.boat.width &&
        parachutist.x + parachutist.width > this.boat.x &&
        parachutist.y + parachutist.height > this.boat.y &&
        parachutist.y < this.boat.y + this.boat.height &&
        parachutist.active
      ) {
        parachutist.active = false;
        this.score += 10;
        this.updateScoreDisplay();
      }
      if (
        parachutist.y + parachutist.height >= this.canvas.height &&
        parachutist.active
      ) {
        parachutist.active = false;
        this.lives--;
        this.updateScoreDisplay();
        if (this.lives == 0) {
          this.endGame();
        }
      }
    });
  }

  updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
      scoreElement.textContent = `Score: ${this.scorePad(
        this.score,
        4
      )} | Lives: ${this.lives}`;
    }
  }

  endGame() {
    alert(`Game Over! Your final score is ${this.score}`);
  }

  //This method was made for format numbers as strings with leading zeros. (on the score display)
  scorePad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  // A game loop that happens every frame. similar to the "update()" function on unity 3d.
  gameLoop() {
    this.canvasContext!.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasContext!.drawImage(
      this.seaImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.canvasContext!.drawImage(this.airplane, this.airplaneX, 20, 100, 50);

    // Move airplane
    this.airplaneX += 2 * this.airplaneDirection;
    if (this.airplaneX <= -100 || this.airplaneX >= this.canvas.width) {
      this.airplaneDirection *= LEFT_DIRECTION; // Change direction when reaching the edge
    }

    this.canvasContext!.drawImage(
      this.boatImage,
      this.boat.x,
      this.boat.y,
      this.boat.width,
      this.boat.height
    );

    this.parachutists.forEach((parachutist) => {
      if (parachutist.active == true) {
        this.canvasContext!.drawImage(
          this.parachutistImage,
          parachutist.x,
          parachutist.y,
          parachutist.width,
          parachutist.height
        );
      }
      parachutist.update();
    });

    this.checkCollision();

    // This one for the binding of the game animations and the browser
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

new Game("gameCanvas");
