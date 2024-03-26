import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	Sequence,
} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear, scaleTime, ScaleTime, ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLine} from './components/AnimatedLine';
import {AnimatedXAxis} from './components/AnimatedXAxis';
import {AnimatedValueDot} from './components/AnimatedValueDot';
import {AnimatedYAxis} from './components/AnimatedYAxis';
import {
	getTimeSeriesSlice,
	findNearestDataPoints,
	getInterpolatedValue,
} from './utils/timeSeries/timeSeries';
import {createTimeScaleBand, TTimeBandScale} from './AnimatedLineChart';
import {times} from 'lodash';

const SHOW_ZERO = false;

type TDomainIndices = {
	start: number;
	end: number;
};

export const AnimatedLineChartContainer: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	fromVisibleDomain: {
		startDomain: Date;
		endDomain: Date;
	};
	toVisibleDomain: {
		startDomain: Date;
		endDomain: Date;
	};
}> = ({layoutAreas, timeSeries, fromVisibleDomain, toVisibleDomain}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// TODO adapt everywhere else, this is right
	const animationPercentage = (frame + 1) / durationInFrames;

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const data = timeSeries;
	const dates = timeSeries.map((it) => it.date);

	const area = layoutAreas.plot;

	const visibleRange = {startRange: 0, endRange: layoutAreas.xAxis.width};

	const from_timeBandsScale = createTimeScaleBand({
		domain: dates,
		visibleRange,
		visibleDomain: fromVisibleDomain,
	});

	const to_timeBandsScale = createTimeScaleBand({
		domain: dates,
		visibleRange,
		visibleDomain: toVisibleDomain,
	});

	// TODO introduce easing here
	const combineTimeBandScales = (
		fromTimeBandScale: TTimeBandScale,
		toTimeBandScale: TTimeBandScale,
		percFrom: number
	) => {
		const getBand = (date: Date) => {
			const from_x1 = fromTimeBandScale.getBand(date).x1;
			const to_x1 = toTimeBandScale.getBand(date).x1;
			const x1 = from_x1 * percFrom + to_x1 * (1 - percFrom);

			const from_x2 = fromTimeBandScale.getBand(date).x2;
			const to_x2 = toTimeBandScale.getBand(date).x2;
			const x2 = from_x2 * percFrom + to_x2 * (1 - percFrom);

			const from_width = fromTimeBandScale.getBand(date).width;
			const to_width = toTimeBandScale.getBand(date).width;
			const width = from_width * percFrom + to_width * (1 - percFrom);

			return {
				x1,
				x2,
				width,
				centroid: x1 + width / 2,
			};
		};

		// TODO return eventually other fields?
		return {getBand};
	};

	// const FROM_START_INDEX = fromDomainIndices.start;
	// const FROM_END_INDEX = fromDomainIndices.end;

	// const TO_START_INDEX = toDomainIndices.start;
	// const TO_END_INDEX = toDomainIndices.end;

	// const from_startDate = timeSeries[FROM_START_INDEX].date;
	// const to_startDate = timeSeries[TO_START_INDEX].date;

	// const from_endDate = timeSeries[FROM_END_INDEX].date;
	// const to_endDate = timeSeries[TO_END_INDEX].date;

	// const from_startTime = from_startDate.getTime();
	// const to_startTime = to_startDate.getTime();

	// const from_endTime = from_endDate.getTime();
	// const to_endTime = to_endDate.getTime();

	// const animated_startTime = interpolate(
	// 	animationPercentage,
	// 	[0, 1],
	// 	[from_startTime, to_startTime],
	// 	{
	// 		easing: EASING_FUNCTION,
	// 		// in this case should not be necessary
	// 		extrapolateLeft: 'clamp',
	// 		extrapolateRight: 'clamp',
	// 	}
	// );

	// const animated_endTime = interpolate(
	// 	animationPercentage,
	// 	[0, 1],
	// 	[from_endTime, to_endTime],
	// 	{
	// 		easing: EASING_FUNCTION,

	// in this case should not be necessary
	// 		extrapolateLeft: 'clamp',
	// 		extrapolateRight: 'clamp',
	// 	}
	// );

	// const animated_startDate = new Date(animated_startTime);
	// const animated_endDate = new Date(animated_endTime);

	// QUICK-FIX determine why we have to cast to any here
	// const xScale: ScaleTime<Date, number> = scaleTime()
	// 	.domain([animated_startDate, animated_endDate])
	// 	.range([0, layoutAreas.plot.width]) as any;

	const currentTimeBandScale = combineTimeBandScales(
		from_timeBandsScale,
		to_timeBandsScale,
		1 - animationPercentage
	);

	// const visibleTimeSeries = getTimeSeriesSlice(
	// 	data,
	// 	animated_startDate,
	// 	animated_endDate
	// );

	// const nearest_end_dataPoints = findNearestDataPoints(
	// 	timeSeries,
	// 	animated_endDate
	// );

	// const interpolatedStartValue = getInterpolatedValue(
	// 	timeSeries,
	// 	animated_startDate
	// );

	// const interpolatedEndValue = getInterpolatedValue(
	// 	timeSeries,
	// 	animated_endDate
	// );

	// const interpolatedCurrentDotData = {
	// 	date: animated_endDate,
	// 	value: interpolatedEndValue,
	// };

	// console.log({
	// 	nearest_end_dataPoints,
	// 	interpolatedEndValue,
	// 	interpolatedStartValue,
	// });

	// const yDomainMinVisiblePiece = min(
	// 	visibleTimeSeries,
	// 	(it) => it.value
	// ) as number;

	// const yDomainMaxVisiblePiece = max(
	// 	visibleTimeSeries,
	// 	(it) => it.value
	// ) as number;

	// const yDomainMin = min([
	// 	yDomainMinVisiblePiece,
	// 	interpolatedStartValue,
	// 	interpolatedEndValue,
	// ]) as number;

	// const yDomainMax = max([
	// 	yDomainMaxVisiblePiece,
	// 	interpolatedStartValue,
	// 	interpolatedEndValue,
	// ]) as number;

	// const yDomainDiff = yDomainMax - yDomainMin;
	// TODO padding conditional on input flag
	// const yPadding = yDomainDiff * 0.1;
	// const yDomainBounded = [yDomainMax + yPadding, yDomainMin - yPadding];

	// const yDomainZero = [yDomainMax, 0];

	// const showZero = SHOW_ZERO;
	// const yDomain = showZero ? yDomainZero : yDomainBounded;

	// const yScale: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomain)
	// 	.range([0, layoutAreas.plot.height]);

	return (
		<AbsoluteFill>
			{/* TODO position component */}
			<div
				style={{
					position: 'absolute',
					top: layoutAreas.xAxis.y1,
					left: layoutAreas.xAxis.x1,
				}}
			>
				<svg
					width={layoutAreas.plot.width}
					height={layoutAreas.plot.height}
					style={{
						// backgroundColor: '#555',
						overflow: 'visible',
					}}
				>
					{dates.map((date, i) => {
						const band = currentTimeBandScale.getBand(date);
						return (
							<g>
								<rect
									x={band.x1}
									y={0}
									width={band.width}
									height={40}
									stroke="#555"
									strokeWidth={2}
								/>
								{i % 5 === 0 ? (
									<text
										textAnchor="middle"
										alignmentBaseline="middle"
										fill={'yellow'}
										fontSize={18}
										fontWeight={500}
										x={band.centroid}
										y={20}
									>
										{i.toString()}
									</text>
								) : null}
							</g>
						);
					})}
				</svg>
			</div>

			<AbsoluteFill>
				<Sequence from={0} durationInFrames={durationInFrames}>
					<h1 style={{color: 'gray', fontSize: 40}}>{animationPercentage}</h1>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
