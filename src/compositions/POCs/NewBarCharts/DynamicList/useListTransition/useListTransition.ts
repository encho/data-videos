import {interpolate, Easing, EasingFunction} from 'remotion';
import invariant from 'tiny-invariant';
import {useCallback} from 'react';

import {TGridLayoutArea} from '../../../../../acetti-layout';
import {getListLayout, TListLayout} from './getListLayout';

type ListTransitionContext_Common = {
	frame: number;
	durationInFrames: number;
	width: number;
	easingPercentage: number;
};

export type ListTransitionContext_Enter<T> = ListTransitionContext_Common & {
	transitionType: 'enter';
	to: {
		items: T[];
		itemHeight: number;
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
};

export type ListTransitionContext_Exit<T> = ListTransitionContext_Common & {
	transitionType: 'exit';
	from: {
		items: T[];
		itemHeight: number;
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
};

export type ListTransitionContext_Update<T> = ListTransitionContext_Common & {
	transitionType: 'update';
	from: {
		items: T[];
		itemHeight: number;
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
	to: {
		items: T[];
		itemHeight: number;
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
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
	width,
	height,
	itemMarginTop = 0,
	itemMarginBottom = 0,
	itemHeightFrom,
	itemHeightTo,
	itemsFrom,
	itemsTo,
	visibleIndicesFrom,
	visibleIndicesTo,
	justifyContent = 'center',
	frame,
	durationInFrames,
	easing = Easing.linear,
}: {
	width: number;
	height: number;
	itemHeightFrom: number;
	itemHeightTo: number;
	itemMarginTop?: number; // TODO not optional
	itemMarginBottom?: number; // TODO not optional
	// TODO:
	// itemSizes: {
	// 	height?: number;
	// 	marginTop?: number;
	// 	marginBottom?: number;
	// };
	// TODO
	// from: {
	// 	items: T[];
	// 	visibleIndices: [number, number];
	// };
	// to: {
	// 	items: T[];
	// 	visibleIndices: [number, number];
	// };
	itemsFrom: T[];
	itemsTo: T[];
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	justifyContent?: 'center' | 'start';
	frame: number;
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
		frame,
		durationInFrames,
		easingPercentage,
		// transitionTypes, // in update instead
		// itemHeight,
		width,
	};

	const isEnterTransition = itemsFrom.length === 0;
	const isExitTransition = itemsTo.length === 0;

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
			itemHeight: itemHeightArg,
		}: {
			items: T[];
			visibleIndices: [number, number];
			itemHeight: number;
		}) => {
			const visibleItems = getVisibleItems<T>(items, visibleIndices);

			// TODO pass height to useListTransition, because it may be that if we use
			// fixed itemHeights,  we need that info to center all the items (justifyContent)
			// const height = itemHeightArg * visibleItems.length;

			const layout = getListLayout({
				width,
				height,
				items,
				itemHeight: itemHeightArg,
				itemMarginTop,
				itemMarginBottom,
			});

			const visibleIndicesRange = layout.getVisibleIndicesRange(visibleIndices);

			const visibleIndicesRangeSize =
				visibleIndicesRange[1] - visibleIndicesRange[0];

			// justify content
			const yStart =
				justifyContent === 'center'
					? (height - visibleIndicesRangeSize) / 2
					: 0;

			const yStartUnadjusted = layout.getListItemPaddedArea(
				visibleItems[0].id
			).y1;

			const justifyContentShift = yStart - yStartUnadjusted;

			return {
				items,
				itemHeight: itemHeightArg,
				visibleIndices,
				visibleItems,
				layout,
				visibleIndicesRange,
				visibleIndicesRangeSize,
				justifyContentShift,
				getListItemArea: (x: number | string) => {
					const area = layout.getListItemArea(x);
					const shiftedArea = {
						...area,
						y1: area.y1 + justifyContentShift,
						y2: area.y2 + justifyContentShift,
					};
					return shiftedArea;
				},
			};
		},
		[itemMarginBottom, itemMarginTop, justifyContent, width, height]
	);

	if (transitionType === 'update') {
		const from = getTransitionStateData({
			items: itemsFrom,
			visibleIndices: visibleIndicesFrom,
			itemHeight: itemHeightFrom,
		});
		const to = getTransitionStateData({
			items: itemsTo,
			visibleIndices: visibleIndicesTo,
			itemHeight: itemHeightTo,
		});
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
		const to = getTransitionStateData({
			items: itemsTo,
			visibleIndices: visibleIndicesTo,
			itemHeight: itemHeightTo,
		});

		return {
			transitionType,
			...common,
			to,
		};
	}

	invariant(transitionType === 'exit');

	const from = getTransitionStateData({
		items: itemsFrom,
		visibleIndices: visibleIndicesFrom,
		itemHeight: itemHeightFrom,
	});

	return {
		transitionType,
		...common,
		from,
	};
}

export function useEnterItems<T extends {id: string}>(
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

export function useExitItems<T extends {id: string}>(
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

export function useAppearItems<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return useUpdateTypeAreas(context, 'appear');
}

export function useDisappearItems<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return useUpdateTypeAreas(context, 'disappear');
}

export function useUpdateItems<T extends {id: string}>(
	context: ListTransitionContext_Update<T>
) {
	return useUpdateTypeAreas(context, 'update');
}

function useUpdateTypeAreas<T extends {id: string}>(
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
