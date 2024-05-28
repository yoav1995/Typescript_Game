export class Parachutist {
	x: number;
	y: number;
	speed: number;
	readonly width: number; // readonly because i don't want them to be changed.need these properties only for checking collision
	readonly height: number;
	active: boolean; // special property for the avoidness of both on boat and in the water
	isOnBoat: boolean;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.speed = 2;
		this.width = 20;
		this.height = 20;
		this.active = true;
		this.isOnBoat = false;
	}

	// basic movement method by using coordinate axes, in this case the movement is on Y axis.
	update() {
		if (this.active) {
			this.y += this.speed;
		}
	}
}
