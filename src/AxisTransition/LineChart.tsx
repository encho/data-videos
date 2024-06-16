import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear, scaleTime, ScaleTime} from 'd3-scale';
import {line} from 'd3-shape';

import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';
// ****************************************************************
const SHOW_ZERO = false;

export const LineChart: React.FC<{
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
}> = ({area, timeSeries}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	const data = timeSeries;

	// const FROM_START_INDEX = 0;
	// const FROM_END_INDEX = 3000 - 300;

	// const TO_START_INDEX = 500;
	// const TO_END_INDEX = 3500 - 300;
	const FROM_START_INDEX = 0;
	const FROM_END_INDEX = 0;

	const TO_START_INDEX = 1;
	const TO_END_INDEX = 3500;

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
			// easing: Easing.linear,
			easing: Easing.bezier(0.33, 1, 0.68, 1),

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
			// easing: Easing.linear,
			easing: Easing.bezier(0.33, 1, 0.68, 1),

			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// QUICK-FIX determine why we have to cast to any here
	const xScale: ScaleTime<Date, number> = scaleTime()
		.domain([new Date(animated_startTime), new Date(animated_endTime)])
		.range([0, area.width]) as any;

	const yDomainMin = min(data, (it) => it.value) as number;
	const yDomainMax = max(data, (it) => it.value) as number;
	const yDomainDiff = yDomainMax - yDomainMin;
	// TODO padding conditional on input flag
	const yPadding = yDomainDiff * 0.1;
	const yDomainBounded = [yDomainMax + yPadding, yDomainMin - yPadding];

	const yDomainZero = [yDomainMax, 0];

	const showZero = SHOW_ZERO;
	const yDomain = showZero ? yDomainZero : yDomainBounded;

	const yScale = scaleLinear()
		.domain(yDomain)
		// .domain([max(data.map((it) => it.value)) as number, 0])
		.range([0, area.height]);
	// .nice();
	const linePath = line<{date: Date; value: number}>()
		// .x((d) => xAxisSpec.scale(d.date))
		.x((d) => xScale(d.date))
		.y((d) => yScale(d.value));

	const d = linePath(timeSeries) || '';

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg
					overflow="visible"
					width={area.width}
					height={area.height}
					style={{backgroundColor: '#222'}}
				>
					<defs>
						<clipPath id="myClip">
							{/* <rect x="50" y="50" width="200" height="200" /> */}
							<rect x={0} y={0} width={area.width} height={area.height} />
						</clipPath>
					</defs>

					<rect
						x={0}
						y={0}
						width={area.width}
						height={area.height}
						fill="#f05122"
						opacity={0.05}
					/>

					{/* the animated line */}
					{d ? (
						<g>
							<path
								// clipPath="url(#myClip)"
								d={d}
								// strokeDasharray={evolvedPath.strokeDasharray}
								// strokeDashoffset={evolvedPath.strokeDashoffset}
								// stroke={styling.lineColor}
								// strokeWidth={styling.lineStrokeWidth}
								// fill="transparent"
								stroke={'#f05122'}
								strokeWidth={1}
								fill="transparent"
								// opacity={0.35}
								opacity={0}
							/>

							<path
								clipPath="url(#myClip)"
								d={d}
								// strokeDasharray={evolvedPath.strokeDasharray}
								// strokeDashoffset={evolvedPath.strokeDashoffset}
								// stroke={styling.lineColor}
								// strokeWidth={styling.lineStrokeWidth}
								// fill="transparent"
								stroke={'#f05122'}
								strokeWidth={2}
								fill="transparent"
							/>
							{/* <circle
								cx={pointAtLength.x}
								cy={pointAtLength.y}
								fill={styling.lineColor}
								r={styling.lineCircleRadius}
							/> */}
						</g>
					) : null}
				</svg>
			</div>
		</AbsoluteFill>
	);
};
