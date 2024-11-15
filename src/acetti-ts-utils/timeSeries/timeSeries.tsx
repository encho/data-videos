import invariant from 'tiny-invariant';
import {max, min} from 'd3-array';

import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';

export type TimeSeriesItemValue = number | null;
export type TimeSeriesItem = {date: Date; value: TimeSeriesItemValue};
export type TimeSeries = TimeSeriesItem[];

export function getFirstNItems(timeSeries: TimeSeries, n: number): TimeSeries {
	return timeSeries.slice(0, n);
}

export type TimeSeriesNumeric = TimeSeriesItemNumeric[];

export type TimeSeriesItemNumeric = {
	date: Date;
	value: number;
};

/**
 * Filters out null values from a TimeSeries and returns a TimeSeries with numeric values only.
 *
 * @param {TimeSeries} timeSeries - The input time series.
 * @returns {TimeSeriesNumeric} - A new time series with only numeric values.
 */
export function getNumericTimeSeries(
	timeSeries: TimeSeries
): TimeSeriesNumeric {
	return timeSeries
		.filter((item): item is {date: Date; value: number} => item.value !== null)
		.map(({date, value}) => ({date, value})); // Ensures the returned type
}
// const sampleTimeSeries: TimeSeries = [
// 	{ date: new Date('2023-01-01'), value: 100 },
// 	{ date: new Date('2023-01-02'), value: null },
// 	{ date: new Date('2023-01-03'), value: 200 },
// 	{ date: new Date('2023-01-04'), value: null },
// 	{ date: new Date('2023-01-05'), value: 150 },
// ];
// const numericTimeSeries = getNumericTimeSeries(sampleTimeSeries);
// console.log(numericTimeSeries);
// [
//   { date: new Date('2023-01-01T00:00:00.000Z'), value: 100 },
//   { date: new Date('2023-01-03T00:00:00.000Z'), value: 200 },
//   { date: new Date('2023-01-05T00:00:00.000Z'), value: 150 }
// ]

/**
 * Extracts all numeric values from a given time series.
 *
 * This function filters out any `null` values from the `value` property
 * of each `TimeSeriesItem` and returns an array of numeric values.
 *
 * @param {TimeSeries} timeSeries - The time series array to filter.
 * @returns {number[]} - An array of numeric values extracted from the time series.
 */
export function getAllNumericValues(timeSeries: TimeSeries) {
	const values = timeSeries.map((it) => it.value);
	const numericValues: number[] = values.filter(
		(it): it is number => it !== null
	);

	return numericValues;
}
// // Define some sample data
// const sampleTimeSeries: TimeSeries = [
// 	{ date: new Date('2023-01-01'), value: 100 },
// 	{ date: new Date('2023-01-02'), value: null },
// 	{ date: new Date('2023-01-03'), value: 200 },
// 	{ date: new Date('2023-01-04'), value: null },
// 	{ date: new Date('2023-01-05'), value: 150 },
// ];
// // Call the function
// const numericValues = getAllNumericValues(sampleTimeSeries);
// console.log(numericValues); // Output: [100, 200, 150]

/**
 * Returns the first non-null value in a TimeSeries.
 *
 * @param {TimeSeries} timeSeries - The input time series.
 * @returns {number} - The first non-null value.
 */
export function getFirstNonNullValue(timeSeries: TimeSeries): number {
	for (const item of timeSeries) {
		if (item.value !== null) {
			return item.value;
		}
	}
	throw Error('getFirstNonNullValue: No non-null value found!');
	// return null; // No non-null value found
}

/**
 * Returns the last non-null value in a TimeSeries.
 *
 * @param {TimeSeries} timeSeries - The input time series.
 * @returns {number} - The first non-null value.
 */
export function getLastNonNullValue(timeSeries: TimeSeries): number {
	for (let i = timeSeries.length - 1; i >= 0; i--) {
		if (timeSeries[i].value !== null) {
			return timeSeries[i].value!; // typescript non-null assertion here, after filtering (!)
		}
	}
	throw Error('getLastNonNullValue: No non-null value found!');
}

/**
 * Applies a given function to each value in a TimeSeries and returns a new TimeSeries.
 *
 * If the original value is `null`, the resulting value will also be `null`.
 *
 * @param {TimeSeries} timeSeries - The input time series.
 * @param {(value: number) => number} transformFn - The function to apply to each non-null value.
 * @returns {TimeSeries} - A new time series with transformed values.
 */
export function mapTimeSeries(
	timeSeries: TimeSeries,
	transformFn: (value: number) => number
): TimeSeries {
	return timeSeries.map(({date, value}) => ({
		date,
		value: value === null ? null : transformFn(value),
	}));
}
// const sampleTimeSeries: TimeSeries = [
// 	{ date: new Date('2023-01-01'), value: 100 },
// 	{ date: new Date('2023-01-02'), value: null },
// 	{ date: new Date('2023-01-03'), value: 200 },
// 	{ date: new Date('2023-01-04'), value: null },
// 	{ date: new Date('2023-01-05'), value: 150 },
// ];
// // Example transformation: multiply each value by 2
// const transformedSeries = mapTimeSeries(sampleTimeSeries, (value) => value * 2);
// console.log(transformedSeries);
// [
//   { date: new Date('2023-01-01T00:00:00.000Z'), value: 200 },
//   { date: new Date('2023-01-02T00:00:00.000Z'), value: null },
//   { date: new Date('2023-01-03T00:00:00.000Z'), value: 400 },
//   { date: new Date('2023-01-04T00:00:00.000Z'), value: null },
//   { date: new Date('2023-01-05T00:00:00.000Z'), value: 300 }
// ]

/**
 * Calculates the percentage change between the first and last non-null values in a TimeSeries.
 *
 * @param {TimeSeries} timeSeries - The input time series.
 * @returns {number} - The percentage change as a decimal (1.0 represents 100%).
 */
export function getPercentageChange(timeSeries: TimeSeries): number {
	const firstValue = getFirstNonNullValue(timeSeries);
	const lastValue = getLastNonNullValue(timeSeries);

	// Ensure both first and last values are valid numbers
	invariant(
		firstValue !== null,
		'The time series has no non-null values for the first element.'
	);
	invariant(
		lastValue !== null,
		'The time series has no non-null values for the last element.'
	);

	return (lastValue - firstValue) / firstValue;
}
// const sampleTimeSeries: TimeSeries = [
// 	{ date: new Date('2023-01-01'), value: null },
// 	{ date: new Date('2023-01-02'), value: 100 },
// 	{ date: new Date('2023-01-03'), value: null },
// 	{ date: new Date('2023-01-04'), value: 200 },
// 	{ date: new Date('2023-01-05'), value: null },
// ];
// const percentageChange = getPercentageChange(sampleTimeSeries);
// console.log('Percentage Change:', percentageChange);
// Percentage Change: 1 // Represents 100% change from 100 to 200

/**
 * Filters a time series array to include only data points with dates between
 * the specified minimum and maximum dates (inclusive).
 * @param {TimeSeries} timeSeries - The time series array to filter.
 * @param {Date} minDate - The minimum date (inclusive).
 * @param {Date} maxDate - The maximum date (inclusive).
 * @returns {TimeSeries} A new time series array containing only the data points
 * with dates between minDate and maxDate (inclusive).
 */
export function getTimeSeriesSlice(
	timeSeries: TimeSeries,
	minDate: Date,
	maxDate: Date
) {
	return timeSeries.filter(
		(dataPoint) => dataPoint.date >= minDate && dataPoint.date <= maxDate
	);
}

/**
 * Filters a time series array to include only data points with dates between
 * the specified minimum and maximum dates (inclusive).
 * @param {TimeSeries} timeSeries - The time series array to filter.
 * @param {number} startIndex
 * @param {number} endIndex
 * @returns {TimeSeries} A new time series array containing only the data points
 * with dates between minDate and maxDate (inclusive).
 */
export function getFullyVisibleTimeSeriesSliceFromFloatIndices(
	timeSeries: TimeSeries,
	startIndex: number,
	endIndex: number
) {
	return timeSeries.slice(Math.ceil(startIndex), Math.floor(endIndex) + 1);
}

/**
 * Finds the two data points with the nearest dates to the given target date.
 * @param {TimeSeries} timeSeries - The time series array to search.
 * @param {Date} targetDate - The target date for which to find the nearest data points.
 * @returns {{ before: { date: Date; value: number } | null; after: { date: Date; value: number } | null }} An object containing the data points closest to the target date. The 'before' property holds the data point with the date closest to the target date in the past, and the 'after' property holds the data point with the date closest to the target date in the future. If no data point is found before or after the target date, the corresponding property is null.
 */
export function findNearestDataPoints(
	timeSeries: TimeSeries,
	targetDate: Date
): {
	// before: {date: Date; value: number} | null;
	// after: {date: Date; value: number} | null;
	before: TimeSeriesItem;
	after: TimeSeriesItem;
} {
	const sortedSeries = timeSeries
		.slice()
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	let before: TimeSeriesItem | null = null;
	let after: TimeSeriesItem | null = null;

	for (const dataPoint of sortedSeries) {
		if (dataPoint.date <= targetDate) {
			before = dataPoint;
		} else {
			after = dataPoint;
			break;
		}
	}

	if (before === null && after !== null) {
		before = after;
	}
	if (after === null && before !== null) {
		after = before;
	}

	invariant(after !== null && before !== null);

	return {before, after};
}

/**
 * Performs linear interpolation between two data points based on a given current date.
 * @param {TimeSeries} timeSeries - The current TimeSeries
 * @param {Date} currentDate - The current date for which to perform interpolation.
 * @returns {number | null} The interpolated value at the current date between the values of dataPoint1 and dataPoint2.
 * Returns null if the current date is outside the range defined by the two data points.
 */
export function getInterpolatedValue(
	timeSeries: TimeSeries,
	currentDate: Date
): TimeSeriesItemValue {
	const {before: dataPoint1, after: dataPoint2} = findNearestDataPoints(
		timeSeries,
		currentDate
	);

	const {date: date1, value: value1} = dataPoint1;
	const {date: date2, value: value2} = dataPoint2;

	invariant(!(currentDate < date1 || currentDate > date2));

	// Calculate the fractional distance between the two dates
	const totalRange = date2.getTime() - date1.getTime();
	const currentOffset = currentDate.getTime() - date1.getTime();
	const fraction = currentOffset / totalRange;

	if (totalRange === 0) {
		return value1;
	}

	if (value1 === null || value2 === null) {
		return null;
	}

	// Perform linear interpolation
	const interpolatedValue = value1 + fraction * (value2 - value1);
	return interpolatedValue;
}

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO into periodsScale namespace
export const getYDomain = (
	yDomainType: TYDomainType,
	timeSeries: TimeSeries,
	_visibleDomainIndices: [number, number],
	periodsScale: TPeriodsScale
) => {
	const numericValues = getAllNumericValues(timeSeries);

	if (yDomainType === 'FULL') {
		const yDomainMin = min(numericValues);
		const yDomainMax = max(numericValues);
		return [yDomainMin, yDomainMax] as [number, number];
	}

	if (yDomainType === 'ZERO_FULL') {
		const yDomainMax = max(numericValues);
		return [0, yDomainMax] as [number, number];
	}

	if (yDomainType === 'VISIBLE') {
		return periodsScale.getTimeSeriesInterpolatedExtent(timeSeries);
	}

	// fallback to the full domain
	const yDomainMin = min(numericValues);
	const yDomainMax = max(numericValues);
	return [yDomainMin, yDomainMax] as [number, number];
};
