function sliceList(list: Date[], startDate: Date, endDate: Date): Date[] {
	// Find the indices of startDate and endDate in the list
	const startIndex = list.findIndex(
		(date) => date.getTime() === startDate.getTime()
	);
	const endIndex = list.findIndex(
		(date) => date.getTime() === endDate.getTime()
	);

	// If either startDate or endDate is not found, or if start index is greater than end index, return an empty array
	if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
		return [];
	}

	// Slice the list from startIndex to endIndex (inclusive)
	return list.slice(startIndex, endIndex + 1);
}

type TTimeScaleBandArgs = {
	domain: Date[];
	visibleRange: {startRange: number; endRange: number};
	visibleDomain: {startDomain: Date; endDomain: Date};
};

export type TTimeBandScale = {
	number_of_categories: number;
	number_of_visible_categories: number;
	// TODO deprecaet
	band_width: number;
	domain: Date[];
	getBand: (d: Date) => {
		x1: number;
		x2: number;
		width: number;
		centroid: number;
	};
	allBandsData: {
		[key: string]: {x1: number; x2: number; centroid: number; width: number};
	};
};

export const createTimeScaleBand = ({
	domain,
	visibleDomain,
	visibleRange,
}: TTimeScaleBandArgs): TTimeBandScale => {
	// get the number of categories
	// TODO add padding possibility
	// const PADDING = in percent

	const number_of_categories = domain.length;

	const visible_categories = sliceList(
		domain,
		visibleDomain.startDomain,
		visibleDomain.endDomain
	);

	const number_of_visible_categories = visible_categories.length;

	const visibleRangeSize = visibleRange.endRange - visibleRange.startRange;

	const band_width = visibleRangeSize / number_of_visible_categories;

	const firstCategoryIndex = domain.findIndex(
		(date) => date.getTime() === visibleDomain.startDomain.getTime()
	);

	const shiftLeft = firstCategoryIndex * band_width;

	const allBandsData: {
		[key: string]: {x1: number; x2: number; centroid: number; width: number};
	} = {};

	domain.forEach((date, i) => {
		const x1 = i * band_width - shiftLeft;
		const x2 = x1 + band_width;
		const centroid = (x1 + x2) / 2;
		allBandsData[date.toISOString()] = {
			x1,
			x2,
			centroid,
			width: band_width,
		};
	});

	const getBand = (date: Date) => {
		const bandData = allBandsData[date.toISOString()];
		return bandData;
	};

	return {
		domain,
		number_of_categories,
		number_of_visible_categories,
		band_width,
		getBand,
		allBandsData,
	};
};

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
	});

	const getBandFromDate = (date: Date) => {
		const bandData = allBandsData[date.toISOString()];
		return bandData;
	};

	const getBandFromIndex = (index: number) => {
		const date = dates[index];
		return getBandFromDate(date);
	};

	return {
		getBandFromDate,
		getBandFromIndex,
	};
};
