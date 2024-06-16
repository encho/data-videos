import {ReactNode} from 'react';
import {
	Sequence,
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
	// Sequence,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

// import {AnimatedCandlesticks} from './components/AnimatedCandlesticks';
import {Position} from './components/Position';
import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	periodsScale,
	TPeriodsScale,
} from '../acetti-ts-periodsScale/periodsScale';
import {AnimatedXAxis_MonthStarts} from './components/AnimatedXAxis_MonthStarts';
import {AnimatedYAxis} from './components/AnimatedYAxis';
import {AnimatedLine} from '../acetti-ts-components/AnimatedLine';
import {AnimatedValueDot} from '../acetti-ts-components/AnimatedValueDot';
import {AnimatedBars} from './components/AnimatedBars';
import {getYDomain} from './utils/timeSeries/timeSeries';
// import {AnimatedXAxis_PeriodsScale} from './components/AnimatedXAxis_PeriodsScale';

import {TTheme} from './theme';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

type ChildrenFunction = ({
	periodsScale,
	currentFrame,
	durationInFrames,
	yScale,
}: {
	periodsScale: TPeriodsScale;
	currentFrame: number;
	durationInFrames: number;
	yScale: ScaleLinear<number, number>;
}) => ReactNode;

export const AnimatedLineChartContainer: React.FC<{
	children?: ChildrenFunction;
	timeSeries: TimeSeries;
	ohlcSeries: {
		date: Date;
		open: number;
		high: number;
		low: number;
		close: number;
	}[];
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
		subPlot: TGridLayoutArea;
	};
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
	yDomainType: TYDomainType;
	theme: TTheme;
}> = ({
	children,
	layoutAreas,
	timeSeries,
	ohlcSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
	yDomainType,
	theme,
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

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange: [0, layoutAreas.xAxis.width],
	});

	const yDomain = getYDomain(
		yDomainType,
		timeSeries,
		[animatedVisibleDomainIndexStart, animatedVisibleDomainIndexEnd] as [
			number,
			number
		],
		currentPeriodsScale
	);

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomain)
		// TODO domain zero to be added via yDomainType
		// .domain(yDomainZero)
		.range([layoutAreas.plot.height, 0]);

	const yScaleSubPlot: ScaleLinear<number, number> = scaleLinear()
		.domain([0, yDomain[1]])
		.range([layoutAreas.subPlot.height, 0]);

	return (
		<AbsoluteFill>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				{/* <AnimatedCandlesticks
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					area={layoutAreas.plot}
					ohlcSeries={ohlcSeries}
					theme={theme.candlesticks}
				/> */}
			</Position>

			<Position
				// zIndex={100}
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={theme.dataColors[0].BASE}
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					// TODO theme
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedValueDot
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
					dotColor={theme.dataColors[0].BASE}
					area={layoutAreas.plot}
					radius={8}
					// TODO theme
				/>
			</Position>

			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				{/* <AnimatedXAxis_PeriodsScale */}
				<AnimatedXAxis_MonthStarts
					theme={theme.xAxis}
					dates={dates}
					periodsScale={currentPeriodsScale}
					area={layoutAreas.xAxis}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<AnimatedYAxis
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					theme={theme.yAxis}
					formatter={(x) => `${x}****`}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.subPlot.x1, top: layoutAreas.subPlot.y1}}
			>
				<AnimatedBars
					barsColor={theme.dataColors[1].BASE}
					periodsScale={currentPeriodsScale}
					yScale={yScaleSubPlot}
					area={layoutAreas.subPlot}
					timeSeries={timeSeries}
				/>
			</Position>

			{children
				? children({
						yScale,
						periodsScale: currentPeriodsScale,
						currentFrame: frame,
						durationInFrames,
				  })
				: null}

			{/* TODO this is a debugging tool for current periodsScale, factor out of here */}
			<Sequence from={0} durationInFrames={durationInFrames}>
				<AbsoluteFill>
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							backgroundColor: '#000',
							opacity: 0.5,
							display: 'flex',
							flexDirection: 'column',
							gap: 10,
							margin: 10,
							borderRadius: 5,
							padding: 10,
						}}
					>
						<div>
							<h1 style={{color: 'gray', fontSize: 20}}>
								periodsScale.dates.length:{' '}
								{JSON.stringify(currentPeriodsScale.dates.length)}
							</h1>
							<h1 style={{color: 'gray', fontSize: 20}}>
								periodsScale.visibleDomainIndices:{' '}
								{JSON.stringify(currentPeriodsScale.getVisibleDomainIndices())}
							</h1>
						</div>
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
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
