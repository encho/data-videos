import {useCurrentFrame, interpolate, useVideoConfig} from 'remotion';
import invariant from 'tiny-invariant';
import {useMemo, useState} from 'react';

import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';
import {
	periodsScale,
	TPeriodsScale,
} from '../../../../acetti-ts-periodsScale/periodsScale';

export type TPeriodScaleAnimationContext = {
	periodsScale: TPeriodsScale;
	setPeriodScalesWidth: (x: number) => void;
	frame: number;
	currentTransitionInfo: {
		index: number;
		frameRange: TFrameRange;
		durationInFrames: number;
		durationInSeconds: number;
		relativeFrame: number;
		framesPercentage: number;
		easingPercentage: number;
		fromDomainIndices: [number, number];
		toDomainIndices: [number, number];
		numberOfSlices: number;
		transitionType: 'ZOOM' | 'DEFAULT';
	};
	currentSliceInfo: {
		index: number;
		frameRange: TFrameRange;
		durationInFrames: number;
		durationInSeconds: number;
		relativeFrame: number;
		framesPercentage: number;
		easingPercentage: number;
		domainIndicesTo: [number, number];
		domainIndicesFrom: [number, number];
		periodsScaleFrom: TPeriodsScale;
		periodsScaleTo: TPeriodsScale;
	};
	allTransitionsAndSlicesOverview: {
		transitionIndex: number;
		frameRange: {startFrame: number; endFrame: number};
		numberOfSlices: number;
		domainIndicesFrom: [number, number];
		domainIndicesTo: [number, number];
		durationInSeconds: number;
		slices: {
			sliceIndex: number;
			frameRange: {startFrame: number; endFrame: number};
			domainIndicesFrom: [number, number];
			domainIndicesTo: [number, number];
		}[];
	}[];
};

type TTransitionSpec = {
	durationInFrames: number;
	easingFunction: (t: number) => number;
	numberOfSlices?: number;
	transitionType: 'DEFAULT' | 'ZOOM';
};

type TTransitionsItem = {
	fromDomainIndices: [number, number];
	toDomainIndices: [number, number];
	transitionSpec: TTransitionSpec;
};

type Args = {
	timeSeries: TimeSeries;
	periodScalesInitialWidth?: number;
	transitions: TTransitionsItem[];
};

export function usePeriodScaleAnimation({
	timeSeries,
	periodScalesInitialWidth = 500,
	transitions,
}: Args): TPeriodScaleAnimationContext {
	// TODO from theme
	// determine number of slices if they are not passed, s.t. a slice lasts around IDEAL_SLICE_DURATION_IN_SECONDS seconds
	const IDEAL_SLICE_DURATION_IN_SECONDS = 0.6;

	const [periodScalesWidth, setPeriodScalesWidth] = useState<number>(
		periodScalesInitialWidth
	);

	const visibleRange = [0, periodScalesWidth] as [number, number];

	const transitionSpecs = useMemo(
		() => transitions.map((it) => it.transitionSpec),
		[transitions]
	);

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const dates = useMemo(() => timeSeries.map((it) => it.date), [timeSeries]);

	// calculating array of frameRanges with shape {startFrame: number; endFrame: number}[]
	const frameRanges = useMemo(
		() => calculateFrameRanges(transitionSpecs),
		[transitionSpecs]
	);

	const allTransitionsAndSlicesOverview = useMemo(() => {
		return frameRanges.map((transitionFrameRange, transitionIndex) => {
			const currentTransition: TTransitionsItem = transitions[transitionIndex];
			invariant(currentTransition);
			const currentTransitionSpec = currentTransition.transitionSpec;
			const durationInSeconds = currentTransitionSpec.durationInFrames / fps;
			const numberOfSlices =
				currentTransitionSpec.numberOfSlices ||
				Math.floor(durationInSeconds / IDEAL_SLICE_DURATION_IN_SECONDS);

			const currentTransitionSlicesFrameRanges = divideFrameRange(
				transitionFrameRange,
				numberOfSlices
			);

			return {
				transitionIndex,
				frameRange: transitionFrameRange,
				// TODO change info in transitions to domainIndicesFrom and domainIndicesTo naming
				domainIndicesFrom: currentTransition.fromDomainIndices,
				domainIndicesTo: currentTransition.toDomainIndices,
				numberOfSlices,
				durationInSeconds,
				slices: currentTransitionSlicesFrameRanges.map(
					(sliceFrameRange, sliceIndex) => {
						// calculate the domainIndicesFrom for the slice
						// ---------------------------------------------
						const sliceDomainIndicesFrom_0 = interpolate(
							sliceFrameRange.startFrame,
							[transitionFrameRange.startFrame, transitionFrameRange.endFrame],
							[
								currentTransition.fromDomainIndices[0],
								currentTransition.toDomainIndices[0],
							],
							{easing: currentTransitionSpec.easingFunction}
						);

						const sliceDomainIndicesFrom_1 = interpolate(
							sliceFrameRange.startFrame,
							[transitionFrameRange.startFrame, transitionFrameRange.endFrame],
							[
								currentTransition.fromDomainIndices[1],
								currentTransition.toDomainIndices[1],
							],
							{easing: currentTransitionSpec.easingFunction}
						);

						const sliceDomainIndicesFrom = [
							sliceDomainIndicesFrom_0,
							sliceDomainIndicesFrom_1,
						] as [number, number];

						// calculate the domainIndicesTo for the slice
						// ---------------------------------------------
						const sliceDomainIndicesTo_0 = interpolate(
							sliceFrameRange.endFrame,
							[transitionFrameRange.startFrame, transitionFrameRange.endFrame],
							[
								currentTransition.fromDomainIndices[0],
								currentTransition.toDomainIndices[0],
							],
							{easing: currentTransitionSpec.easingFunction}
						);
						const sliceDomainIndicesTo_1 = interpolate(
							sliceFrameRange.endFrame,
							[transitionFrameRange.startFrame, transitionFrameRange.endFrame],
							[
								currentTransition.fromDomainIndices[1],
								currentTransition.toDomainIndices[1],
							],
							{easing: currentTransitionSpec.easingFunction}
						);

						const sliceDomainIndicesTo = [
							sliceDomainIndicesTo_0,
							sliceDomainIndicesTo_1,
						] as [number, number];

						return {
							sliceIndex,
							frameRange: sliceFrameRange,
							domainIndicesTo: sliceDomainIndicesTo,
							domainIndicesFrom: sliceDomainIndicesFrom,
						};
					}
				),
			};
		});
	}, [frameRanges, transitions, fps]);

	const totalDuration = frameRanges[frameRanges.length - 1].endFrame + 1;

	invariant(
		totalDuration === durationInFrames,
		'the total duration of the transitions has to equal the durationInFrames of the Sequence.'
	);

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);

	const currentTransitionFrameRange =
		allTransitionsAndSlicesOverview[currentTransitionIndex].frameRange;

	const currentTransitionSpec = transitionSpecs[currentTransitionIndex];
	const currentTransitionFrame = frame - currentTransitionFrameRange.startFrame;

	const currentAnimationPercentage =
		currentTransitionFrame / (currentTransitionSpec.durationInFrames - 1);

	const currentTransition_easingPercentage = interpolate(
		currentAnimationPercentage,
		[0, 1],
		[0, 1],
		{
			easing: currentTransitionSpec.easingFunction,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// TODO rename to domainIndicesFrom
	const fromDomainIndices =
		allTransitionsAndSlicesOverview[currentTransitionIndex].domainIndicesFrom;

	// TODO rename to domainIndicesTo
	const toDomainIndices =
		allTransitionsAndSlicesOverview[currentTransitionIndex].domainIndicesTo;

	// TODO rename to ???
	const transition_durationInSeconds =
		allTransitionsAndSlicesOverview[currentTransitionIndex].durationInSeconds;

	// TODO rename to ???
	const transition_numberOfSlices =
		allTransitionsAndSlicesOverview[currentTransitionIndex].numberOfSlices;

	// ******** current transition information *************************************************
	const currentTransitionInfo = {
		index: currentTransitionIndex,
		frameRange: currentTransitionFrameRange,
		relativeFrame: frame - currentTransitionFrameRange.startFrame,
		framesPercentage: currentAnimationPercentage,
		easingPercentage: currentTransition_easingPercentage,
		fromDomainIndices,
		toDomainIndices,
		durationInFrames: currentTransitionSpec.durationInFrames,
		durationInSeconds: transition_durationInSeconds,
		numberOfSlices: transition_numberOfSlices,
		transitionType: currentTransitionSpec.transitionType,
	};

	// ******** current slice information calculation *************************************************
	const currentTransitionSlicesFrameRanges = divideFrameRange(
		currentTransitionInfo.frameRange,
		currentTransitionInfo.numberOfSlices
	);

	const slice_index = findFrameRangeIndex(
		frame,
		currentTransitionSlicesFrameRanges
	);

	const currentSliceOverview =
		allTransitionsAndSlicesOverview[currentTransitionIndex].slices[slice_index];

	const slice_frameRange = currentSliceOverview.frameRange;

	const slice_relativeFrame = frame - slice_frameRange.startFrame;

	const slice_durationInFrames =
		slice_frameRange.endFrame - slice_frameRange.startFrame + 1;

	const slice_framesPercentage =
		slice_relativeFrame / (slice_durationInFrames - 1);

	// determine slice easingPercentage
	// ******************************************************
	const currentSliceEasingPercentage_maxValue = interpolate(
		slice_frameRange.endFrame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: currentTransitionSpec.easingFunction}
	);

	const currentSliceEasingPercentage_minValue = interpolate(
		slice_frameRange.startFrame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: currentTransitionSpec.easingFunction}
	);

	const currentSliceEasingPercentage_currentValue = interpolate(
		frame,
		[
			currentTransitionInfo.frameRange.startFrame,
			currentTransitionInfo.frameRange.endFrame,
		],
		[0, 1],
		{easing: currentTransitionSpec.easingFunction}
	);

	const slice_easingPercentage = interpolate(
		currentSliceEasingPercentage_currentValue,
		[
			currentSliceEasingPercentage_minValue,
			currentSliceEasingPercentage_maxValue,
		],
		[0, 1],
		{}
	);

	const slice_domainIndicesFrom = currentSliceOverview.domainIndicesFrom;
	const slice_domainIndicesTo = currentSliceOverview.domainIndicesTo;

	const slice_periodsScaleFrom = periodsScale({
		dates,
		visibleDomainIndices: slice_domainIndicesFrom,
		// visibleRange: [0, area.width],
		visibleRange,
	});

	const slice_periodsScaleTo = periodsScale({
		dates,
		visibleDomainIndices: slice_domainIndicesTo,
		// visibleRange: [0, area.width],
		visibleRange,
	});

	const currentSliceInfo = {
		index: slice_index,
		frameRange: slice_frameRange,
		durationInFrames: slice_durationInFrames,
		durationInSeconds: slice_durationInFrames / fps,
		relativeFrame: slice_relativeFrame,
		framesPercentage: slice_framesPercentage,
		easingPercentage: slice_easingPercentage,
		domainIndicesFrom: slice_domainIndicesFrom,
		domainIndicesTo: slice_domainIndicesTo,
		periodsScaleFrom: slice_periodsScaleFrom,
		periodsScaleTo: slice_periodsScaleTo,
	};
	// *********************************************************

	const animatedVisibleDomainIndexStart = interpolate(
		currentTransitionInfo.easingPercentage,
		[0, 1],
		[fromDomainIndices[0], toDomainIndices[0]]
	);

	const animatedVisibleDomainIndexEnd = interpolate(
		currentTransitionInfo.easingPercentage,
		[0, 1],
		[fromDomainIndices[1], toDomainIndices[1]]
	);

	const currentPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		],
		visibleRange,
	});

	return {
		periodsScale: currentPeriodsScale,
		setPeriodScalesWidth,
		frame,
		currentTransitionInfo,
		currentSliceInfo,
		allTransitionsAndSlicesOverview,
	};
}

type TFrameRange = {
	startFrame: number;
	endFrame: number;
};

// TODO use the one in useListAnimation
const calculateFrameRanges = (transitionSpecs: TTransitionSpec[]) => {
	// Calculate frame ranges
	const frameRanges: TFrameRange[] = transitionSpecs.reduce(
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
export function findFrameRangeIndex(
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
