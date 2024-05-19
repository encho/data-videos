// import {ReactNode} from 'react';
import {
	Sequence,
	// AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {LineChartTransitionContainer} from './LineChartTransitionContainer';
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
// const yDomainType: TYDomainType = 'ZERO_FULL';

type TViewSpec = {
	area: TGridLayoutArea;
	visibleDomainIndices: [number, number];
};

type TTransitionSpec = {
	durationInFrames: number;
	easingFunction: (t: number) => number;
};

export const LineChartAnimationContainer: React.FC<{
	timeSeries: TimeSeries;
	viewSpecs: TViewSpec[];
	transitionSpecs: TTransitionSpec[];
	// area: TGridLayoutArea;
	// fromVisibleDomainIndices: [number, number];
	// toVisibleDomainIndices: [number, number];
	// children: (x: TChildrenFuncArgs) => React.ReactNode | null;
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
	// TODO easing!!!
}> = ({
	// area,
	timeSeries,
	viewSpecs,
	transitionSpecs,
	// fromVisibleDomainIndices,
	// toVisibleDomainIndices,
	children,
	// TODO
	// easing,
}) => {
	const startFrames: number[] = transitionSpecs.reduce(
		(acc, transition, index) => {
			// For the first element, start frame is 0
			if (index === 0) {
				acc.push(0);
			} else {
				// Each subsequent element starts after the previous one ends
				acc.push(acc[index - 1] + transitionSpecs[index - 1].durationInFrames);
			}
			return acc;
		},
		[] as number[]
	);

	const totalDuration = transitionSpecs.reduce(
		(acc, transition) => acc + transition.durationInFrames,
		0
	);

	return (
		<Sequence from={0} durationInFrames={totalDuration} layout="none">
			{transitionSpecs.map((transition, i) => {
				const fromVisibleDomainIndices = viewSpecs[i].visibleDomainIndices;
				const toVisibleDomainIndices = viewSpecs[i + 1].visibleDomainIndices;

				// TODO implement moving area too
				const area = viewSpecs[i].area;

				return (
					<Sequence
						from={startFrames[i]}
						durationInFrames={transitionSpecs[i].durationInFrames}
					>
						<LineChartTransitionContainer
							timeSeries={timeSeries}
							fromVisibleDomainIndices={fromVisibleDomainIndices}
							toVisibleDomainIndices={toVisibleDomainIndices}
							// TODO rename to plotArea
							// area={chartLayout.areas.plot}
							area={area}
							// TODO pass yDomainType
							// yDomainType={"FULL"}
						>
							{children}
						</LineChartTransitionContainer>
					</Sequence>
				);
			})}
		</Sequence>
	);

	const dates = timeSeries.map((it) => it.date);

	// ***************************************************
	// only the first transition for now...
	// ***************************************************
	const transitionIndex = 0;
	const fromVisibleDomainIndices =
		viewSpecs[transitionIndex].visibleDomainIndices;
	const toVisibleDomainIndices =
		viewSpecs[transitionIndex + 1].visibleDomainIndices;

	// TODO implement moving area too
	const area = viewSpecs[transitionIndex].area;

	const currentTransitionSpec = transitionSpecs[transitionIndex];

	const EASING_FUNCTION = currentTransitionSpec.easingFunction;
	const durationInFrames = currentTransitionSpec.durationInFrames;

	// ***************************************************

	const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();

	// TODO adapt everywhere else, this is right
	const animationPercentage = (frame + 1) / durationInFrames;

	// const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

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
