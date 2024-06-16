import gen from 'random-seed';

const randInt = gen.create('My Seed Value');

export type TimeSeries = {date: Date; value: number}[];

type TCandle = {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
};

export type TOHLCTimeSeries = TCandle[];

export function makeFakeOHLCSeries(timeSeries: TimeSeries): TOHLCTimeSeries {
	// Initialize the result array
	const ohlcTimeSeries: TOHLCTimeSeries = [];

	for (let i = 0; i <= timeSeries.length - 1; i++) {
		const tsItem = timeSeries[i];
		if (i === 0) {
			const randomCandle = {
				date: tsItem.date,
				open: tsItem.value * 0.98,
				high: tsItem.value * 1.1,
				low: tsItem.value * 0.9,
				close: tsItem.value,
			};
			// const randomCandle = createRandomCandle(timeSeries[i], undefined);
			ohlcTimeSeries.push(randomCandle);
		} else {
			const randomCandle = createRandomCandle(
				timeSeries[i],
				timeSeries[i - 1].value
			);
			ohlcTimeSeries.push(randomCandle);
		}
	}

	return ohlcTimeSeries;
}

function randomNormalDistribution(): number {
	let u = 0,
		v = 0;
	while (u === 0) u = randInt(100) / 100;
	while (v === 0) v = randInt(100) / 100;
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Function to generate a random number from a standard normal distribution
function createRandomCandle(
	tsItem: {date: Date; value: number},
	openValue: number
): TCandle {
	const close = tsItem.value;
	const open = openValue;

	const high =
		(1 + Math.abs(randomNormalDistribution()) / 15) * Math.max(open, close);
	const low =
		(1 - Math.abs(randomNormalDistribution()) / 15) * Math.min(open, close);

	return {date: tsItem.date, open, high, low, close};
}
