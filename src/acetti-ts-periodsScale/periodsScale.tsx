import {extent} from 'd3-array';

import {TimeSeries} from '../acetti-ts-utils/timeSeries/timeSeries';

type TPeriodScaleBand = {
	index: number;
	x1: number;
	x2: number;
	centroid: number;
	width: number;
};

export type TPeriodsScale = {
	// TODO should be getBandFromPeriod: (p: TPeriod) => TPeriodScaleBand;
	getBandFromDate: (d: Date) => TPeriodScaleBand;
	getIndexFromDate: (d: Date) => number;
	// TODO should be getBandFromPeriodIndex: (pIndex: number) => TPeriodScaleBand;
	getBandFromIndex: (i: number) => TPeriodScaleBand;
	getDateFromIndex: (i: number) => Date;
	getVisibleDomainIndices: () => [number, number];
	getVisibleDomainDates: () => [Date, Date];
	getVisibleDomain_NumberOfDays: () => number;
	mapFloatIndexToRange: (i: number) => number;
	visibleDomainIndices: [number, number];
	visibleRange: [number, number];
	dates: Date[];
	getRoundedVisibleDomainIndices: () => [number, number];
	// TODO shoud return TPeriod[]
	getAllVisibleDates: () => Date[];
	//
	getTimeSeriesInterpolatedExtent: (
		x: TimeSeries,
		paddingPerc?: number
	) => [number, number];
	// new stuff for periodsScale Animation Container..
	fullPeriodDomainIndices: [number, number];
	allYearStartDates: Date[];
};

export const periodsScale = ({
	dates,
	visibleDomainIndices,
	visibleRange,
}: {
	dates: Date[];
	visibleDomainIndices: [number, number];
	visibleRange: [number, number];
}): TPeriodsScale => {
	const visibleRangeSize = visibleRange[1] - visibleRange[0];

	// number of visible bands does not have to be an integer necessarily
	const numberOfVisibleBands =
		visibleDomainIndices[1] - visibleDomainIndices[0];
	// visibleDomainIndices[1] - visibleDomainIndices[0] + 1;

	const bandWidth = visibleRangeSize / numberOfVisibleBands;

	const shiftLeft = bandWidth * visibleDomainIndices[0];

	const allBandsData: {
		[key: string]: {
			index: number;
			x1: number;
			x2: number;
			centroid: number;
			width: number;
		};
	} = {};

	// const allBandsData: {
	// 	// [key: string]: {
	// 	index: number;
	// 	x1: number;
	// 	x2: number;
	// 	centroid: number;
	// 	width: number;
	// 	date: Date;
	// }[] = [];

	dates.forEach((date, i) => {
		const x1 = i * bandWidth - shiftLeft;
		const x2 = x1 + bandWidth;
		const centroid = (x1 + x2) / 2;
		allBandsData[date.toISOString()] = {
			x1,
			x2,
			centroid,
			width: bandWidth,
			index: i,
		};
		// allBandsData.push({
		// 	date,
		// 	x1,
		// 	x2,
		// 	centroid,
		// 	width: bandWidth,
		// 	index: i,
		// });
	});

	const allYearStartDates = getFirstDateOfEachYear(dates);

	const createBandFromIntegerIndex = (i: number) => {
		const x1 = i * bandWidth - shiftLeft;
		const x2 = x1 + bandWidth;
		const centroid = (x1 + x2) / 2;
		return {x1, x2, centroid, width: bandWidth, index: i};
	};

	const getBandFromDate = (date: Date) => {
		const bandData = allBandsData[date.toISOString()];
		return bandData;
	};

	const getBandFromIndex = (index: number) => {
		return createBandFromIntegerIndex(index);
		// const date = dates[index];
		// return getBandFromDate(date);
	};

	const mapFloatIndexToRange = (index: number) => {
		const decimalPart = index - Math.floor(index);

		const leftIndex = Math.floor(index);
		const rightIndex = Math.ceil(index);

		const leftValue = getBandFromIndex(leftIndex).x1;
		const rightValue = getBandFromIndex(rightIndex).x1;

		return leftValue * (1 - decimalPart) + rightValue * decimalPart;
	};

	const getRoundedVisibleDomainIndices = (): [number, number] => {
		return [
			Math.floor(visibleDomainIndices[0]),
			Math.ceil(visibleDomainIndices[1]),
		];
	};

	const getVisibleDomainIndices = () => visibleDomainIndices;

	const getVisibleDomainDates = (): [Date, Date] => {
		const [firstVisibleIndex, lastVisibleIndex] =
			getRoundedVisibleDomainIndices();

		// console.log({firstVisibleIndex, lastVisibleIndex});
		const firstVisibleDate = dates[firstVisibleIndex];
		const lastVisibleDate = dates[lastVisibleIndex - 1];
		// const lastVisibleDate = dates[Math.min(0, lastVisibleIndex - 1)];

		return [firstVisibleDate, lastVisibleDate];
	};

	const getVisibleDomain_NumberOfDays = () => {
		const [firstVisibleDate, lastVisibleDate] = getVisibleDomainDates();
		const numberOfVisibleDays = getDifferenceInDays(
			firstVisibleDate,
			lastVisibleDate
		);
		return numberOfVisibleDays;
	};

	const getAllVisibleDates = () => {
		const indices = getRoundedVisibleDomainIndices();

		// Ensure indices are within array bounds and ordered correctly
		let [startIndex, endIndex] = indices.map((index) =>
			Math.min(Math.max(index, 0), dates.length - 1)
		);
		if (startIndex > endIndex) {
			[startIndex, endIndex] = [endIndex, startIndex];
		}

		// Extract the slice
		// const slicedDates: Date[] = dates.slice(startIndex, endIndex + 1);
		const slicedDates: Date[] = dates.slice(startIndex, endIndex);

		return slicedDates;
	};

	const getDateFromIndex = (ix: number) => {
		return dates[ix];
	};

	const getIndexFromDate = (d: Date) => {
		return dates.indexOf(d);
	};

	const getTimeSeriesInterpolatedExtent = (
		timeSeries: TimeSeries,
		paddingPerc?: number
	) => {
		return getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			visibleDomainIndices,
			paddingPerc
		);
	};

	return {
		// TODO getPeriodFromIndex
		getIndexFromDate,
		getDateFromIndex,
		getBandFromDate,
		getBandFromIndex,
		getVisibleDomainIndices,
		getVisibleDomain_NumberOfDays, // TODO rename to getVisibleNumberOfDays or so
		getVisibleDomainDates,
		mapFloatIndexToRange,
		getRoundedVisibleDomainIndices,
		visibleDomainIndices,
		visibleRange,
		dates,
		getAllVisibleDates,
		//
		getTimeSeriesInterpolatedExtent,
		//
		fullPeriodDomainIndices: [0, dates.length],
		allYearStartDates,
	};
};

type TGetTimeSeriesInterpolatedValueArgs = {
	timeSeries: TimeSeries;
	domainIndex: number;
};

const getTimeSeriesInterpolatedValue = ({
	timeSeries,
	domainIndex,
}: TGetTimeSeriesInterpolatedValueArgs) => {
	const currentDomainIndex = Math.floor(domainIndex);
	const percOfIndexComplete = domainIndex - currentDomainIndex;

	const currentTsValueWeight = 1 - Math.abs(percOfIndexComplete - 0.5);

	const nearestDomainIndex =
		percOfIndexComplete === 0.5
			? currentDomainIndex
			: percOfIndexComplete < 0.5
			? currentDomainIndex - 1
			: currentDomainIndex + 1;

	const currentTsItem = timeSeries[currentDomainIndex];
	const nearestTsItem = timeSeries[nearestDomainIndex];

	if (currentTsItem && nearestTsItem) {
		const currentTsValue = currentTsItem.value;
		const nearestTsValue = nearestTsItem.value;

		return (
			currentTsValue * currentTsValueWeight +
			nearestTsValue * (1 - currentTsValueWeight)
		);
	}

	return null;
};

function getDifferenceInDays(date1: Date, date2: Date): number {
	// console.log({date1, date2});

	// Calculate the difference in time (in milliseconds)
	const timeDifference = date2.getTime() - date1.getTime();

	// Convert the time difference from milliseconds to days
	const daysDifference = timeDifference / (1000 * 3600 * 24);

	// Return the absolute value of the difference in days
	return Math.abs(daysDifference);
}
// // Example usage:
// const date1 = new Date('2024-05-01');
// const date2 = new Date('2024-05-24');
// const difference = getDifferenceInDays(date1, date2);
// console.log(difference); // Output: 23

const mergeExtents = (extents: [number, number][]) => {
	const min = Math.min(...extents.map((it) => it[0]));
	const max = Math.max(...extents.map((it) => it[1]));
	return [min, max] as [number, number];
};

export const getMultiTimeSeriesInterpolatedExtentFromVisibleDomainIndices = (
	timeSeriesArray: TimeSeries[],
	visibleDomainIndices: [number, number]
) => {
	const tsExtents = timeSeriesArray.map((ts) => {
		return getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			ts,
			visibleDomainIndices
		);
	});

	return mergeExtents(tsExtents);
};

export const getTimeSeriesInterpolatedExtentFromVisibleDomainIndices = (
	timeSeries: TimeSeries,
	visibleDomainIndices: [number, number],
	paddingPerc: number = 0
) => {
	const [leftVisibleDomainIndex, rightVisibleDomainIndex] =
		visibleDomainIndices;

	const leftInterpolatedValue = getTimeSeriesInterpolatedValue({
		timeSeries,
		domainIndex: leftVisibleDomainIndex,
	});
	const rightInterpolatedValue = getTimeSeriesInterpolatedValue({
		timeSeries,
		domainIndex: rightVisibleDomainIndex,
	});

	const decimalPartLeftIndex = leftVisibleDomainIndex % 1;
	const decimalPartRightIndex = rightVisibleDomainIndex % 1;

	const lowerSliceIndex =
		decimalPartLeftIndex <= 0.5
			? Math.floor(leftVisibleDomainIndex)
			: Math.ceil(leftVisibleDomainIndex);
	const upperSliceIndex =
		decimalPartRightIndex >= 0.5
			? Math.ceil(rightVisibleDomainIndex)
			: Math.floor(rightVisibleDomainIndex);

	const fullyVisibleTimeSeriesPiece = timeSeries.slice(
		lowerSliceIndex,
		upperSliceIndex
	);

	const timeSeriesExtent = extent(
		fullyVisibleTimeSeriesPiece,
		(it) => it.value
	) as [number, number];

	const maybeValues = [];
	if (leftInterpolatedValue) {
		maybeValues.push(leftInterpolatedValue);
	}
	if (rightInterpolatedValue) {
		maybeValues.push(rightInterpolatedValue);
	}

	const min = Math.min(...maybeValues, timeSeriesExtent[0]);
	const max = Math.max(...maybeValues, timeSeriesExtent[1]);

	// const the_extent = [min, max] as [number, number];

	const extentRange = max - min;

	const BOTTOM_PADDING_PERC = paddingPerc;
	const TOP_PADDING_PERC = paddingPerc;

	const paddedExtent = [
		min - BOTTOM_PADDING_PERC * extentRange,
		max + TOP_PADDING_PERC * extentRange,
	];

	return paddedExtent as [number, number];
};

// TODO rename getFirstPeriodOfEachYear or so...
function getFirstDateOfEachYear(dates: Date[]): Date[] {
	if (dates.length === 0) {
		return [];
	}

	const result: Date[] = [];
	let currentYear = dates[0].getFullYear();

	// Add the first date to the result array
	result.push(dates[0]);

	for (let i = 1; i < dates.length; i++) {
		const date = dates[i];
		const year = date.getFullYear();

		// Check if the year has changed
		if (year !== currentYear) {
			result.push(date);
			currentYear = year;
		}
	}

	return result;
}
