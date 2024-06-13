import {Sequence, useCurrentFrame, interpolate} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from '../AnimatedLineChartScaleBand/utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	periodsScale,
	TPeriodsScale,
} from '../AnimatedLineChartScaleBand/periodsScale/periodsScale';
import {getYDomain} from '../AnimatedLineChartScaleBand/utils/timeSeries/timeSeries';
// import {TYAxis} from './components/axisSpecs_yAxis';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

export type TLineChartAnimationContext = {
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	// new API...
	currentTransitionInfo: {
		frameRange: TFrameRange;
		durationInFrames: number;
		// TODO rename to linearPercentage (also for currentSlice object)
		framesPercentage: number;
		easingPercentage: number;
	};
	// TODO rename to currentSliceInfo
	currentSliceInfo: {
		index: number;
		frameRange: TFrameRange;
		frameRangeLinearPercentage: {startFrame: number; endFrame: number};
		frameRangeEasingPercentage: {startFrame: number; endFrame: number};
		durationInFrames: number;
		relativeFrame: number;
		framesPercentage: number;
		visibleDomainIndicesFrom: [number, number];
		visibleDomainIndicesTo: [number, number];
		periodsScaleFrom: TPeriodsScale;
		periodsScaleTo: TPeriodsScale;
		// TODO::::
		// yScaleTo: TYAxis;
		// yScaleFrom: TYAxis;
	};
};

type TChildrenFuncArgs = TLineChartAnimationContext;

const yDomainType: TYDomainType = 'VISIBLE';
// const yDomainType: TYDomainType = 'FULL';
// const yDomainType: TYDomainType = 'ZERO_FULL';

type TViewSpec = {
	area: TGridLayoutArea;
	visibleDomainIndices: [number, number];
};

type TTransitionSpec = {
	durationInFrames: number;
	easingFunction: (t: number) => number;
	numberOfSlices: number;
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

	const frameRanges = calculateFrameRanges(transitionSpecs); // {startFrame, endFrame}[]
	const totalDuration = frameRanges[frameRanges.length - 1].endFrame;

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);
	const currentFrameRange = frameRanges[currentTransitionIndex];

	// TODO rename to currentTransitionSpec
	const currentTransition = transitionSpecs[currentTransitionIndex];

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

	const AREA_SHOULD_BE_ANIMATED = fromViewSpec.area;

	// ******** current transition information *************************************************

	const currentTransitionInfo = {
		frameRange: currentFrameRange,
		durationInFrames: currentTransition.durationInFrames,
		framesPercentage: currentAnimationPercentage,
		easingPercentage: currentEasingPercentage,
	};

	// ******** current Slice information calculation *************************************************
	const currentTransitionSlicesFrameRanges = divideFrameRange(
		currentFrameRange,
		currentTransition.numberOfSlices
	);

	// TODO clean up naming
	const currentTransitionSlice = findFrameRangeIndex(
		frame,
		currentTransitionSlicesFrameRanges
	);

	const currentTransitionSliceFrameRange =
		currentTransitionSlicesFrameRanges[currentTransitionSlice];
	// const currentTransitionSliceSpec =

	const sliceRelativeFrame =
		frame - currentTransitionSliceFrameRange.startFrame;

	const sliceDurationInFrames =
		currentTransitionSliceFrameRange.endFrame -
		currentTransitionSliceFrameRange.startFrame;

	const sliceFramesPercentage =
		(sliceRelativeFrame + 1) / sliceDurationInFrames;

	const frameRangeLinearPercentage = {
		startFrame:
			(currentTransitionSliceFrameRange.startFrame -
				currentTransitionInfo.frameRange.startFrame) /
			currentTransitionInfo.durationInFrames,
		endFrame:
			(currentTransitionSliceFrameRange.endFrame -
				currentTransitionInfo.frameRange.startFrame) /
			currentTransitionInfo.durationInFrames,
	};

	const frameRangeEasingPercentage = {
		startFrame: interpolate(
			frameRangeLinearPercentage.startFrame,
			[0, 1],
			[0, 1],
			{
				easing: EASING_FUNCTION,
			}
		),
		endFrame: interpolate(frameRangeLinearPercentage.endFrame, [0, 1], [0, 1], {
			easing: EASING_FUNCTION,
		}),
	};

	const visibleDomainIndicesFrom_start = interpolate(
		frameRangeEasingPercentage.startFrame,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[0], toViewSpec.visibleDomainIndices[0]]
	);
	const visibleDomainIndicesFrom_end = interpolate(
		frameRangeEasingPercentage.startFrame,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[1], toViewSpec.visibleDomainIndices[1]]
	);

	const visibleDomainIndicesTo_start = interpolate(
		frameRangeEasingPercentage.endFrame,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[0], toViewSpec.visibleDomainIndices[0]]
	);
	const visibleDomainIndicesTo_end = interpolate(
		frameRangeEasingPercentage.endFrame,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[1], toViewSpec.visibleDomainIndices[1]]
	);

	const visibleDomainIndicesFrom = [
		visibleDomainIndicesFrom_start,
		visibleDomainIndicesFrom_end,
	] as [number, number];

	const visibleDomainIndicesTo = [
		visibleDomainIndicesTo_start,
		visibleDomainIndicesTo_end,
	] as [number, number];

	const slicePeriodsScaleFrom = periodsScale({
		dates,
		visibleDomainIndices: visibleDomainIndicesFrom,
		visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
	});

	const slicePeriodsScaleTo = periodsScale({
		dates,
		visibleDomainIndices: visibleDomainIndicesTo,
		visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
	});

	const currentSliceInfo = {
		index: currentTransitionSlice,
		frameRange: currentTransitionSliceFrameRange,
		durationInFrames: sliceDurationInFrames,
		relativeFrame: sliceRelativeFrame,
		framesPercentage: sliceFramesPercentage,
		//
		frameRangeLinearPercentage,
		frameRangeEasingPercentage,
		//
		visibleDomainIndicesFrom,
		visibleDomainIndicesTo,
		//
		periodsScaleFrom: slicePeriodsScaleFrom,
		periodsScaleTo: slicePeriodsScaleTo,
	};

	// *********************************************************

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

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
	});

	// const fromPeriodScale = periodsScale({
	// 	dates,
	// 	visibleDomainIndices: fromViewSpec.visibleDomainIndices,
	// 	visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
	// });
	// const toPeriodScale = periodsScale({
	// 	dates,
	// 	visibleDomainIndices: toViewSpec.visibleDomainIndices,
	// 	visibleRange: [0, AREA_SHOULD_BE_ANIMATED.width],
	// });

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
				currentTransitionInfo,
				currentSliceInfo,
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

// interface FrameRange {
//   startFrame: number;
//   endFrame: number;
// }

function divideFrameRange(
	range: TFrameRange,
	numberOfFragments: number
): TFrameRange[] {
	const {startFrame, endFrame} = range;
	const totalFrames = endFrame - startFrame;
	const fragmentSize = totalFrames / numberOfFragments;

	const fragments: TFrameRange[] = [];

	let previousEnd = startFrame;

	for (let i = 0; i < numberOfFragments; i++) {
		const fragmentStart = previousEnd;
		let fragmentEnd;

		if (i === numberOfFragments - 1) {
			fragmentEnd = endFrame;
		} else {
			fragmentEnd = Math.round(fragmentStart + fragmentSize);
		}

		fragments.push({startFrame: fragmentStart, endFrame: fragmentEnd});
		previousEnd = fragmentEnd;
	}

	return fragments;
}
// // Example usage:
// const range: TFrameRange = {startFrame: 100, endFrame: 120};
// const numberOfFragments = 3;
// const fragments = divideFrameRange(range, numberOfFragments);
// console.log(fragments);
// [
//   { startFrame: 100, endFrame: 107 },
//   { startFrame: 107, endFrame: 114 },
//   { startFrame: 114, endFrame: 120 }
// ]
