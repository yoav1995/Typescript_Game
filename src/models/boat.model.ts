export class Boat {
	x: number;
	y: number;
	readonly width: number;
	readonly height: number;
	speed: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.width = 80;
		this.height = 40;
		this.speed = 5;
	}
	// basic movement method by using coordinate axes, in this case the movement is on both X & Y axes.
	// this is the only object that its movement can be contolled.
	moveLeft() {
		this.x -= this.speed;
	}

	moveRight() {
		this.x += this.speed;
	}
}
