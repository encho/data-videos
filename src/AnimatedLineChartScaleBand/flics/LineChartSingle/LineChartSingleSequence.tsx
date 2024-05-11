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

import {AnimatedCandlesticks} from '../../components/AnimatedCandlesticks';
import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {periodsScale} from '../../periodsScale/periodsScale';
import {AnimatedXAxis_MonthStarts} from '../../components/AnimatedXAxis_MonthStarts';
import {AnimatedYAxis} from '../../components/AnimatedYAxis';
import {AnimatedLine} from '../../components/AnimatedLine';
import {AnimatedValueDot} from '../../components/AnimatedValueDot';
import {getYDomain} from '../../utils/timeSeries/timeSeries';

import {TTheme} from '../../theme';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

export const LineChartSingleSequence: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
	yDomainType: TYDomainType;
	theme: TTheme;
}> = ({
	layoutAreas,
	timeSeries,
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

	return (
		<div>
			<Position
				zIndex={100}
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
		</div>
	);
};
