import {ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TPeriodsScale} from './periodsScale';

const isAfterCentroid = (visibleDomainIndexEnd: number) => {
	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return decimalPart > 0.5 && decimalPart < 1.0;
};

const isBeforeCentroid = (visibleDomainIndexEnd: number) => {
	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return decimalPart > 0 && decimalPart < 0.5;
};

const isSpotOnCentroid = (visibleDomainIndexEnd: number) => {
	const domainIndexEndDecimalPart =
		visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return domainIndexEndDecimalPart === 0.5;
};

const isFullPeriodEndFunction = (visibleDomainIndexEnd: number) => {
	const domainIndexEndDecimalPart =
		visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return domainIndexEndDecimalPart === 0;
};

const isLastPeriodVisible = (
	visibleDomainIndexEnd: number,
	timeSeries: {date: Date}[]
) => {
	const isLastPeriod =
		Math.ceil(visibleDomainIndexEnd) === timeSeries.length - 1;
	return isLastPeriod;
};

// TODO into periodsScale namespace
export const getXY = ({
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

	let xy;

	if (isLastPeriodVisible(visibleDomainIndexEnd, timeSeries)) {
		xy = getXY_InLastPeriod({periodsScale, yScale, timeSeries});
	} else if (isFullPeriodEndFunction(visibleDomainIndexEnd) == true) {
		xy = getXY_FullPeriodEnd({periodsScale, yScale, timeSeries});
	} else if (isSpotOnCentroid(visibleDomainIndexEnd) == true) {
		xy = getXY_SpotOnCentroid({periodsScale, yScale, timeSeries});
	} else if (isBeforeCentroid(visibleDomainIndexEnd) === true) {
		xy = getXY_BeforeCentroid({periodsScale, yScale, timeSeries});
	} else if (isAfterCentroid(visibleDomainIndexEnd) === true) {
		xy = getXY_AfterCentroid({periodsScale, yScale, timeSeries});
	}

	invariant(xy);
	return xy;
};

const getXY_SpotOnCentroid = ({
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

	const spotOnPeriodIndex = Math.ceil(visibleDomainIndexEnd);

	const spotOnCentroid =
		periodsScale.getBandFromIndex(spotOnPeriodIndex).centroid;

	const x = spotOnCentroid;
	const value = timeSeries[spotOnPeriodIndex].value;

	const y = yScale(value);

	return {x, y};
};

const getXY_FullPeriodEnd = ({
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

	const leftIndex = Math.floor(visibleDomainIndexEnd);
	const rightIndex = leftIndex + 1;

	const x = periodsScale.getBandFromIndex(leftIndex).x2;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const y = yScale(leftValue * 0.5 + rightValue * 0.5);

	return {x, y};
};

const getXY_AfterCentroid = ({
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

	// TODO rename to lastFullPeriodIndex  and becomingPeriodIndex or so
	const leftIndex = Math.ceil(visibleDomainIndexEnd);
	const rightIndex = leftIndex + 1;

	const currentVisibleCentroid =
		periodsScale.getBandFromIndex(leftIndex).centroid;
	const nextVisibleCentroid =
		periodsScale.getBandFromIndex(rightIndex).centroid;

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);

	const percentNextCentroid = decimalPart - 0.5;
	const percentCurrentCentroid = 1 - percentNextCentroid;

	const x =
		currentVisibleCentroid * percentCurrentCentroid +
		nextVisibleCentroid * percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const y = yScale(
		leftValue * percentCurrentCentroid + rightValue * percentNextCentroid
	);

	return {x, y};
};

const getXY_BeforeCentroid = ({
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

	// TODO rename to lastFullPeriodIndex  and becomingPeriodIndex or so
	const leftIndex = Math.floor(visibleDomainIndexEnd);
	const rightIndex = Math.ceil(visibleDomainIndexEnd);

	const currentVisibleCentroid =
		periodsScale.getBandFromIndex(leftIndex).centroid;
	const nextVisibleCentroid =
		periodsScale.getBandFromIndex(rightIndex).centroid;

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);

	const percentNextCentroid = decimalPart + 0.5;
	const percentCurrentCentroid = 1 - percentNextCentroid;

	const x =
		currentVisibleCentroid * percentCurrentCentroid +
		nextVisibleCentroid * percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const y = yScale(
		leftValue * percentCurrentCentroid + rightValue * percentNextCentroid
	);

	return {x, y};
};

const getXY_InLastPeriod = ({
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

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	const isCentroidThere = decimalPart >= 0.5;

	if (isCentroidThere) {
		const lastIndex = Math.ceil(visibleDomainIndexEnd);
		const x = periodsScale.getBandFromIndex(lastIndex).centroid;
		const value = timeSeries[lastIndex].value;
		const y = yScale(value);
		return {x, y};
	}

	return getXY_BeforeCentroid({periodsScale, yScale, timeSeries});
};
