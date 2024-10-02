import {ScaleLinear} from 'd3-scale';

import {TPeriodsScale} from './periodsScale';

type TGetY_Kwargs = {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
	domainIndex: number;
};

type TGetX_Kwargs = {
	periodsScale: TPeriodsScale;
	domainIndex: number;
};

const getX = ({periodsScale, domainIndex}: TGetX_Kwargs) => {
	const percFloorRange = 1 - (domainIndex - Math.floor(domainIndex));
	const percNextRange = 1 - percFloorRange;

	const floorIndexRange = periodsScale.getBandFromIndex(
		Math.floor(domainIndex)
	).x1;
	const nextIndexRange = periodsScale.getBandFromIndex(
		Math.floor(domainIndex)
	).x2;

	const x = floorIndexRange * percFloorRange + nextIndexRange * percNextRange;
	return x;
};

// TODO rename to periodsScale.scale(domainIndex, yScale, timeSeries) or so
export const getXY = ({
	periodsScale,
	yScale,
	timeSeries,
	domainIndex,
}: TGetY_Kwargs) => {
	const x = getX({periodsScale, domainIndex});

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

		return {
			x,
			y: yScale(
				currentTsValue * currentTsValueWeight +
					nearestTsValue * (1 - currentTsValueWeight)
			),
		};
	}

	return {
		x,
		y: null,
	};
};

export const getXYRight = ({
	periodsScale,
	yScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const {x, y} = getXY({
		periodsScale,
		yScale,
		timeSeries,
		domainIndex: visibleDomainIndexEnd,
	});

	return {
		x,
		y,
	};
};

export const getXYRightClamped = ({
	periodsScale,
	yScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const isOverLastValuePoint =
		visibleDomainIndexEnd > periodsScale.dates.length - 0.5;

	if (!isOverLastValuePoint) {
		const {x, y} = getXY({
			periodsScale,
			yScale,
			timeSeries,
			domainIndex: visibleDomainIndexEnd,
		});
		return {x, y};
	}

	// now this happens when we are over last value point
	const {x, y} = getXY({
		periodsScale,
		yScale,
		timeSeries,
		domainIndex: periodsScale.dates.length - 0.5,
	});
	return {x, y};
};

export const getXYLeft = ({
	periodsScale,
	yScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexStart = visibleDomainIndices[0];

	const {x, y} = getXY({
		periodsScale,
		yScale,
		timeSeries,
		domainIndex: visibleDomainIndexStart,
	});

	return {
		x,
		y,
	};
};

export const getXYLeftClamped = ({
	periodsScale,
	yScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexStart = visibleDomainIndices[0];

	const isUnderFirstValuePoint = visibleDomainIndexStart < 0.5;

	if (!isUnderFirstValuePoint) {
		const {x, y} = getXY({
			periodsScale,
			yScale,
			timeSeries,
			domainIndex: visibleDomainIndexStart,
		});
		return {x, y};
	}

	// now this happens when we are under first value point
	const {x, y} = getXY({
		periodsScale,
		yScale,
		timeSeries,
		domainIndex: 0.5,
	});
	return {x, y};
};
