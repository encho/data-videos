export class SeededRandom {
	private seed: number;

	constructor(seed: number) {
		this.seed = seed;
	}

	// Linear Congruential Generator (LCG)
	private random(): number {
		const a = 1664525;
		const c = 1013904223;
		const m = 2**32;
		this.seed = (a * this.seed + c) % m;
		return this.seed / m;
	}

	// Generate a random number between min and max (inclusive)
	public randomBetween(min: number, max: number): number {
		return Math.floor(this.random() * (max - min + 1)) + min;
	}
}
// // Example usage:
// const seed = 12345; // Your seed value
// const seededRandom = new SeededRandom(seed);

// const randomNumber = seededRandom.randomBetween(0, 90);
// console.log(randomNumber);
