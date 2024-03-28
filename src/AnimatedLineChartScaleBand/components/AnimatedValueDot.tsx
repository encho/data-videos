import {ScaleLinear} from 'd3-scale';

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

// TODO on periodsScale
const isFullPeriodEndFunction = (visibleDomainIndexEnd: number) => {
	const domainIndexEndDecimalPart =
		visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	return domainIndexEndDecimalPart === 0;
};

// TODO on periodsScale
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
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();

	const visibleDomainIndexEnd = visibleDomainIndices[1];

	let STATUS;
	// (special) case 1: in last index
	if (isLastPeriodVisible(visibleDomainIndexEnd, timeSeries)) {
		STATUS = 'IN_LAST_PERIOD';
	} else if (isFullPeriodEndFunction(visibleDomainIndexEnd) == true) {
		STATUS = 'FULL_PERIOD_END';
	} else if (isSpotOnCentroid(visibleDomainIndexEnd) == true) {
		STATUS = 'SPOT_ON_CENTROID';
	} else if (isBeforeCentroid(visibleDomainIndexEnd) === true) {
		// case 4: 0.0 < x < 0.5
		STATUS = 'BEFORE_CENTROID';
	} else if (isAfterCentroid(visibleDomainIndexEnd) === true) {
		// case 5: 0.5 < x < 1.0
		STATUS = 'AFTER_CENTROID';
	}

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			{/* <text x={50} y={230} fill="yellow" fontSize={20}>
				STATUS: {JSON.stringify(STATUS)}
			</text> */}

			{STATUS === 'IN_LAST_PERIOD' ? (
				<DotCircleInLastPeriod
					area={area}
					dotColor={dotColor}
					periodsScale={periodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
				/>
			) : null}

			{STATUS === 'SPOT_ON_CENTROID' ? (
				<DotCircleSpotOnCentroid
					area={area}
					dotColor={dotColor}
					periodsScale={periodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
				/>
			) : null}

			{STATUS === 'FULL_PERIOD_END' ? (
				<DotCircleFullPeriodEnd
					area={area}
					dotColor={dotColor}
					periodsScale={periodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
				/>
			) : null}

			{STATUS === 'AFTER_CENTROID' ? (
				<DotCircleAfterCentroid
					area={area}
					dotColor={dotColor}
					periodsScale={periodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
				/>
			) : null}

			{STATUS === 'BEFORE_CENTROID' ? (
				<DotCircleBeforeCentroid
					area={area}
					dotColor={dotColor}
					periodsScale={periodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
				/>
			) : null}
		</svg>
	);
};

export const DotCircleSpotOnCentroid: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const spotOnPeriodIndex = Math.ceil(visibleDomainIndexEnd);

	const spotOnCentroid =
		periodsScale.getBandFromIndex(spotOnPeriodIndex).centroid;

	const cx = spotOnCentroid;
	const value = timeSeries[spotOnPeriodIndex].value;

	const cy = yScale(value);

	return (
		<g>
			<circle cx={cx} cy={cy} r={10} fill={dotColor} />
		</g>
	);
};

export const DotCircleFullPeriodEnd: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const leftIndex = Math.floor(visibleDomainIndexEnd);
	const rightIndex = leftIndex + 1;

	const cx = periodsScale.getBandFromIndex(leftIndex).x2;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const cy = yScale(leftValue * 0.5 + rightValue * 0.5);

	return (
		<g>
			<circle cx={cx} cy={cy} r={10} fill={dotColor} />
		</g>
	);
};

export const DotCircleAfterCentroid: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
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

	const cx =
		currentVisibleCentroid * percentCurrentCentroid +
		nextVisibleCentroid * percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const cy = yScale(
		leftValue * percentCurrentCentroid + rightValue * percentNextCentroid
	);

	return (
		<g>
			<circle cx={cx} cy={cy} r={10} fill={dotColor} />
		</g>
	);
};

export const DotCircleBeforeCentroid: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
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

	const cx =
		currentVisibleCentroid * percentCurrentCentroid +
		nextVisibleCentroid * percentNextCentroid;

	const leftValue = timeSeries[leftIndex].value;
	const rightValue = timeSeries[rightIndex].value;

	const cy = yScale(
		leftValue * percentCurrentCentroid + rightValue * percentNextCentroid
	);

	return (
		<g>
			<circle cx={cx} cy={cy} r={10} fill={dotColor} />
		</g>
	);
};

export const DotCircleInLastPeriod: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndexEnd = visibleDomainIndices[1];

	const decimalPart = visibleDomainIndexEnd - Math.floor(visibleDomainIndexEnd);
	const isCentroidThere = decimalPart >= 0.5;

	if (isCentroidThere) {
		const lastIndex = Math.ceil(visibleDomainIndexEnd);
		const cx = periodsScale.getBandFromIndex(lastIndex).centroid;
		const value = timeSeries[lastIndex].value;
		const cy = yScale(value);
		return (
			<g>
				<circle cx={cx} cy={cy} r={10} fill={dotColor} />
			</g>
		);
	}

	return (
		<DotCircleBeforeCentroid
			area={area}
			dotColor={dotColor}
			periodsScale={periodsScale}
			yScale={yScale}
			timeSeries={timeSeries}
		/>
	);
};
