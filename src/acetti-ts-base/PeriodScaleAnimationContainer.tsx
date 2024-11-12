import {Sequence, useCurrentFrame, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';
import {useMemo} from 'react';

import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from '../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	getTimeSeriesInterpolatedExtentFromVisibleDomainIndices,
	periodsScale,
	TPeriodsScale,
} from '../acetti-ts-periodsScale/periodsScale';

export type TPeriodScaleAnimationContext = {
	periodsScale: TPeriodsScale;
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
	}[];
	// allSlicesInfo: {
	// 	index: number;
	// 	transitionIndex: number;
	// 	transitionSliceIndex: number;
	// 	frameRange: {startFrame: number; endFrame: number};
	// 	domainIndicesFrom: [number, number];
	// 	domainIndicesTo: [number, number];
	// };
};

type TChildrenFuncArgs = TPeriodScaleAnimationContext;

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

export const PeriodScaleAnimationContainer: React.FC<{
	timeSeries: TimeSeries;
	area: TGridLayoutArea;
	transitions: TTransitionsItem[];
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({
	timeSeries, // TODO array of periods is enough!
	area,
	transitions,
	children,
}) => {
	// TODO from theme
	// determine number of slices if they are not passed, s.t. a slice lasts around IDEAL_SLICE_DURATION_IN_SECONDS seconds
	const IDEAL_SLICE_DURATION_IN_SECONDS = 0.6;

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

	// console.log({frameRanges});
	const allTransitionsAndSlicesOverview = useMemo(() => {
		return frameRanges.map((frameRange, transitionIndex) => {
			const currentTransition = transitions[transitionIndex];
			const currentTransitionSpec = currentTransition.transitionSpec;

			const durationInSeconds = currentTransitionSpec.durationInFrames / fps;

			const numberOfSlices =
				currentTransitionSpec.numberOfSlices ||
				Math.floor(durationInSeconds / IDEAL_SLICE_DURATION_IN_SECONDS);

			return {
				transitionIndex,
				frameRange,
				// TODO change info in transitions to domainIndicesFrom and domainIndicesTo naming
				domainIndicesFrom: currentTransition.fromDomainIndices,
				domainIndicesTo: currentTransition.toDomainIndices,
				numberOfSlices,
			};
		});
	}, [frameRanges, transitions]);

	const totalDuration = frameRanges[frameRanges.length - 1].endFrame + 1;

	invariant(
		totalDuration === durationInFrames,
		'the total duration of the transitions has to equal the durationInFrames of the Sequence.'
	);

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);

	const currentTransitionFrameRange = frameRanges[currentTransitionIndex];

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

	const fromDomainIndices =
		transitions[currentTransitionIndex].fromDomainIndices;

	const toDomainIndices = transitions[currentTransitionIndex].toDomainIndices;

	const transition_durationInSeconds =
		currentTransitionSpec.durationInFrames / fps;

	const transition_numberOfSlices =
		currentTransitionSpec.numberOfSlices ||
		Math.floor(transition_durationInSeconds / IDEAL_SLICE_DURATION_IN_SECONDS);

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
		durationInSeconds: currentTransitionSpec.durationInFrames / fps,
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

	const slice_frameRange = currentTransitionSlicesFrameRanges[slice_index];

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

	const frameRangeLinearPercentage = {
		startFrame:
			(slice_frameRange.startFrame -
				currentTransitionInfo.frameRange.startFrame) /
			(currentTransitionInfo.durationInFrames - 1),
		endFrame:
			(slice_frameRange.endFrame -
				currentTransitionInfo.frameRange.startFrame) /
			(currentTransitionInfo.durationInFrames - 1),
	};

	const frameRangeEasingPercentage = {
		startFrame: interpolate(
			frameRangeLinearPercentage.startFrame,
			[0, 1],
			[0, 1],
			{
				easing: currentTransitionSpec.easingFunction,
			}
		),
		endFrame: interpolate(frameRangeLinearPercentage.endFrame, [0, 1], [0, 1], {
			easing: currentTransitionSpec.easingFunction,
		}),
	};

	const slice_domainIndicesFrom_start = interpolate(
		frameRangeEasingPercentage.startFrame,
		[0, 1],
		[fromDomainIndices[0], toDomainIndices[0]]
	);
	const slice_domainIndicesFrom_end = interpolate(
		frameRangeEasingPercentage.startFrame,
		[0, 1],
		[fromDomainIndices[1], toDomainIndices[1]]
	);

	const slice_domainIndicesTo_start = interpolate(
		frameRangeEasingPercentage.endFrame,
		[0, 1],
		[fromDomainIndices[0], toDomainIndices[0]]
	);
	const slice_domainIndicesTo_end = interpolate(
		frameRangeEasingPercentage.endFrame,
		[0, 1],
		[fromDomainIndices[1], toDomainIndices[1]]
	);

	const slice_domainIndicesFrom = [
		slice_domainIndicesFrom_start,
		slice_domainIndicesFrom_end,
	] as [number, number];

	const slice_domainIndicesTo = [
		slice_domainIndicesTo_start,
		slice_domainIndicesTo_end,
	] as [number, number];

	const slice_periodsScaleFrom = periodsScale({
		dates,
		visibleDomainIndices: slice_domainIndicesFrom,
		visibleRange: [0, area.width],
	});

	const slice_periodsScaleTo = periodsScale({
		dates,
		visibleDomainIndices: slice_domainIndicesTo,
		visibleRange: [0, area.width],
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
		visibleRange: [0, area.width],
	});

	// const currentTransitionType = currentTransitionSpec.transitionType;
	// const currentTransitionType = "ZOOM";
	const currentTransitionType = 'DEFAULT';

	// ***********************************
	// TODO deprecate the y Axis stuff.....
	// ***********************************

	let yScale: ScaleLinear<number, number>;

	const yDomainProp = null;

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
			.range([area.height, 0]);
		// } else if (currentTransitionType === 'ZOOM') {
	} else if (currentTransitionType === 'ZOOM') {
		const yDomainFrom = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			fromDomainIndices
		);
		const yDomainTo = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			toDomainIndices
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
			.range([area.height, 0]);
	} else {
		throw Error('Unknown transitionType');
	}

	return (
		<Sequence from={0} durationInFrames={totalDuration} layout="none">
			{children({
				periodsScale: currentPeriodsScale,
				frame,
				currentTransitionInfo,
				currentSliceInfo,
				allTransitionsAndSlicesOverview,
			})}
		</Sequence>
	);
};

type TFrameRange = {
	startFrame: number;
	endFrame: number;
};

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
