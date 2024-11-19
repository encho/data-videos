import {EasingFunction, useCurrentFrame, useVideoConfig} from 'remotion';
import {useMemo} from 'react';
import invariant from 'tiny-invariant';

import {findFrameRangeIndex} from '../../09-Timeseries/utils/usePeriodScaleAnimation';
import {
	TDynamicListTransitionContext,
	useDynamicListTransition,
} from './useDynamicListTransition';

type ListAnimationTransition<T> = {
	itemsFrom: T[];
	itemsTo: T[];
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	easingFunction: EasingFunction;
	durationInFrames: number;
};

type EditedListAnimationTransition<T> = ListAnimationTransition<T> & {
	frameRange: TFrameRange;
	// TODO
	// visibleItemsFrom: T[];
	// visibleItemsTo: T[];
};

export type ListAnimationContext<T extends {id: string}> = {
	frame: number;
	durationInFrames: number;
	numberOfTransitions: number;
	currentTransitionIndex: number;
	currentTransitionContext: TDynamicListTransitionContext<T>;
	transitions: EditedListAnimationTransition<T>[];
};

type UseListAnimationArgs<T> = {
	width: number;
	height: number;
	transitions: ListAnimationTransition<T>[];
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useListAnimation<T extends {id: string}>({
	width,
	height,
	transitions,
}: UseListAnimationArgs<T>): ListAnimationContext<T> {
	const frame = useCurrentFrame();
	const {
		// fps,
		durationInFrames,
	} = useVideoConfig();

	const frameRanges = useMemo(() => {
		const transitionDurations = transitions.map((it) => it.durationInFrames);
		return calculateFrameRanges(transitionDurations);
	}, [transitions]);

	// TODO wrap in useMemo
	const editedTransitions = transitions.map((it, i) => {
		//
		return {
			...it,
			frameRange: frameRanges[i],
		};
	});

	const totalDurationInFrames =
		frameRanges[frameRanges.length - 1].endFrame + 1;
	invariant(
		totalDurationInFrames === durationInFrames,
		'useListAnimation.ts: the total duration of the transitions has to equal the durationInFrames of the Sequence.'
	);

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);
	const currentRelativeFrame =
		frame - editedTransitions[currentTransitionIndex].frameRange.startFrame;

	const currentTransitionContext = useDynamicListTransition({
		width,
		height,
		itemHeight: 100,
		itemMarginTop: 20,
		itemMarginBottom: 20,
		itemsFrom: editedTransitions[currentTransitionIndex].itemsFrom,
		itemsTo: editedTransitions[currentTransitionIndex].itemsTo,
		visibleIndicesFrom:
			editedTransitions[currentTransitionIndex].visibleIndicesFrom,
		visibleIndicesTo:
			editedTransitions[currentTransitionIndex].visibleIndicesTo,
		justifyContent: 'start',
		frame: currentRelativeFrame,
		durationInFrames:
			editedTransitions[currentTransitionIndex].frameRange.endFrame -
			editedTransitions[currentTransitionIndex].frameRange.startFrame +
			1,
	});

	return {
		frame,
		durationInFrames,
		numberOfTransitions: transitions.length,
		currentTransitionIndex,
		currentTransitionContext,
		transitions: editedTransitions,
	};
}

type TFrameRange = {
	startFrame: number;
	endFrame: number;
};

// TODO replace the same named function in usePeriodScaleAnimation with this one
const calculateFrameRanges = (frameDurations: number[]) => {
	// Calculate frame ranges
	const frameRanges: TFrameRange[] = frameDurations.reduce(
		(acc, currentFrameDuration, index) => {
			if (index === 0) {
				// For the first element, the start frame is 0
				acc.push({startFrame: 0, endFrame: currentFrameDuration - 1});
			} else {
				// Calculate the start frame based on the end frame of the last item
				const startFrame = acc[index - 1].endFrame + 1;
				const endFrame = startFrame + currentFrameDuration - 1;
				acc.push({startFrame, endFrame});
			}
			return acc;
		},
		[] as TFrameRange[]
	);

	return frameRanges;
};
