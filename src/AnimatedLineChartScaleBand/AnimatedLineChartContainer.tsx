import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
	Sequence,
} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {Position} from './components/Position';
import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {periodsScale} from './periodsScale';
import {AnimatedXAxis} from './components/AnimatedXAxis';
import {AnimatedYAxis} from './components/AnimatedYAxis';
import {AnimatedLine} from './components/AnimatedLine';
import {AnimatedValueDot} from './components/AnimatedValueDot';

export const AnimatedLineChartContainer: React.FC<{
	lineColor: string;
	textColor: string;
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
}> = ({
	lineColor,
	textColor,
	layoutAreas,
	timeSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	console.log({timeSeries});

	// TODO adapt everywhere else, this is right
	const animationPercentage = (frame + 1) / durationInFrames;

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const dates = timeSeries.map((it) => it.date);

	const animatedVisibleDomainIndexStart = interpolate(
		animationPercentage,
		[0, 1],
		[fromVisibleDomainIndices[0], toVisibleDomainIndices[0]],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const animatedVisibleDomainIndexEnd = interpolate(
		animationPercentage,
		[0, 1],
		[fromVisibleDomainIndices[1], toVisibleDomainIndices[1]],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange: [0, layoutAreas.xAxis.width],
	});

	const yDomainMin = min(timeSeries.map((it) => it.value));
	const yDomainMax = max(timeSeries.map((it) => it.value));

	const yDomain = [yDomainMin, yDomainMax] as [number, number];

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomain)
		// .domain(yDomainZero)
		// .range([0, layoutAreas.plot.height]);
		.range([layoutAreas.plot.height, 0]);

	return (
		<AbsoluteFill>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={lineColor}
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					// displayDots={true}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedValueDot
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
					dotColor={textColor}
					area={layoutAreas.plot}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<AnimatedXAxis
					dates={dates}
					periodsScale={currentPeriodsScale}
					area={layoutAreas.xAxis}
					linesColor={textColor}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<AnimatedYAxis
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					linesColor={textColor}
				/>
			</Position>

			<Sequence from={0} durationInFrames={durationInFrames}>
				<AbsoluteFill>
					<div>
						<h1 style={{color: 'gray', fontSize: 20}}>
							{fromVisibleDomainIndices.toString()}
						</h1>
					</div>
					<div>
						<h1 style={{color: 'gray', fontSize: 20}}>
							{toVisibleDomainIndices.toString()}
						</h1>
					</div>
					<div>
						<h1 style={{color: 'gray', fontSize: 20}}>
							current visible indices: {animatedVisibleDomainIndexStart} -{' '}
							{animatedVisibleDomainIndexEnd}
						</h1>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
