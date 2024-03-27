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
import {line} from 'd3-shape';

import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {periodsScale} from './periodsScale';
import {AnimatedXAxis} from './components/AnimatedXAxis';
import {AnimatedYAxis} from './components/AnimatedYAxis';

export const AnimatedLineChartContainer: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
}> = ({
	layoutAreas,
	timeSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

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

	const currentTimeBandsScale = periodsScale({
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
		.range([0, layoutAreas.plot.height]);

	const allMappedXYs_new = timeSeries.map((tsItem, i) => {
		const band = currentTimeBandsScale.getBandFromIndex(i);
		const cx = band.centroid;
		const cy: number = yScale(tsItem.value);
		return [cx, cy] as [number, number];
	});

	const d_new = line()(allMappedXYs_new) as string;

	// determine current Dot location
	const leftEndIndex = Math.floor(animatedVisibleDomainIndexEnd);
	const rightEndIndex = Math.ceil(animatedVisibleDomainIndexEnd);
	const percRight = animatedVisibleDomainIndexEnd - leftEndIndex;

	const leftValue = timeSeries[leftEndIndex].value;
	const rightValue = timeSeries[rightEndIndex].value;

	const currentDotValue = leftValue * (1 - percRight) + rightValue * percRight;
	const currentDot_circle_cy = yScale(currentDotValue);

	// TODO implement
	// currentTimeBandsScale.scale(float)
	const currentDot_circle_cx_left =
		currentTimeBandsScale.getBandFromIndex(leftEndIndex).x1;
	const currentDot_circle_cx_right =
		currentTimeBandsScale.getBandFromIndex(rightEndIndex).x1;
	const currentDot_circle_cx =
		currentDot_circle_cx_left * (1 - percRight) +
		currentDot_circle_cx_right * percRight;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: layoutAreas.plot.y1,
					left: layoutAreas.plot.x1,
				}}
			>
				<svg
					width={layoutAreas.plot.width}
					height={layoutAreas.plot.height}
					style={{
						overflow: 'visible',
					}}
				>
					<clipPath id="plotAreaClipPath">
						<rect
							x={0}
							y={0}
							width={layoutAreas.plot.width}
							height={layoutAreas.plot.height}
						/>
					</clipPath>

					<g clipPath="url(#plotAreaClipPath)">
						<path d={d_new} stroke="blue" strokeWidth={5} fill="none" />
						{/* dots */}
						{timeSeries.map((timeSeriesItem) => {
							const band = currentTimeBandsScale.getBandFromDate(
								timeSeriesItem.date
							);
							const cx = band.centroid;
							const cy = yScale(timeSeriesItem.value);
							return (
								<g>
									<circle cx={cx} cy={cy} r={3} fill="lightblue" />
								</g>
							);
						})}
					</g>
					<g>
						<circle
							cx={currentDot_circle_cx}
							cy={currentDot_circle_cy}
							r={8}
							fill="red"
						/>
					</g>
				</svg>
			</div>

			<div
				style={{
					position: 'absolute',
					top: layoutAreas.xAxis.y1,
					left: layoutAreas.xAxis.x1,
				}}
			>
				<AnimatedXAxis
					dates={dates}
					periodsScale={currentTimeBandsScale}
					area={layoutAreas.xAxis}
					linesColor="magenta"
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					top: layoutAreas.yAxis.y1,
					left: layoutAreas.yAxis.x1,
				}}
			>
				<AnimatedYAxis
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					// axisSpecType={axisSpecType}
					linesColor={'orange'}
				/>
			</div>

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
