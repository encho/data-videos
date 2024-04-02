import {ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';
import {useCurrentFrame, useVideoConfig, Easing, interpolate} from 'remotion';

import {TPeriodsScale} from '../periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';

const isAfterCentroid = (visibleDomainIndexEnd: number) => {
	// case 5: 0.5 < x < 1.0
	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return decimalPart > 0.5 && decimalPart < 1.0;
};

const isBeforeCentroid = (visibleDomainIndexEnd: number) => {
	// case 4: 0.0 < x < 0.5
	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return decimalPart > 0 && decimalPart < 0.5;
};

// TODO on periodsScale
const isSpotOnCentroid = (visibleDomainIndexEnd: number) => {
	const domainIndexEndDecimalPart =
		visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return domainIndexEndDecimalPart === 0.5;
};

// TODO on periodsScale?
const isFullPeriodEndFunction = (visibleDomainIndexEnd: number) => {
	const domainIndexEndDecimalPart =
		visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return domainIndexEndDecimalPart === 0;
};

// TODO on periodsScale?
const isLastPeriodVisible = (
	visibleDomainIndexEnd: number,
	timeSeries: {date: Date}[]
) => {
	const isLastPeriod =
		Math.ceil(visibleDomainIndexEnd) === timeSeries.length - 1;
	return isLastPeriod;
};

export const AnimatedValueDot: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
	radius?: number;
}> = ({dotColor, area, yScale, periodsScale, timeSeries, radius = 20}) => {
	const {x, y} = getXY({periodsScale, timeSeries, yScale});

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<Dot cx={x} cy={y} r={radius} fill={dotColor} />
		</svg>
	);
};

function calculatePulsingFactor(
	value: number,
	max: number,
	frequency: number
): number {
	// Ensure value is within the range 0 to max
	value = Math.max(0, Math.min(value, max));

	// Calculate pulsing Factor using a sine function with frequency to create pulsating effect
	const pulsingFactor =
		Math.sin((value / max) * frequency * Math.PI) * 0.5 + 0.5;

	return pulsingFactor;
}

export const Dot: React.FC<{
	cx: number;
	cy: number;
	r: number;
	fill: string;
}> = ({cx, cy, r, fill}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const pulsingFactor = calculatePulsingFactor(frame, durationInFrames, 10);

	const animatedOpacity = interpolate(pulsingFactor, [0, 1], [0.5, 0.1], {
		easing: EASING_FUNCTION,
		// in this case should not be necessary
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const animatedBigRadius = interpolate(
		pulsingFactor,
		[0, 1],
		[r * 1.5, r * 3],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<g>
			<circle
				opacity={animatedOpacity}
				cx={cx}
				cy={cy}
				r={animatedBigRadius}
				fill={fill}
			/>
			<circle cx={cx} cy={cy} r={r} fill={fill} />
		</g>
	);
};

const getXY = ({
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
