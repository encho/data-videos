import invariant from 'tiny-invariant';
import {max, min} from 'd3-array';

import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';

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

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO into periodsScale namespace
export const getYDomain = (
	yDomainType: TYDomainType,
	timeSeries: {date: Date; value: number}[],
	visibleDomainIndices: [number, number],
	periodsScale: TPeriodsScale
	// withInterpolatedEndValue?: boolean
) => {
	// TODO implement and integrate!
	// 	const interpolatedVisibleStartValue = getInterpolated_VisibleDomainValue_Start({
	// 		periodsScale,
	// 		timeSeries,
	// 	});

	// let interpolatedVisibleEndValue;
	// if (withInterpolatedEndValue) {
	// }

	// const interpolatedVisibleEndValue = getInterpolated_VisibleDomainValue_End({
	// 	periodsScale,
	// 	timeSeries,
	// });

	// ====================================================================
	// !! ENCHO CONTINUE HERE AND TRY?AIM TO DEPRECATE THE ABOVE FUNCTIONS
	// ====================================================================
	// TODO implement these two and respect them in the min/max calculations
	// const interpolatedStartValue = ;
	// const interpolatedEndValue = ;

	if (yDomainType === 'FULL') {
		const yDomainMin = min(timeSeries.map((it) => it.value));
		const yDomainMax = max(timeSeries.map((it) => it.value));
		return [yDomainMin, yDomainMax] as [number, number];
	} else if (yDomainType === 'ZERO_FULL') {
		const yDomainMax = max(timeSeries.map((it) => it.value));
		return [0, yDomainMax] as [number, number];
	} else if (yDomainType === 'VISIBLE') {
		// const visibleTimeSeriesSlice =
		// 	getFullyVisibleTimeSeriesSliceFromFloatIndices(
		// 		timeSeries,
		// 		visibleDomainIndices[0],
		// 		visibleDomainIndices[1]
		// 	);

		// // the visible domain
		// const fullyVisibleYDomainMin = min(
		// 	visibleTimeSeriesSlice.map((it) => it.value)
		// ) as number;

		// const fullyVisibleYDomainMax = max(
		// 	visibleTimeSeriesSlice.map((it) => it.value)
		// ) as number;

		// const yDomainMin = min([
		// 	fullyVisibleYDomainMin,
		// 	// interpolatedVisibleEndValue,
		// ]);

		// const yDomainMax = max([
		// 	fullyVisibleYDomainMax,
		// 	// interpolatedVisibleEndValue,
		// ]);

		// return [yDomainMin, yDomainMax] as [number, number];

		return periodsScale.getTimeSeriesInterpolatedExtent(timeSeries);
	}

	// fallback to the full domain
	const yDomainMin = min(timeSeries.map((it) => it.value));
	const yDomainMax = max(timeSeries.map((it) => it.value));
	return [yDomainMin, yDomainMax] as [number, number];
};
