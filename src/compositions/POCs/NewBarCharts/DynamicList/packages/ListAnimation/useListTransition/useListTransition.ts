import {interpolate, Easing, EasingFunction} from 'remotion';
import invariant from 'tiny-invariant';
import {useCallback} from 'react';

import {TGridLayoutArea} from '../../../../../../../acetti-layout';
import {getListLayout, TListLayout} from './getListLayout';

type ListTransitionState<T> = {
	items: T[];
	itemSize: number;
	visibleIndices: [number, number];
	visibleItems: T[];
	layout: TListLayout;
	visibleIndicesRange: [number, number];
	visibleIndicesRangeSize: number;
	justifyContentShift: number;
	getListItemArea: (i: number | string) => TGridLayoutArea;
};

type ListTransitionContext_Common = {
	direction: 'vertical' | 'horizontal';
	frame: number;
	globalAnimationFrame: number;
	durationInFrames: number;
	width: number;
	height: number;
	easingPercentage: number;
	frameRange: {startFrame: number; endFrame: number};
};

export type ListTransitionContext_Enter<T> = ListTransitionContext_Common & {
	transitionType: 'enter';
	to: ListTransitionState<T>;
};

export type ListTransitionContext_Exit<T> = ListTransitionContext_Common & {
	transitionType: 'exit';
	from: ListTransitionState<T>;
};

export type ListTransitionContext_Update<T> = ListTransitionContext_Common & {
	transitionType: 'update';
	from: ListTransitionState<T>;
	to: ListTransitionState<T>;
	transitionTypes: {
		update: string[];
		enter: string[];
		exit: string[];
		appear: string[];
		disappear: string[];
	};
};

export type ListTransitionContext<T> =
	| ListTransitionContext_Enter<T>
	| ListTransitionContext_Update<T>
	| ListTransitionContext_Exit<T>;

// TODO deprecate former name and just use TListTransitionContext or so
export type TDynamicListTransitionContext<T extends {id: string}> =
	ListTransitionContext<T>;

// TODO, this actually represents only 1 animation step. the useListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useListTransition<T extends {id: string}>({
	direction,
	from: fromProp,
	to: toProp,
	width,
	height,
	itemMarginBefore = 0,
	itemMarginAfter = 0,
	justifyContent = 'center',
	frame,
	durationInFrames,
	globalAnimationFrame,
	globalAnimationDurationInFrames,
	easing = Easing.linear,
	frameRange,
}: {
	direction: 'vertical' | 'horizontal';
	from: {
		items: T[];
		visibleIndices: [number, number];
		itemSize: number;
	};
	to: {
		items: T[];
		visibleIndices: [number, number];
		itemSize: number;
	};
	frameRange: {startFrame: number; endFrame: number};
	width: number;
	height: number;
	itemMarginBefore?: number; // TODO not optional
	itemMarginAfter?: number; // TODO not optional
	justifyContent?: 'center' | 'start';
	frame: number;
	globalAnimationFrame: number;
	globalAnimationDurationInFrames: number;
	durationInFrames: number;
	easing?: EasingFunction;
	// TODO: baseline, to determine the sizes in the layout!!!!!!!!!!!
}): TDynamicListTransitionContext<T> {
	const easingPercentage = interpolate(
		frame,
		[0, durationInFrames - 1],
		[0, 1],
		{
			easing,
		}
	);

	const common = {
		direction,
		frame,
		durationInFrames,
		globalAnimationFrame,
		globalAnimationDurationInFrames,
		easingPercentage,
		frameRange,
		// transitionTypes, // in update instead
		// itemHeight,
		width,
		height,
	};

	const isEnterTransition = fromProp.items.length === 0;
	const isExitTransition = toProp.items.length === 0;

	const transitionType = isEnterTransition
		? 'enter'
		: isExitTransition
		? 'exit'
		: 'update';

	invariant(
		!(isEnterTransition && isExitTransition),
		'transition can not have empty visibleItemsFrom as well as empty visibleItemsTo!'
	);

	const getTransitionStateData = useCallback(
		({
			items,
			visibleIndices,
			itemSize: itemSizeArg,
		}: {
			items: T[];
			visibleIndices: [number, number];
			itemSize: number;
		}) => {
			const visibleItems = getVisibleItems<T>(items, visibleIndices);

			// TODO pass height to useListTransition, because it may be that if we use
			// fixed itemHeights,  we need that info to center all the items (justifyContent)
			// const height = itemHeightArg * visibleItems.length;

			const layout = getListLayout({
				direction,
				width,
				height,
				items,
				itemSize: itemSizeArg,
				itemMarginBefore,
				itemMarginAfter,
			});

			const visibleIndicesRange = layout.getVisibleIndicesRange(visibleIndices);

			const visibleIndicesRangeSize =
				visibleIndicesRange[1] - visibleIndicesRange[0];

			// justify content // TODO here direction agnostic!!!j
			const availableItemsSize = direction === 'vertical' ? height : width;
			const freeSpace = availableItemsSize - visibleIndicesRangeSize;

			const adjustedStart = justifyContent === 'center' ? freeSpace / 2 : 0;

			const unadjustedStart =
				direction === 'vertical'
					? layout.getListItemPaddedArea(visibleItems[0].id).y1
					: layout.getListItemPaddedArea(visibleItems[0].id).x1;

			const justifyContentShift = adjustedStart - unadjustedStart;

			return {
				items,
				itemSize: itemSizeArg,
				visibleIndices,
				visibleItems,
				layout,
				visibleIndicesRange,
				visibleIndicesRangeSize,
				justifyContentShift,
				getListItemArea: (x: number | string) => {
					const area = layout.getListItemArea(x);
					if (direction === 'vertical') {
						const shiftedArea = {
							...area,
							y1: area.y1 + justifyContentShift,
							y2: area.y2 + justifyContentShift,
						};
						return shiftedArea;
					}
					const shiftedArea = {
						...area,
						x1: area.x1 + justifyContentShift,
						x2: area.x2 + justifyContentShift,
					};
					return shiftedArea;
				},
			};
		},
		[
			itemMarginAfter,
			itemMarginBefore,
			justifyContent,
			width,
			height,
			direction,
		]
	);

	if (transitionType === 'update') {
		const from = getTransitionStateData(fromProp);
		const to = getTransitionStateData(toProp);
		const transitionTypes = getTransitionTypes({
			allFrom: from.items.map((it) => it.id),
			allTo: to.items.map((it) => it.id),
			visibleFrom: from.visibleItems.map((it) => it.id),
			visibleTo: to.visibleItems.map((it) => it.id),
		});

		return {
			transitionType,
			...common,
			from,
			to,
			transitionTypes,
		};
	}

	if (transitionType === 'enter') {
		const to = getTransitionStateData(toProp);

		return {
			transitionType,
			...common,
			to,
		};
	}

	invariant(transitionType === 'exit');

	const from = getTransitionStateData(fromProp);

	return {
		transitionType,
		...common,
		from,
	};
}

export function getListItems_Enter<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	const {transitionTypes, easingPercentage} = context;

	const areaProperties = transitionTypes.enter.map((id) => {
		const areaTo = context.to.getListItemArea(id);

		const currentOpacity = interpolate(easingPercentage, [0, 1], [0, 1]);

		const itemTo = context.to.items.find((it) => it.id === id);
		invariant(itemTo);

		return {
			id,
			area: areaTo,
			opacity: currentOpacity,
			item: itemTo,
		};
	});

	return areaProperties;
}

export function getListItems_Exit<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	const {transitionTypes, easingPercentage} = context;

	return transitionTypes.exit.map((id) => {
		const areaFrom = context.from.getListItemArea(id);
		const currentOpacity = interpolate(easingPercentage, [0, 1], [1, 0]);
		const item = context.from.items.find((it) => it.id === id);
		invariant(item);

		return {id, area: areaFrom, item, opacity: currentOpacity};
	});
}

export function getListItems_Appear<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return getListItems_FromTo(context, 'appear');
}

export function getListItems_Disappear<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return getListItems_FromTo(context, 'disappear');
}

export function getListItems_Update<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return getListItems_FromTo(context, 'update');
}

function getListItems_FromTo<T extends {id: string}>(
	context: ListTransitionContext_Update<T>,
	updateType: 'appear' | 'disappear' | 'update'
) {
	const {transitionTypes, easingPercentage} = context;

	const ids =
		updateType === 'appear'
			? transitionTypes.appear
			: updateType === 'disappear'
			? transitionTypes.disappear
			: transitionTypes.update;

	const opacityRange =
		updateType === 'appear'
			? [0, 1]
			: updateType === 'disappear'
			? [1, 0]
			: [1, 1];

	return ids.map((id) => {
		const areaFrom = context.from.getListItemArea(id);
		const areaTo = context.to.getListItemArea(id);

		const itemFrom = context.from.items.find((it) => it.id === id);
		const itemTo = context.to.items.find((it) => it.id === id);
		invariant(itemFrom);
		invariant(itemTo);

		const currentOpacity = interpolate(easingPercentage, [0, 1], opacityRange);

		const current_y1 = interpolate(
			easingPercentage,
			[0, 1],
			[areaFrom.y1, areaTo.y1]
		);

		const current_y2 = interpolate(
			easingPercentage,
			[0, 1],
			[areaFrom.y2, areaTo.y2]
		);

		const current_x1 = interpolate(
			easingPercentage,
			[0, 1],
			[areaFrom.x1, areaTo.x1]
		);

		const current_x2 = interpolate(
			easingPercentage,
			[0, 1],
			[areaFrom.x2, areaTo.x2]
		);

		const currentArea = {
			y1: current_y1,
			y2: current_y2,
			x1: current_x1,
			x2: current_x2,
			width: current_x2 - current_x1,
			height: current_y2 - current_y1,
		};

		return {id, area: currentArea, opacity: currentOpacity, itemFrom, itemTo};
	});
}

/**
 * Returns a subset of items based on the visibleIndices range.
 * @param items - Array of Item objects.
 * @param visibleIndices - A tuple [start, end] representing the inclusive start and exclusive end indices.
 * @returns A subarray of items within the specified visible range.
 */
export function getVisibleItems<T extends {id: string}>(
	items: T[],
	visibleIndices: [number, number]
): T[] {
	const [start, end] = visibleIndices;

	// If the items list is empty, return an empty array, without caring of validation of visibleIndices
	if (items.length === 0) {
		return [];
	}

	// Validate indices: must be integers
	if (!Number.isInteger(start) || !Number.isInteger(end)) {
		throw new Error('Indices must be integers.');
	}

	// Validate that start < end in the original visibleIndices
	if (start >= end) {
		throw new Error('Invalid indices: start must be less than end.');
	}

	// Normalize indices to stay within bounds
	const normalizedStart = Math.max(0, start);
	const normalizedEnd = Math.min(items.length, end);

	// If the normalized range is invalid, return an empty array
	if (normalizedStart >= normalizedEnd) {
		return [];
	}

	// Return the subarray based on normalized indices
	return items.slice(normalizedStart, normalizedEnd);
}
// Example usage
// const items: { id: string }[] = [
//   { id: "001" },
//   { id: "002" },
//   { id: "003" },
//   { id: "004" },
//   { id: "005" }
// ];
// console.log(getVisibleItems(items, [0, 1])); // [{ id: "001" }]
// console.log(getVisibleItems(items, [1, 3])); // [{ id: "002" }, { id: "003" }]
// console.log(getVisibleItems(items, [3, 100])); // [{ id: "004" }, { id: "005" }]
// console.log(getVisibleItems([], [0, 0]));    // []
// console.log(getVisibleItems([], [0, 1]));    // []
// console.log(getVisibleItems(items, [100, 200])); // []
// Invalid cases
// console.log(getVisibleItems(items, [2, 2])); // Throws Error: Invalid indices: start must be less than end.
// console.log(getVisibleItems(items, [5, 3])); // Throws Error: Invalid indices: start must be less than end.

// /**
//  * Returns a subset of items based on the visibleIndices range.
//  * @param items - Array of Item objects.
//  * @param visibleIndices - A tuple [start, end] representing the inclusive start and exclusive end indices.
//  * @returns A subarray of items within the specified visible range.
//  */
// function getVisibleItems<T extends {id: string}>(
// 	items: T[],
// 	visibleIndices: [number, number]
// ): T[] {
// 	const [start, end] = visibleIndices;

// 	// Validate indices: must be integers and within the array bounds
// 	if (!Number.isInteger(start) || !Number.isInteger(end)) {
// 		throw new Error('Indices must be integers.');
// 	}

// 	if (start < 0 || end > items.length || start >= end) {
// 		throw new Error(
// 			'Invalid indices: ensure 0 <= start < end <= items.length.'
// 		);
// 	}

// 	// Return the subarray based on visible indices
// 	return items.slice(start, end);
// }
// // Example usage
// const items: Item[] = [
//   { id: "001" },
//   { id: "002" },
//   { id: "003" },
//   { id: "004" },
//   { id: "005" }
// ];
// console.log(getVisibleItems(items, [0, 1])); // [{ id: "001" }]
// console.log(getVisibleItems(items, [1, 3])); // [{ id: "002" }, { id: "003" }]
// console.log(getVisibleItems(items, [3, 5])); // [{ id: "004" }, { id: "005" }]

export function getTransitionTypes({
	allFrom,
	visibleFrom,
	allTo,
	visibleTo,
}: {
	allFrom: string[];
	visibleFrom: string[];
	allTo: string[];
	visibleTo: string[];
}): {
	enter: string[];
	exit: string[];
	update: string[];
	appear: string[];
	disappear: string[];
} {
	const update = getIntersection(visibleFrom, visibleTo);
	const appear = getAppearingIds({visibleFrom, visibleTo, allFrom});
	const disappear = getDisappearingIds({visibleFrom, visibleTo, allTo});
	const exit = getExitingIds({visibleFrom, allTo});
	const enter = getEnteringIds({visibleTo, allFrom});

	return {enter, update, exit, appear, disappear};
}

/**
 * Returns the intersection of two arrays of strings.
 * @param array1 - The first array of strings.
 * @param array2 - The second array of strings.
 * @returns An array containing the intersection of the two input arrays.
 */
function getIntersection(array1: string[], array2: string[]): string[] {
	const set1 = new Set(array1);
	const set2 = new Set(array2);

	return Array.from(set1).filter((item) => set2.has(item));
}
// // Example usage
// const array1 = ["001", "002", "003", "004"];
// const array2 = ["003", "004", "005", "006"];
// console.log(getIntersection(array1, array2)); // ["003", "004"]

/**
 * Returns all strings that are present in both `allFrom` and `visibleTo`, but not in `visibleFrom`.
 * @param data - Object containing `allFrom`, `visibleTo`, and `visibleFrom` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getAppearingIds(data: {
	visibleFrom: string[];
	allFrom: string[];
	visibleTo: string[];
}): string[] {
	const {allFrom, visibleTo, visibleFrom} = data;

	const setAllFrom = new Set(allFrom);
	const setVisibleTo = new Set(visibleTo);
	const setVisibleFrom = new Set(visibleFrom);

	// Find elements present in both allFrom and visibleTo
	const intersection = Array.from(setAllFrom).filter((item) =>
		setVisibleTo.has(item)
	);

	// Exclude elements present in visibleFrom
	return intersection.filter((item) => !setVisibleFrom.has(item));
}

// // Example usage
// const input = {
// 	allFrom: ['001', '002', '003', '004'],
// 	visibleTo: ['003', '004', '005'],
// 	visibleFrom: ['003'],
// 	// visibleTo: ['003', '004', '005'],
// 	// allTo: ['003'],
// };
// console.log(getAppearingIds(input)); // ["004"]

/**
 * Returns all strings that are present in both `visibleFrom` and `allTo`, but not in `visibleTo`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getDisappearingIds(data: {
	visibleFrom: string[];
	visibleTo: string[];
	allTo: string[];
}): string[] {
	const {visibleFrom, visibleTo, allTo} = data;

	const setVisibleFrom = new Set(visibleFrom);
	const setAllTo = new Set(allTo);
	const setVisibleTo = new Set(visibleTo);

	// Find elements present in both visibleFrom and allTo
	const intersection = Array.from(setVisibleFrom).filter((item) =>
		setAllTo.has(item)
	);

	// Exclude elements present in visibleTo
	return intersection.filter((item) => !setVisibleTo.has(item));
}
// // Example usage
// const input = {
// 	allFrom: ['001', '002', '003', '004'],
// 	visibleTo: ['003', '004', '005'],
// 	visibleFrom: ['002', '003'],
// 	allTo: ['002', '003', '005'],
// };
// console.log(getDisappearingIds(input)); // ["002"]

/**
 * Returns all strings that are present in `visibleFrom` but not in `allTo`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getExitingIds(data: {
	visibleFrom: string[];
	allTo: string[];
}): string[] {
	const {visibleFrom, allTo} = data;

	const setVisibleFrom = new Set(visibleFrom);
	const setAllTo = new Set(allTo);

	// Find elements present in visibleFrom but not in allTo
	return Array.from(setVisibleFrom).filter((item) => !setAllTo.has(item));
}
// // Example usage
// const input = {
//   allFrom: ["001", "002", "003", "004"],
//   visibleTo: ["003", "004", "005"],
//   visibleFrom: ["002", "003", "004"],
//   allTo: ["003", "005"]
// };
// console.log(getExitingIds(input)); // ["002", "004"]

/**
 * Returns all strings that are present in `visibleTo` but not in `allFrom`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getEnteringIds(data: {
	visibleTo: string[];
	allFrom: string[];
}): string[] {
	const {visibleTo, allFrom} = data;

	const setVisibleTo = new Set(visibleTo);
	const setAllFrom = new Set(allFrom);

	// Find elements present in visibleTo but not in allFrom
	return Array.from(setVisibleTo).filter((item) => !setAllFrom.has(item));
}
// // Example usage
// const input = {
//   allFrom: ["001", "002", "003"],
//   visibleTo: ["003", "004", "005"],
//   visibleFrom: ["002", "003", "004"],
//   allTo: ["003", "005"]
// };
// console.log(getEnteringIds(input)); // ["004", "005"]
