// import {ReactNode} from 'react';
import {
	// Sequence,
	// AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

// import {AnimatedCandlesticks} from '../../components/AnimatedCandlesticks';
// import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {periodsScale, TPeriodsScale} from '../../periodsScale/periodsScale';
// import {AnimatedXAxis_MonthStarts} from '../../components/AnimatedXAxis_MonthStarts';
// import {AnimatedYAxis} from '../../components/AnimatedYAxis';
// import {AnimatedLine} from '../../components/AnimatedLine';
// import {AnimatedValueDot} from '../../components/AnimatedValueDot';
import {getYDomain} from '../../utils/timeSeries/timeSeries';

// import {TTheme} from '../../theme';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO: export use because of passed parametrization
// e.g. formatter: {type: "currency", currency: "USD", digits: 0, locale: "en-GB"}
// const currencyFormatter = (x: number) => {
// 	const formatter = new Intl.NumberFormat('en-GB', {
// 		maximumFractionDigits: 0, // Ensures no decimal places
// 		minimumFractionDigits: 0, // Ensures no decimal places
// 	});
// 	return '$ ' + formatter.format(x);
// };

type TChildrenFuncArgs = {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	easingPercentage: number;
	// TODO
	// animationPercentage, currentFrame, durationInFrames,
};

const yDomainType: TYDomainType = 'FULL';

export const LineChartTransitionContainer: React.FC<{
	timeSeries: TimeSeries;
	area: TGridLayoutArea;
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
	// children: (x: TChildrenFuncArgs) => React.ReactNode | null;
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
	// TODO easing!!!
}> = ({
	area,
	timeSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
	children,
	// TODO
	// easing,
}) => {
	const dates = timeSeries.map((it) => it.date);

	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// TODO adapt everywhere else, this is right
	const animationPercentage = (frame + 1) / durationInFrames;

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const easingPercentage = interpolate(animationPercentage, [0, 1], [0, 1], {
		easing: EASING_FUNCTION,
		// in this case should not be necessary
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const animatedVisibleDomainIndexStart = interpolate(
		easingPercentage,
		[0, 1],
		[fromVisibleDomainIndices[0], toVisibleDomainIndices[0]]
	);

	const animatedVisibleDomainIndexEnd = interpolate(
		easingPercentage,
		[0, 1],
		[fromVisibleDomainIndices[1], toVisibleDomainIndices[1]]
		// {
		// 	easing: EASING_FUNCTION,
		// 	// in this case should not be necessary
		// 	extrapolateLeft: 'clamp',
		// 	extrapolateRight: 'clamp',
		// }
	);

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange: [0, area.width],
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
		.range([area.height, 0]);

	return children({
		periodsScale: currentPeriodsScale,
		yScale,
		easingPercentage,
	});
};
