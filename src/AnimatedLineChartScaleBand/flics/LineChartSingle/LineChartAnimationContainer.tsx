import {Sequence, useCurrentFrame, interpolate} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	periodsScale,
	TPeriodsScale,
} from '../../../acetti-ts-periodsScale/periodsScale';
import {getYDomain} from '../../utils/timeSeries/timeSeries';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

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
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({timeSeries, viewSpecs, transitionSpecs, children}) => {
	// ensure the length of the passed props are as expected
	invariant(
		transitionSpecs.length === viewSpecs.length - 1,
		'length of transitionSpecs and viewSpecs is not matching! there should be exactly one less transitionSpec than viewSpec!'
	);

	const frame = useCurrentFrame();

	const dates = timeSeries.map((it) => it.date);

	const frameRanges = calculateFrameRanges(transitionSpecs);
	const totalDuration = frameRanges[frameRanges.length - 1].endFrame;

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);
	const currentTransition = transitionSpecs[currentTransitionIndex];
	const currentFrameRange = frameRanges[currentTransitionIndex];

	const currentTransitionFrame = frame - currentFrameRange.startFrame;

	const EASING_FUNCTION = currentTransition.easingFunction;

	const currentAnimationPercentage =
		(currentTransitionFrame + 1) / currentTransition.durationInFrames;

	const currentEasingPercentage = interpolate(
		currentAnimationPercentage,
		[0, 1],
		[0, 1],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const fromViewSpec = viewSpecs[currentTransitionIndex];
	const toViewSpec = viewSpecs[currentTransitionIndex + 1];

	const animatedVisibleDomainIndexStart = interpolate(
		currentEasingPercentage,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[0], toViewSpec.visibleDomainIndices[0]]
	);

	const animatedVisibleDomainIndexEnd = interpolate(
		currentEasingPercentage,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[1], toViewSpec.visibleDomainIndices[1]]
	);

	const AREA_SHOULD_BE_ANIMATED = fromViewSpec.area;

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
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
		.range([AREA_SHOULD_BE_ANIMATED.height, 0]);

	return (
		<Sequence from={0} durationInFrames={totalDuration} layout="none">
			{children({
				periodsScale: currentPeriodsScale,
				yScale,
				// TODO
				// currentEasingPercentage...
				easingPercentage: currentEasingPercentage,
			})}
		</Sequence>
	);
};

type TFrameRange = {
	startFrame: number;
	endFrame: number;
};

const calculateFrameRanges = (transitions: TTransitionSpec[]) => {
	// Calculate frame ranges
	const frameRanges: TFrameRange[] = transitions.reduce(
		(acc, transition, index) => {
			if (index === 0) {
				// For the first element, the start frame is 0
				acc.push({startFrame: 0, endFrame: transition.durationInFrames});
			} else {
				// Calculate the start frame based on the end frame of the last item
				const startFrame = acc[index - 1].endFrame;
				const endFrame = startFrame + transition.durationInFrames;
				acc.push({startFrame, endFrame});
			}
			return acc;
		},
		[] as TFrameRange[]
	);

	return frameRanges;
};

// Function to find the index of FrameRange that includes the current frame
function findFrameRangeIndex(
	currentFrame: number,
	ranges: TFrameRange[]
): number {
	for (let i = 0; i < ranges.length; i++) {
		if (
			currentFrame >= ranges[i].startFrame &&
			currentFrame < ranges[i].endFrame
		) {
			return i;
		}
	}
	return -1; // Return -1 if no matching range is found
}

// Example FrameRanges and a test case
// const frameRanges: TFrameRange[] = [
// 	{startFrame: 0, endFrame: 30},
// 	{startFrame: 30, endFrame: 75},
// 	{startFrame: 75, endFrame: 135},
// ];

// console.log(findFrameRangeIndex(25, frameRanges)); // Output: 0
// console.log(findFrameRangeIndex(30, frameRanges)); // Output: 1
// console.log(findFrameRangeIndex(50, frameRanges)); // Output: 1
// console.log(findFrameRangeIndex(135, frameRanges)); // Output: -1 (since it's exactly the end frame of last range)
// console.log(findFrameRangeIndex(140, frameRanges)); // Output: -1
