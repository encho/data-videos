import {ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TPeriodsScale} from './periodsScale';
import {getXYRight} from './getXYLeft';

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

export const getInterpolated_VisibleDomainValue_End = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	// const {x: xRight, y: yRight} = getXYRight({periodsScale, timeSeries, yScale});

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	let interpolatedLastDomainValue;

	if (isLastPeriodVisible(visibleDomainIndexEnd, timeSeries)) {
		interpolatedLastDomainValue = getInterpolated_InLastPeriod({
			periodsScale,
			timeSeries,
		});
	} else if (isFullPeriodEndFunction(visibleDomainIndexEnd) == true) {
		interpolatedLastDomainValue = getInterpolated_FullPeriodEnd({
			periodsScale,
			timeSeries,
		});
	} else if (isSpotOnCentroid(visibleDomainIndexEnd) == true) {
		interpolatedLastDomainValue = getInterpolated_SpotOnCentroid({
			periodsScale,
			timeSeries,
		});
	} else if (isBeforeCentroid(visibleDomainIndexEnd) === true) {
		interpolatedLastDomainValue = getInterpolated_BeforeCentroid({
			periodsScale,
			timeSeries,
		});
	} else if (isAfterCentroid(visibleDomainIndexEnd) === true) {
		interpolatedLastDomainValue = getInterpolated_AfterCentroid({
			periodsScale,
			timeSeries,
		});
	}

	invariant(interpolatedLastDomainValue);
	return interpolatedLastDomainValue;
};

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

const getInterpolated_SpotOnCentroid = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];
	const spotOnPeriodIndex = Math.ceil(visibleDomainIndexEnd);
	const value = timeSeries[spotOnPeriodIndex].value;

	return value;
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

	const value = getInterpolated_SpotOnCentroid({periodsScale, timeSeries});

	const y = yScale(value);

	return {x, y};
};

const getInterpolated_FullPeriodEnd = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const leftIndex = Math.floor(visibleDomainIndexEnd);
	const rightIndex = leftIndex + 1;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	return leftValue * 0.5 + rightValue * 0.5;
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

	const x = periodsScale.getBandFromIndex(leftIndex).x2;

	const interpolatedValue = getInterpolated_FullPeriodEnd({
		periodsScale,
		timeSeries,
	});

	const y = yScale(interpolatedValue);

	return {x, y};
};

const getInterpolated_AfterCentroid = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const leftIndex = Math.ceil(visibleDomainIndexEnd);
	const rightIndex = leftIndex + 1;

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);

	const percentNextCentroid = decimalPart - 0.5;
	const percentCurrentCentroid = 1 - percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const interpolatedValue =
		leftValue * percentCurrentCentroid + rightValue * percentNextCentroid;

	return interpolatedValue;
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

	const interpolatedValue = getInterpolated_AfterCentroid({
		periodsScale,
		timeSeries,
	});

	const y = yScale(interpolatedValue);

	return {x, y};
};

const getInterpolated_BeforeCentroid = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	// TODO rename to lastFullPeriodIndex  and becomingPeriodIndex or so
	const leftIndex = Math.floor(visibleDomainIndexEnd);
	const rightIndex = Math.ceil(visibleDomainIndexEnd);

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);

	const percentNextCentroid = decimalPart + 0.5;
	const percentCurrentCentroid = 1 - percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	return leftValue * percentCurrentCentroid + rightValue * percentNextCentroid;
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

	const interpolatedValue = getInterpolated_BeforeCentroid({
		periodsScale,
		timeSeries,
	});

	const y = yScale(interpolatedValue);

	return {x, y};
};

const getInterpolated_InLastPeriod = ({
	periodsScale,
	timeSeries,
}: {
	periodsScale: TPeriodsScale;
	timeSeries: {value: number; date: Date}[];
}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];
	const lastIndex = Math.ceil(visibleDomainIndexEnd);

	const interpolatedValue = timeSeries[lastIndex].value;
	return interpolatedValue;
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
		const value = getInterpolated_InLastPeriod({timeSeries, periodsScale});
		const y = yScale(value);
		return {x, y};
	}

	return getXY_BeforeCentroid({periodsScale, yScale, timeSeries});
};
