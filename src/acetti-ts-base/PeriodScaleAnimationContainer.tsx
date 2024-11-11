import {Sequence, useCurrentFrame, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from '../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	getTimeSeriesInterpolatedExtentFromVisibleDomainIndices,
	periodsScale,
	TPeriodsScale,
} from '../acetti-ts-periodsScale/periodsScale';

// type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

export type TPeriodScaleAnimationContext = {
	periodsScale: TPeriodsScale;
	frame: number;
	currentTransitionInfo: {
		index: number;
		frameRange: TFrameRange;
		durationInFrames: number;
		durationInSeconds: number;
		relativeFrame: number; // TODO rename to linearPercentage (also for currentSlice object)
		framesPercentage: number;
		easingPercentage: number;
		fromViewSpec: TViewSpec;
		toViewSpec: TViewSpec;
	};
	currentSliceInfo: {
		index: number;
		frameRange: TFrameRange;
		// *************************************************
		// TODO evtl. deprecate the following 2:
		// *************************************************
		frameRangeLinearPercentage: {startFrame: number; endFrame: number};
		frameRangeEasingPercentage: {startFrame: number; endFrame: number};
		// *************************************************
		durationInFrames: number;
		durationInSeconds: number;
		relativeFrame: number;
		framesPercentage: number; // TODO rename evtl. to linearPercentage
		easingPercentage: number;
		visibleDomainIndicesFrom: [number, number];
		visibleDomainIndicesTo: [number, number];
		periodsScaleFrom: TPeriodsScale;
		periodsScaleTo: TPeriodsScale;
	};
};

type TChildrenFuncArgs = TPeriodScaleAnimationContext;

// const yDomainType: TYDomainType = 'VISIBLE';
// const yDomainType: TYDomainType = 'FULL';
// const yDomainType: TYDomainType = 'ZERO_FULL';

type TViewSpec = {
	// area: TGridLayoutArea;
	visibleDomainIndices: [number, number];
};

type TTransitionSpec = {
	durationInFrames: number;
	easingFunction: (t: number) => number;
	numberOfSlices: number;
	transitionType: 'DEFAULT' | 'ZOOM';
};

export const PeriodScaleAnimationContainer: React.FC<{
	timeSeries: TimeSeries;
	area: TGridLayoutArea;
	viewSpecs: TViewSpec[];
	transitionSpecs: TTransitionSpec[];
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
	yDomain?: [number, number];
}> = ({
	timeSeries, // TODO array of periods is enough!
	area,
	viewSpecs,
	transitionSpecs,
	children,
	yDomain: yDomainProp,
}) => {
	// ensure the length of the passed props are as expected
	invariant(
		transitionSpecs.length === viewSpecs.length - 1,
		'length of transitionSpecs and viewSpecs is not matching! there should be exactly one less transitionSpec than viewSpec!'
	);

	const frame = useCurrentFrame();
	const {
		fps,
		// durationInFrames
	} = useVideoConfig();

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
		currentTransitionFrame / (currentTransition.durationInFrames - 1);

	const currentTransition_easingPercentage = interpolate(
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

	// const AREA_SHOULD_BE_ANIMATED = fromViewSpec.area;
	const AREA_SHOULD_BE_ANIMATED = area;

	// ******** current transition information *************************************************
	const currentTransitionInfo = {
		index: currentTransitionIndex,
		frameRange: currentFrameRange,
		durationInFrames: currentTransition.durationInFrames,
		durationInSeconds: currentTransition.durationInFrames / fps,
		relativeFrame: frame - currentFrameRange.startFrame,
		//
		framesPercentage: currentAnimationPercentage,
		easingPercentage: currentTransition_easingPercentage,
		//
		fromViewSpec: fromViewSpec,
		toViewSpec: toViewSpec,
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
		currentTransitionSliceFrameRange.startFrame +
		1;

	const sliceFramesPercentage =
		sliceRelativeFrame / (sliceDurationInFrames - 1);

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

	// determine slice easingPercentage
	const currentSliceEasingPercentage_maxValue = interpolate(
		currentTransitionSliceFrameRange.endFrame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: EASING_FUNCTION}
	);

	const currentSliceEasingPercentage_minValue = interpolate(
		currentTransitionSliceFrameRange.startFrame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: EASING_FUNCTION}
	);

	const currentSliceEasingPercentage_currentValue = interpolate(
		frame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: EASING_FUNCTION}
	);

	const currentSliceEasingPercentage = interpolate(
		currentSliceEasingPercentage_currentValue,
		[
			currentSliceEasingPercentage_minValue,
			currentSliceEasingPercentage_maxValue,
		],
		[0, 1],
		{}
	);

	const currentSliceInfo = {
		index: currentTransitionSlice,
		frameRange: currentTransitionSliceFrameRange,
		durationInFrames: sliceDurationInFrames,
		durationInSeconds: sliceDurationInFrames / fps,
		relativeFrame: sliceRelativeFrame,
		framesPercentage: sliceFramesPercentage,
		easingPercentage: currentSliceEasingPercentage,
		frameRangeLinearPercentage,
		frameRangeEasingPercentage,
		visibleDomainIndicesFrom,
		visibleDomainIndicesTo,
		periodsScaleFrom: slicePeriodsScaleFrom,
		periodsScaleTo: slicePeriodsScaleTo,
	};

	// *********************************************************

	const animatedVisibleDomainIndexStart = interpolate(
		currentTransitionInfo.easingPercentage,
		[0, 1],
		[fromViewSpec.visibleDomainIndices[0], toViewSpec.visibleDomainIndices[0]]
	);

	const animatedVisibleDomainIndexEnd = interpolate(
		currentTransitionInfo.easingPercentage,
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

	const currentTransitionType = currentTransition.transitionType;

	let yScale: ScaleLinear<number, number>;

	if (currentTransitionType === 'DEFAULT') {
		// TODO yDomainType is not addressed here!
		const yDomain =
			yDomainProp ||
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(timeSeries, [
				animatedVisibleDomainIndexStart,
				animatedVisibleDomainIndexEnd,
			] as [number, number]);

		yScale = scaleLinear()
			.domain(yDomain)
			// TODO domain zero to be added via yDomainType
			// .domain(yDomainZero)
			.range([AREA_SHOULD_BE_ANIMATED.height, 0]);
		// } else if (currentTransitionType === 'ZOOM') {
	} else if (currentTransitionType === 'ZOOM') {
		const yDomainFrom = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			fromViewSpec.visibleDomainIndices
		);
		const yDomainTo = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			toViewSpec.visibleDomainIndices
		);

		const animatedYDomain_0 = interpolate(
			currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[0], yDomainTo[0]]
		);
		const animatedYDomain_1 = interpolate(
			currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[1], yDomainTo[1]]
		);

		const zoomingCurrentYDomain = [animatedYDomain_0, animatedYDomain_1] as [
			number,
			number
		];

		yScale = scaleLinear()
			.domain(zoomingCurrentYDomain)
			// TODO domain zero to be added via yDomainType
			// .domain(yDomainZero)
			.range([AREA_SHOULD_BE_ANIMATED.height, 0]);
	} else {
		throw Error('Unknown transitionType');
	}

	return (
		<Sequence from={0} durationInFrames={totalDuration} layout="none">
			{children({
				periodsScale: currentPeriodsScale,
				// yScale,
				frame,
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
				acc.push({startFrame: 0, endFrame: transition.durationInFrames - 1});
			} else {
				// Calculate the start frame based on the end frame of the last item
				const startFrame = acc[index - 1].endFrame + 1;
				const endFrame = startFrame + transition.durationInFrames - 1;
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
			currentFrame <= ranges[i].endFrame
		) {
			return i;
		}
	}
	return -1; // Return -1 if no matching range is found
}

function divideFrameRange(
	range: TFrameRange,
	numberOfFragments: number
): TFrameRange[] {
	const {startFrame, endFrame} = range;
	const totalFrames = endFrame - startFrame + 1; // Include the start and end frames in the count
	const fragmentLength = Math.floor(totalFrames / numberOfFragments);
	const remainder = totalFrames % numberOfFragments;

	const fragments = [];
	let currentStart = startFrame;

	for (let i = 0; i < numberOfFragments; i++) {
		const currentEnd =
			currentStart + fragmentLength - 1 + (i < remainder ? 1 : 0);
		fragments.push({startFrame: currentStart, endFrame: currentEnd});
		currentStart = currentEnd + 1;
	}

	return fragments;
}

// Example usage:
// const range: TFrameRange = {startFrame: 100, endFrame: 120};
// const fragments = divideFrameRange(range, 3);
// console.log(fragments);
// [
//   { startFrame: 100, endFrame: 106 },
//   { startFrame: 107, endFrame: 113 },
//   { startFrame: 114, endFrame: 120 }
// ]
