// Flock object
// Does very little, simply manages the array of all the boids
class Flock {
	constructor() {
		this.boids = [];
	}

	run() {
		for (let i = 0; i < this.boids.length; i++) {
			this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
		}
	}

	addBoid(b) {
		this.boids.push(b);
	}
}
