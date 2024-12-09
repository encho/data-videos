import {
	EasingFunction,
	useCurrentFrame,
	Easing,
	useVideoConfig,
} from 'remotion';
import {useMemo} from 'react';
import invariant from 'tiny-invariant';

import {getVisibleItems} from './useListTransition/useListTransition';
import {findFrameRangeIndex} from '../../../../09-Timeseries/utils/usePeriodScaleAnimation';
import {
	TDynamicListTransitionContext,
	useListTransition,
} from './useListTransition/useListTransition';

export type ListAnimationTransition<T> = {
	durationInFrames: number;
	easing?: EasingFunction;
	itemsFrom?: T[];
	visibleIndicesFrom?: [number, number];
	itemsTo: T[];
	visibleIndicesTo?: [number, number];
};

type EditedListAnimationTransition<T> = {
	easing?: EasingFunction;
	durationInFrames: number;
	frameRange: TFrameRange;
	from: {
		items: T[];
		itemSize: number;
		visibleIndices: [number, number];
		visibleItems: T[];
	};
	to: {
		items: T[];
		itemSize: number;
		visibleIndices: [number, number];
		visibleItems: T[];
	};
};

export type ListAnimationContext<T extends {id: string}> = {
	direction: 'vertical' | 'horizontal';
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
	itemSize?: number;
	fitItemSizes?: boolean;
	transitions: ListAnimationTransition<T>[];
	easing?: EasingFunction;
	justifyContent?: 'start' | 'center'; // TODO add "end"
	direction: 'vertical' | 'horizontal';
};

export function useListAnimation<T extends {id: string}>({
	direction,
	width,
	height,
	transitions,
	itemSize = 100,
	fitItemSizes = false,
	easing: easingProp = Easing.ease,
	justifyContent = 'start',
}: UseListAnimationArgs<T>): ListAnimationContext<T> {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const ITEM_MARGIN_BEFORE = 0;
	const ITEM_MARGIN_AFTER = 0;

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
			: memo[i - 1].to.items;

		const visibleIndicesFrom = currentTransition.visibleIndicesFrom
			? currentTransition.visibleIndicesFrom
			: itemsFrom.length === 0
			? ([0, 0] as [number, number])
			: memo[i - 1].to.visibleIndices;

		const visibleIndicesTo = currentTransition.visibleIndicesTo
			? currentTransition.visibleIndicesTo
			: ([0, currentTransition.itemsTo.length] as [number, number]);

		const visibleItemsFrom = getVisibleItems<T>(itemsFrom, visibleIndicesFrom);
		const visibleItemsTo = getVisibleItems<T>(
			currentTransition.itemsTo,
			visibleIndicesTo
		);

		const itemsAvailableSpace = direction === 'vertical' ? height : width;

		const itemSizeFrom = fitItemSizes
			? itemsAvailableSpace / visibleItemsFrom.length
			: itemSize;

		const itemSizeTo = fitItemSizes
			? itemsAvailableSpace / visibleItemsTo.length
			: itemSize;

		const easing = currentTransition.easing
			? currentTransition.easing
			: easingProp;

		const editedTransition: EditedListAnimationTransition<T> = {
			easing,
			frameRange: frameRanges[i],
			durationInFrames: currentTransition.durationInFrames,
			from: {
				items: itemsFrom,
				itemSize: itemSizeFrom,
				visibleIndices: visibleIndicesFrom,
				visibleItems: visibleItemsFrom,
			},
			to: {
				items: currentTransition.itemsTo,
				itemSize: itemSizeTo,
				visibleIndices: visibleIndicesTo,
				visibleItems: visibleItemsTo,
			},
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
		from: {
			items: editedTransitions[currentTransitionIndex].from.items,
			visibleIndices:
				editedTransitions[currentTransitionIndex].from.visibleIndices,
			itemSize: editedTransitions[currentTransitionIndex].from.itemSize,
		},
		to: {
			items: editedTransitions[currentTransitionIndex].to.items,
			visibleIndices:
				editedTransitions[currentTransitionIndex].to.visibleIndices,
			itemSize: editedTransitions[currentTransitionIndex].to.itemSize,
		},
		direction,
		width,
		height,
		itemMarginBefore: ITEM_MARGIN_BEFORE,
		itemMarginAfter: ITEM_MARGIN_AFTER,
		easing: editedTransitions[currentTransitionIndex].easing,
		justifyContent,
		frame: currentRelativeFrame,
		globalAnimationFrame: frame,
		globalAnimationDurationInFrames: durationInFrames,
		frameRange: editedTransitions[currentTransitionIndex].frameRange,
		durationInFrames:
			editedTransitions[currentTransitionIndex].frameRange.endFrame -
			editedTransitions[currentTransitionIndex].frameRange.startFrame +
			1,
	});

	return {
		direction,
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
