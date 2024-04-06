type TPeriodScaleBand = {
	index: number;
	x1: number;
	x2: number;
	centroid: number;
	width: number;
};

export type TPeriodsScale = {
	getBandFromDate: (d: Date) => TPeriodScaleBand;
	getBandFromIndex: (i: number) => TPeriodScaleBand;
	getVisibleDomainIndices: () => [number, number];
	mapFloatIndexToRange: (i: number) => number;
	visibleDomainIndices: [number, number];
	visibleRange: [number, number];
	dates: Date[];
	getRoundedVisibleDomainIndices: () => [number, number];
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

	return {
		getBandFromDate,
		getBandFromIndex,
		getVisibleDomainIndices: () => visibleDomainIndices,
		mapFloatIndexToRange,
		getRoundedVisibleDomainIndices: () => {
			return [
				Math.floor(visibleDomainIndices[0]),
				Math.ceil(visibleDomainIndices[1]),
			];
		},
		visibleDomainIndices,
		visibleRange,
		dates,
	};
};
