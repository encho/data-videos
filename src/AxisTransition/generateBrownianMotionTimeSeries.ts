export type TimeSeries = {date: Date; value: number}[];

function generateBrownianMotionTimeSeries(
	startDate: Date,
	endDate: Date
): TimeSeries {
	const DRIFT = 0.002;

	// Calculate the number of days between start and end dates
	const days = Math.floor(
		(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
	);

	// Initialize the result array
	const timeSeries: {date: Date; value: number}[] = [];

	// Initial value
	let currentValue = 0;

	// Generate values following Brownian motion
	for (let i = 0; i <= days; i++) {
		// Generate a random increment following a standard normal distribution
		// const randomIncrement = Math.sqrt(1 / 365) * randomNormalDistribution();
		const randomIncrement =
			Math.sqrt(1 / 365) * randomNormalDistribution() + DRIFT;

		// Update the current value
		currentValue += randomIncrement;

		// Create the date for the current iteration
		const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

		// Add the date and value to the result array
		timeSeries.push({date: currentDate, value: currentValue});
	}

	return timeSeries;
}

// Function to generate a random number from a standard normal distribution
function randomNormalDistribution(): number {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Example usage:
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-10');
const timeSeries = generateBrownianMotionTimeSeries(startDate, endDate);
console.log(timeSeries);

export default generateBrownianMotionTimeSeries;
