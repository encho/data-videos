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
	// TODO should be getBandFromPeriodIndex: (pIndex: number) => TPeriodScaleBand;
	getBandFromIndex: (i: number) => TPeriodScaleBand;
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
		const slicedDates: Date[] = dates.slice(startIndex, endIndex + 1);

		return slicedDates;
	};

	return {
		getBandFromDate,
		getBandFromIndex,
		getVisibleDomainIndices,
		getVisibleDomain_NumberOfDays,
		getVisibleDomainDates,
		mapFloatIndexToRange,
		getRoundedVisibleDomainIndices,
		visibleDomainIndices,
		visibleRange,
		dates,
		getAllVisibleDates,
	};
};

function getDifferenceInDays(date1: Date, date2: Date): number {
	console.log({date1, date2});

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
