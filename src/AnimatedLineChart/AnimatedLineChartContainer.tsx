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
import {
	getTimeSeriesSlice,
	findNearestDataPoints,
	getInterpolatedValue,
} from './utils/timeSeries/timeSeries';

const SHOW_ZERO = false;

type TDomainIndices = {
	start: number;
	end: number;
};

export const AnimatedLineChartContainer: React.FC<{
	axisSpecType: 'STANDARD' | 'INTER_MONTHS';
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	timeSeries: TimeSeries;
	fromDomainIndices: TDomainIndices;
	toDomainIndices: TDomainIndices;
	textColor: string;
}> = ({
	axisSpecType,
	layoutAreas,
	timeSeries,
	fromDomainIndices,
	toDomainIndices,
	textColor,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// TODO adapt everywhere else, this is right
	const animationPercentage = (frame + 1) / durationInFrames;

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const data = timeSeries;
	const area = layoutAreas.plot;

	const FROM_START_INDEX = fromDomainIndices.start;
	const FROM_END_INDEX = fromDomainIndices.end;

	const TO_START_INDEX = toDomainIndices.start;
	const TO_END_INDEX = toDomainIndices.end;

	const from_startDate = timeSeries[FROM_START_INDEX].date;
	const to_startDate = timeSeries[TO_START_INDEX].date;

	const from_endDate = timeSeries[FROM_END_INDEX].date;
	const to_endDate = timeSeries[TO_END_INDEX].date;

	const from_startTime = from_startDate.getTime();
	const to_startTime = to_startDate.getTime();

	const from_endTime = from_endDate.getTime();
	const to_endTime = to_endDate.getTime();

	const animated_startTime = interpolate(
		animationPercentage,
		[0, 1],
		[from_startTime, to_startTime],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const animated_endTime = interpolate(
		animationPercentage,
		[0, 1],
		[from_endTime, to_endTime],
		{
			easing: EASING_FUNCTION,

			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const animated_startDate = new Date(animated_startTime);
	const animated_endDate = new Date(animated_endTime);

	// QUICK-FIX determine why we have to cast to any here
	const xScale: ScaleTime<Date, number> = scaleTime()
		.domain([animated_startDate, animated_endDate])
		.range([0, layoutAreas.plot.width]) as any;

	const visibleTimeSeries = getTimeSeriesSlice(
		data,
		animated_startDate,
		animated_endDate
	);

	const nearest_end_dataPoints = findNearestDataPoints(
		timeSeries,
		animated_endDate
	);

	const interpolatedStartValue = getInterpolatedValue(
		timeSeries,
		animated_startDate
	);

	const interpolatedEndValue = getInterpolatedValue(
		timeSeries,
		animated_endDate
	);

	const interpolatedCurrentDotData = {
		date: animated_endDate,
		value: interpolatedEndValue,
	};

	console.log({
		nearest_end_dataPoints,
		interpolatedEndValue,
		interpolatedStartValue,
	});

	const yDomainMinVisiblePiece = min(
		visibleTimeSeries,
		(it) => it.value
	) as number;

	const yDomainMaxVisiblePiece = max(
		visibleTimeSeries,
		(it) => it.value
	) as number;

	const yDomainMin = min([
		yDomainMinVisiblePiece,
		interpolatedStartValue,
		interpolatedEndValue,
	]) as number;

	const yDomainMax = max([
		yDomainMaxVisiblePiece,
		interpolatedStartValue,
		interpolatedEndValue,
	]) as number;

	const yDomainDiff = yDomainMax - yDomainMin;
	// TODO padding conditional on input flag
	const yPadding = yDomainDiff * 0.1;
	const yDomainBounded = [yDomainMax + yPadding, yDomainMin - yPadding];

	const yDomainZero = [yDomainMax, 0];

	const showZero = SHOW_ZERO;
	const yDomain = showZero ? yDomainZero : yDomainBounded;

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomain)
		.range([0, layoutAreas.plot.height]);

	return (
		<AbsoluteFill>
			{/* TODO position component */}
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<AnimatedLine
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					fromDomainIndices={fromDomainIndices}
					toDomainIndices={toDomainIndices}
					xScaleCurrent={xScale}
					yScaleCurrent={yScale}
					lineColor={textColor}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					top: layoutAreas.plot.y1,
					left: layoutAreas.plot.x1,
				}}
			>
				<AnimatedValueDot
					area={layoutAreas.plot}
					xScaleCurrent={xScale}
					yScaleCurrent={yScale}
					interpolatedCurrentDotData={interpolatedCurrentDotData}
				/>
			</div>

			{/* TODO position component */}
			<div
				style={{
					position: 'absolute',
					top: layoutAreas.xAxis.y1,
					left: layoutAreas.xAxis.x1,
				}}
			>
				<AnimatedXAxis
					area={layoutAreas.xAxis}
					xScaleCurrent={xScale}
					axisSpecType={axisSpecType}
					linesColor={textColor}
				/>
			</div>

			<AbsoluteFill>
				<Sequence from={0} durationInFrames={durationInFrames}>
					<h1 style={{color: 'gray', fontSize: 40}}>{animationPercentage}</h1>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
