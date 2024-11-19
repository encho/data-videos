// import {
// 	interpolate,
// 	Easing, EasingFunction
// } from 'remotion';
// import invariant from 'tiny-invariant';

// import {TGridLayoutArea} from '../../../../acetti-layout';
// import {TDynamicListLayout} from './useDynamicListLayout';
// import {useDynamicListLayout} from './useDynamicListLayout';

// type Item = {id: string};
// TODO type generics with T = {id: string} & other

export type ListAnimationContext<T extends {id: string}> = {
	test: string;
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

type UseListAnimationArgs = {
	test: string;
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useListAnimation<T extends {id: string}>({
	test,
}: UseListAnimationArgs): ListAnimationContext<T> {
	return {
		test,
	};
}
