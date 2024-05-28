import { Boat, Parachutist } from './models';

//------Important comment------
// I didnt write class for the airplane because it doesn't have properties except for X,Y for the movement and Image
// The Boat and Parachutist instead, needs more properties because of the interaction they have with other objects.

//------Object's classes-----//

//-------------Main Game Class------------

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
	airplaneDirection: number; // for the movement forwards and backwards

	constructor(canvasId: string) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.canvasContext = this.canvas.getContext('2d');

		if (this.canvasContext === null) {
			throw new Error('Unable to get 2D rendering context.');
		}

		this.boat = new Boat(this.canvas.width / 2 - 40, this.canvas.height - 50);
		this.parachutists = []; // array of parachutists objects.that way i can drop more than 1 parachutist simultaneously
		this.score = 0;
		this.lives = 3;
		this.airplaneX = this.canvas.width;
		this.airplaneDirection = -1; // -1 for moving left, 1 for moving right

		// Load images
		this.airplane = new Image();
		this.airplane.src = './images/plane.png';

		this.parachutistImage = new Image();
		this.parachutistImage.src = './images/parachutist.png';

		this.boatImage = new Image();
		this.boatImage.src = './images/boat.png';

		this.seaImage = new Image();
		this.seaImage.src = './images/sea.png';

		//mouse movement controll
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		this.spawnParachutist();
		this.gameLoop();

		// Keyboard movement controls
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	handleMouseMove(event: MouseEvent) {
		this.boat.x = event.clientX - this.canvas.offsetLeft - this.boat.width / 2;
	}

	handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			this.boat.moveLeft();
		} else if (event.key === 'ArrowRight') {
			this.boat.moveRight();
		}
	}

	spawnParachutist() {
		const x = this.airplaneX + 40; // Spawn directly below airplane
		const parachutist = new Parachutist(x, 50); // Start position below airplane
		this.parachutists.push(parachutist);
		setTimeout(() => {
			this.spawnParachutist();
		}, 2000);
	}

	// --------This is the heart of the game-------
	// in this method i want to check several conditions:
	// is the parachutist colide with the boat? if does succsess!
	// is the parachutist reached the sea? failed!
	// right after the collision, is the specific parachutist is active?
	// this is important for preventig a case where the parachutists found the boat but the user still lost a life.

	checkCollision() {
		this.parachutists.forEach((parachutist) => {
			if (
				parachutist.x < this.boat.x + this.boat.width &&
				parachutist.x + parachutist.width > this.boat.x &&
				parachutist.y + parachutist.height > this.boat.y &&
				parachutist.y < this.boat.y + this.boat.height
			) {
				if (parachutist.active == true) {
					parachutist.active = false;
					this.score += 10;
					this.updateScoreDisplay();
				}
			}
			if (
				parachutist.y + parachutist.height >= this.canvas.height &&
				parachutist.active == true
			) {
				parachutist.active = false;
				this.lives--;
				this.updateScoreDisplay();
				if (this.lives === 0) {
					this.endGame();
				}
			}
		});
	}

	updateScoreDisplay() {
		const scoreElement = document.getElementById('score');
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

	//this method was made for format numbers as strings with leading zeros. (on the score display)
	scorePad(num: number, size: number): string {
		let s = num + '';
		while (s.length < size) s = '0' + s;
		return s;
	}

	// a game loop that happens every frame. similar to the "update()" function on unity 3d.
	gameLoop() {
		this.canvasContext!.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas

		// Draw sea background
		this.canvasContext!.drawImage(
			this.seaImage,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Draw airplane
		this.canvasContext!.drawImage(this.airplane, this.airplaneX, 20, 100, 50);

		// Move airplane
		this.airplaneX += 2 * this.airplaneDirection;
		if (this.airplaneX <= -100 || this.airplaneX >= this.canvas.width) {
			this.airplaneDirection *= -1; // Change direction when reaching the edge
		}

		// Draw boat
		this.canvasContext!.drawImage(
			this.boatImage,
			this.boat.x,
			this.boat.y,
			this.boat.width,
			this.boat.height
		);

		// Draw parachutists
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
		requestAnimationFrame(this.gameLoop.bind(this)); //this one for the binding of the game animations and the browser
	}
}

new Game('gameCanvas');
