import {TimeSeries} from './timeSeries';

type TCandle = {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
};

export type TOHLCTimeSeries = TCandle[];

/**
 * Seeded random number generator using the linear congruential generator (LCG) method.
 */
function seededRandom(seed: number): () => number {
	let value = seed;
	return () => {
		value = (value * 16807) % 2147483647;
		return (value - 1) / 2147483646;
	};
}

/**
 * Generates a TOHLCTimeSeries object with reproducible open, high, low, and close values.
 *
 * The open value for each period matches the close value of the previous period.
 * High and low values are generated around the open and close prices using a seeded random generator.
 *
 * @param {TimeSeries} timeSeries - The input time series with dates.
 * @param {number} [seed=42] - The seed for the random number generator (optional, default is 42).
 * @returns {TOHLCTimeSeries} - A time series with open-high-low-close data.
 */
export function makeFakeOHLCSeries(
	timeSeries: TimeSeries,
	seed: number = 42
): TOHLCTimeSeries {
	if (timeSeries.length === 0) return [];

	const random = seededRandom(seed);

	const getRandomNumber = (base: number, variance: number) =>
		base + variance * (random() - 0.5) * 2;

	let previousClose = getRandomNumber(100, 20); // Initial close value for first period

	const ohlcSeries: TOHLCTimeSeries = timeSeries.map(({date}) => {
		const open = previousClose;
		const close = getRandomNumber(open, 10);
		const high = Math.max(open, close) + getRandomNumber(0, 5);
		const low = Math.min(open, close) - getRandomNumber(0, 5);

		previousClose = close;

		return {date, open, high, low, close};
	});

	return ohlcSeries;
}
// const sampleTimeSeries: TimeSeries = [
// 	{ date: new Date('2023-01-01'), value: null },
// 	{ date: new Date('2023-01-02'), value: null },
// 	{ date: new Date('2023-01-03'), value: null },
// 	{ date: new Date('2023-01-04'), value: null },
// 	{ date: new Date('2023-01-05'), value: null },
// ];

// // Using the default seed
// const ohlcSeriesDefaultSeed = makeFakeOHLCSeries(sampleTimeSeries);

// console.log('Default Seed:', ohlcSeriesDefaultSeed);

// // Using a custom seed
// const ohlcSeriesCustomSeed = makeFakeOHLCSeries(sampleTimeSeries, 123);

// console.log('Custom Seed:', ohlcSeriesCustomSeed);
