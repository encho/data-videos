import {
	// interpolate,
	// Easing,
	EasingFunction,
} from 'remotion';
import {useMemo} from 'react';
// import invariant from 'tiny-invariant';

// import {TGridLayoutArea} from '../../../../acetti-layout';
// import {TDynamicListLayout} from './useDynamicListLayout';
// import {useDynamicListLayout} from './useDynamicListLayout';

// type Item = {id: string};
// TODO type generics with T = {id: string} & other

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
};

export type ListAnimationContext<T extends {id: string}> = {
	numberOfTransitions: number;
	transitions: EditedListAnimationTransition<T>[];
	// layoutFrom: TDynamicListLayout;
	// layoutTo: TDynamicListLayout;
	// itemsFrom: T[];
	// itemsTo: T[];
	// visibleItemsTo: T[];
	// visibleItemsFrom: T[];
	// visibleIndicesFrom: [number, number];
	// visibleIndicesTo: [number, number];
	// visibleIndicesRangeFrom: [number, number];
	// visibleIndicesRangeTo: [number, number];
	// visibleIndicesRangeSizeFrom: number;
	// visibleIndicesRangeSizeTo: number;
	// getListItemAreaFrom: (i: number | string) => TGridLayoutArea;
	// getListItemAreaTo: (i: number | string) => TGridLayoutArea;
	// justifyContentShiftFrom: number;
	// justifyContentShiftTo: number;
	// frame: number;
	// durationInFrames: number;
	// transitionTypes: {
	// 	update: string[];
	// 	enter: string[];
	// 	exit: string[];
	// 	appear: string[];
	// 	disappear: string[];
	// };
	// itemHeight: number;
	// width: number;
	// easingPercentage: number;
	// TODO
	// easing?: (x: number) => number;
	// baseline
};

type UseListAnimationArgs<T> = {
	transitions: ListAnimationTransition<T>[];
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useListAnimation<T extends {id: string}>({
	transitions,
}: UseListAnimationArgs<T>): ListAnimationContext<T> {
	const frameRanges = useMemo(() => {
		const transitionDurations = transitions.map((it) => it.durationInFrames);
		return calculateFrameRanges(transitionDurations);
	}, [transitions]);

	const editedTransitions = transitions.map((it, i) => ({
		...it,
		frameRange: frameRanges[i],
	}));

	return {
		numberOfTransitions: transitions.length,
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
