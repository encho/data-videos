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
import {line} from 'd3-shape';

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

	const from_endIndex = dates.findIndex(
		(date) => date.getTime() === fromVisibleDomain.endDomain.getTime()
	);

	const to_endIndex = dates.findIndex(
		(date) => date.getTime() === toVisibleDomain.endDomain.getTime()
	);

	const currentFloatIndex =
		from_endIndex * (1 - animationPercentage) +
		to_endIndex * animationPercentage;

	const nearIndices =
		currentFloatIndex === from_endIndex || currentFloatIndex === to_endIndex
			? [currentFloatIndex, currentFloatIndex]
			: [Math.floor(currentFloatIndex), Math.ceil(currentFloatIndex)];

	// const toVisibleIndices = {
	// 	start: ,
	// 	end:,
	// }

	const dotLeftTsItem = timeSeries[nearIndices[0]];
	const dotRightTsItem = timeSeries[nearIndices[1]];

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
		// TODO ensure that domains are the same!
		// const domain = fromTimeBandScale.domain;

		const getBand = (date: Date) => {
			const from_x1 = fromTimeBandScale.getBand(date).x1;
			const to_x1 = toTimeBandScale.getBand(date).x1;
			const x1 = from_x1 + (to_x1 - from_x1) * (1 - percFrom);

			const from_x2 = fromTimeBandScale.getBand(date).x2;
			const to_x2 = toTimeBandScale.getBand(date).x2;
			const x2 = from_x2 + (to_x2 - from_x2) * (1 - percFrom);

			const from_width = fromTimeBandScale.getBand(date).width;
			const to_width = toTimeBandScale.getBand(date).width;
			const width = from_width + (to_width - from_width) * (1 - percFrom);

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

	const yDomainMin = min(timeSeries.map((it) => it.value));
	const yDomainMax = max(timeSeries.map((it) => it.value));

	// const yDomainZero = [layoutAreas.plot.height, 0];

	// const showZero = SHOW_ZERO;
	// const yDomain = showZero ? yDomainZero : yDomainBounded;
	const yDomain = [yDomainMin, yDomainMax] as [number, number];

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomain)
		// .domain(yDomainZero)
		.range([0, layoutAreas.plot.height]);

	const currentTimeBandScale = combineTimeBandScales(
		from_timeBandsScale,
		to_timeBandsScale,
		1 - animationPercentage
	);

	const allMappedXYs = timeSeries.map((tsItem) => {
		const band = currentTimeBandScale.getBand(tsItem.date);
		const cx = band.centroid;
		const cy = yScale(tsItem.value);
		return [cx, cy] as [number, number];
	});

	// const allMappedXYs = [[], allMappedXYs]

	const d = line()(allMappedXYs) as string;

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
						// backgroundColor: 'black',
						overflow: 'visible',
					}}
				>
					{/* dots */}
					{timeSeries.map((timeSeriesItem) => {
						const band = currentTimeBandScale.getBand(timeSeriesItem.date);
						const cx = band.centroid;
						const cy = yScale(timeSeriesItem.value);
						// const cy = 50;
						return (
							<g>
								<circle cx={cx} cy={cy} r={5} fill="cyan" />
							</g>
						);
					})}

					<path
						d={d}
						stroke="yellow"
						strokeWidth={2}
						// fill="rgba(255,0,0,0.5)"
						fill="none"
					/>
					{[dotLeftTsItem, dotRightTsItem].map((timeSeriesItem) => {
						const band = currentTimeBandScale.getBand(timeSeriesItem.date);
						const cx = band.centroid;
						const cy = yScale(timeSeriesItem.value);
						// const cy = 50;
						return (
							<g>
								<circle cx={cx} cy={cy} r={7} fill="red" />
							</g>
						);
					})}
				</svg>
			</div>

			<div
				style={{
					position: 'absolute',
					top: layoutAreas.xAxis.y1,
					left: layoutAreas.xAxis.x1,
				}}
			>
				<svg
					width={layoutAreas.xAxis.width}
					height={layoutAreas.xAxis.height}
					style={{
						overflow: 'visible',
						backgroundColor: 'black',
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

			<Sequence from={0} durationInFrames={durationInFrames}>
				<AbsoluteFill>
					<div>
						<h1 style={{color: 'gray', fontSize: 40}}>{from_endIndex}</h1>
					</div>
					<div>
						<h1 style={{color: 'gray', fontSize: 40}}>{to_endIndex}</h1>
					</div>
					<div>
						<h1 style={{color: 'gray', fontSize: 40}}>
							nearIndices: {nearIndices[0]} - {nearIndices[1]}
						</h1>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
