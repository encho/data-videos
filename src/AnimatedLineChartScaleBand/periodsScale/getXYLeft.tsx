import {ScaleLinear} from 'd3-scale';

import {TPeriodsScale} from './periodsScale';

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

	// console.log({visibleDomainIndexStart});

	const {x, y} = getY({
		periodsScale,
		yScale,
		timeSeries,
		domainIndex: visibleDomainIndexStart,
	});

	return {
		x,
		y,
	};

	// const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	// const visibleDomainIndexStart = visibleDomainIndices[0];

	// const floorIndexStart = Math.floor(visibleDomainIndexStart);

	// const value = timeSeries[floorIndexStart].value;
	// const scaledValue = yScale(value);

	// return {
	// 	x: periodsScale.getBandFromIndex(floorIndexStart).centroid,
	// 	y: scaledValue,
	// };
};

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
		// Math.ceil(domainIndex)
	).x1;
	const nextIndexRange = periodsScale.getBandFromIndex(
		// Math.floor(domainIndex) + 1
		Math.floor(domainIndex)
		// Math.ceil(domainIndex)
	).x2;

	const x = floorIndexRange * percFloorRange + nextIndexRange * percNextRange;
	return x;
};

// TODO rename to periodsScale.scale(domainIndex, yScale, timeSeries) or so
const getY = ({
	periodsScale,
	yScale,
	timeSeries,
	domainIndex,
}: TGetY_Kwargs) => {
	const x = getX({periodsScale, domainIndex});

	// const adjustedDomainIndex = domainIndex + 0.5;

	// const floorAdjustedIndex = Math.floor(adjustedDomainIndex);
	// const nextAdjustedIndex = floorAdjustedIndex + 1;

	// const percAdjustedFloorValue = 1 - (adjustedDomainIndex - floorAdjustedIndex);
	// const percAdjustedNextValue = 1 - percAdjustedFloorValue;

	// const floorTsItem = timeSeries[floorAdjustedIndex];
	// const nextTsItem = timeSeries[nextAdjustedIndex];

	// if (floorTsItem && nextTsItem) {
	// 	const floorTsValue = floorTsItem.value;
	// 	const nextTsValue = nextTsItem.value;

	// 	return {
	// 		x,
	// 		y: yScale(
	// 			floorTsValue * percAdjustedFloorValue +
	// 				nextTsValue * percAdjustedNextValue
	// 		),
	// 	};

	// const adjustedDomainIndex = domainIndex + 0.5;
	const currentDomainIndex = Math.floor(domainIndex);
	const percOfIndexComplete = domainIndex - currentDomainIndex;
	const currentTsValueWeight = 1 - Math.abs(percOfIndexComplete - 0.5);

	const nearestDomainIndex =
		percOfIndexComplete < 0.5 ? currentDomainIndex - 1 : currentDomainIndex + 1;

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

	// TODO implement edge cases
	// console.log({x, y});
	return {y: 0, x: 0};
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

	const {x, y} = getY({
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

// export const getXYRight = ({
// 	periodsScale,
// 	yScale,
// 	timeSeries,
// }: {
// 	periodsScale: TPeriodsScale;
// 	yScale: ScaleLinear<number, number>;
// 	timeSeries: {value: number; date: Date}[];
// }) => {
// 	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
// 	const visibleDomainIndexEnd = visibleDomainIndices[1];

// 	const floorIndexEnd = Math.floor(visibleDomainIndexEnd);

// 	const value = timeSeries[floorIndexEnd].value;
// 	const scaledValue = yScale(value);

// 	return {
// 		x: periodsScale.getBandFromIndex(floorIndexEnd).centroid,
// 		y: scaledValue,
// 	};
// };
