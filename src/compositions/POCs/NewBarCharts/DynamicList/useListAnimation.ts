import {EasingFunction, useCurrentFrame, useVideoConfig} from 'remotion';
import {useMemo} from 'react';
import invariant from 'tiny-invariant';

import {findFrameRangeIndex} from '../../09-Timeseries/utils/usePeriodScaleAnimation';
import {
	TDynamicListTransitionContext,
	useListTransition,
} from './useListTransition/useListTransition';

export type ListAnimationTransition<T> = {
	// from: {visibleIndices, items} // TODO
	itemsFrom?: T[];
	visibleIndicesFrom?: [number, number];
	// to: {visibleIndices, items} // TODO
	itemsTo: T[];
	visibleIndicesTo?: [number, number];
	//
	easing: EasingFunction;
	durationInFrames: number;
};

type EditedListAnimationTransition<T> = ListAnimationTransition<T> & {
	frameRange: TFrameRange;
	// from: {visibleIndices, items} // TODO
	// to: {visibleIndices, items} // TODO
	itemsFrom: T[];
	itemsTo: T[];
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	easing: EasingFunction;
	durationInFrames: number;
	// vistibleItemsFrom: T[]; // currently happening in useListTransition
	// vistibleItemsTo: T[]; // currently happening in useListTransition
};

export type ListAnimationContext<T extends {id: string}> = {
	frame: number;
	durationInFrames: number;
	numberOfTransitions: number;
	currentTransitionIndex: number;
	// TODO add linearPercentage to context, not everywhing should animate with the easingTransition for the list items!!!
	currentTransitionContext: TDynamicListTransitionContext<T>;
	transitions: EditedListAnimationTransition<T>[];
};

type UseListAnimationArgs<T> = {
	width: number;
	height: number;
	itemHeight?: number;
	transitions: ListAnimationTransition<T>[];
	// easing?: EasingFunction; // TODO
};

// TODO, this actually represents only 1 animation step. the useListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useListAnimation<T extends {id: string}>({
	width,
	height,
	transitions,
	itemHeight = 100,
}: UseListAnimationArgs<T>): ListAnimationContext<T> {
	const frame = useCurrentFrame();
	const {
		// fps,
		durationInFrames,
	} = useVideoConfig();

	const ITEM_MARGIN_TOP = 0;
	const ITEM_MARGIN_BOTTOM = 0;

	const frameRanges = useMemo(() => {
		const transitionDurations = transitions.map((it) => it.durationInFrames);
		return calculateFrameRanges(transitionDurations);
	}, [transitions]);

	const editedTransitions = transitions.reduce<
		EditedListAnimationTransition<T>[]
	>((memo, currentTransition, i) => {
		const itemsFrom = currentTransition.itemsFrom
			? currentTransition.itemsFrom
			: i === 0
			? []
			: memo[i - 1].itemsTo;

		const visibleIndicesFrom = currentTransition.visibleIndicesFrom
			? currentTransition.visibleIndicesFrom
			: itemsFrom.length === 0
			? ([0, 0] as [number, number])
			: ([0, itemsFrom.length] as [number, number]);

		const visibleIndicesTo = currentTransition.visibleIndicesTo
			? currentTransition.visibleIndicesTo
			: ([0, currentTransition.itemsTo.length] as [number, number]);

		const editedTransition = {
			...currentTransition,
			itemsFrom,
			visibleIndicesFrom,
			visibleIndicesTo,
			frameRange: frameRanges[i],
		};

		return [...memo, editedTransition];
	}, []);

	const totalDurationInFrames =
		frameRanges[frameRanges.length - 1].endFrame + 1;
	invariant(
		totalDurationInFrames === durationInFrames,
		'useListAnimation.ts: the total duration of the transitions has to equal the durationInFrames of the Sequence.'
	);

	const currentTransitionIndex = findFrameRangeIndex(frame, frameRanges);
	const currentRelativeFrame =
		frame - editedTransitions[currentTransitionIndex].frameRange.startFrame;

	const currentTransitionContext = useListTransition({
		width,
		height,
		itemHeight,
		itemMarginTop: ITEM_MARGIN_TOP,
		itemMarginBottom: ITEM_MARGIN_BOTTOM,
		easing: editedTransitions[currentTransitionIndex].easing,
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
