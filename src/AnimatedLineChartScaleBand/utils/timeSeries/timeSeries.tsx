import invariant from 'tiny-invariant';
import {TimeSeries} from './generateBrownianMotionTimeSeries';

//TODO  TIMESERIES NAMESPACE
// *********************
export function getFirstNItems(timeSeries: TimeSeries, n: number): TimeSeries {
	return timeSeries.slice(0, n);
}

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
	before: {date: Date; value: number};
	after: {date: Date; value: number};
} {
	const sortedSeries = timeSeries
		.slice()
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	let before: {date: Date; value: number} | null = null;
	let after: {date: Date; value: number} | null = null;

	for (const dataPoint of sortedSeries) {
		if (dataPoint.date <= targetDate) {
			before = dataPoint;
		} else {
			after = dataPoint;
			break;
		}
	}

	if (before == null && after !== null) {
		before = after;
	}
	if (after == null && before !== null) {
		after = before;
	}

	invariant(after !== null && before !== null);

	return {before, after};
}

// interface DataPoint {
// 	date: Date;
// 	value: number;
// }

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
): number {
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

	// Perform linear interpolation
	const interpolatedValue = value1 + fraction * (value2 - value1);
	return interpolatedValue;
}
