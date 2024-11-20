import {interpolate, Easing, EasingFunction} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-layout';
import {TDynamicListLayout} from './useDynamicListLayout';
import {useDynamicListLayout} from './useDynamicListLayout';

// type ListTransitionContext_Enter<T> = {
// 	transitionType: 'enter';
// 	from: {
// 		items: T[];
// 		visibleIndices: [number, number];
// 		visibleItems: T[];
// 		layout: TDynamicListLayout;
// 		visibleIndicesRange: [number, number];
// 		visibleIndicesRangeSize: number;
// 		justifyContentShift: number;
// 		getListItemArea: (i: number | string) => TGridLayoutArea;
// 	};
// };

// type ListTransitionContext_Exit<T> = {
// 	transitionType: 'exit';
// 	to: {
// 		items: T[];
// 		visibleIndices: [number, number];
// 		visibleItems: T[];
// 		layout: TDynamicListLayout;
// 		visibleIndicesRange: [number, number];
// 		visibleIndicesRangeSize: number;
// 		justifyContentShift: number;
// 		getListItemArea: (i: number | string) => TGridLayoutArea;
// 	};
// };

// type ListTransitionContext_Update<T> = {
// 	transitionType: 'update';
// 	from: {
// 		items: T[];
// 		visibleIndices: [number, number];
// 		visibleItems: T[];
// 		layout: TDynamicListLayout;
// 		visibleIndicesRange: [number, number];
// 		visibleIndicesRangeSize: number;
// 		justifyContentShift: number;
// 		getListItemArea: (i: number | string) => TGridLayoutArea;
// 	};
// 	to: {
// 		items: T[];
// 		visibleIndices: [number, number];
// 		visibleItems: T[];
// 		layout: TDynamicListLayout;
// 		visibleIndicesRange: [number, number];
// 		visibleIndicesRangeSize: number;
// 		justifyContentShift: number;
// 		getListItemArea: (i: number | string) => TGridLayoutArea;
// 	};
// };

export type TDynamicListTransitionContext<T extends {id: string}> = {
	frame: number;
	durationInFrames: number;
	transitionTypes: {
		update: string[];
		enter: string[];
		exit: string[];
		appear: string[];
		disappear: string[];
	};
	itemHeight: number;
	width: number;
	easingPercentage: number;
	transitionType: 'enter' | 'update' | 'exit';
	from: {
		items: T[];
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TDynamicListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
	to: {
		items: T[];
		visibleIndices: [number, number];
		visibleItems: T[];
		layout: TDynamicListLayout;
		visibleIndicesRange: [number, number];
		visibleIndicesRangeSize: number;
		justifyContentShift: number;
		getListItemArea: (i: number | string) => TGridLayoutArea;
	};
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useDynamicListTransition<T extends {id: string}>({
	width,
	height,
	itemHeight = 100,
	itemMarginTop = 0,
	itemMarginBottom = 0,
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
	itemHeight?: number; // TODO not optional
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

	// ***********************************************************************
	// from
	// ***********************************************************************
	const visibleItemsFrom = getVisibleItems<T>(itemsFrom, visibleIndicesFrom);

	const layoutFrom = useDynamicListLayout({
		width,
		height,
		items: itemsFrom,
		itemHeight,
		itemMarginTop,
		itemMarginBottom,
	});

	const visibleIndicesRangeFrom =
		layoutFrom.getVisibleIndicesRange(visibleIndicesFrom);

	const visibleIndicesRangeSizeFrom =
		visibleIndicesRangeFrom[1] - visibleIndicesRangeFrom[0];

	// justify content
	const yStartFrom =
		justifyContent === 'center'
			? (height - visibleIndicesRangeSizeFrom) / 2
			: 0;

	const yStartUnadjustedFrom = layoutFrom.getListItemPaddedArea(
		visibleItemsFrom[0].id
	).y1;

	const justifyContentShiftFrom = yStartFrom - yStartUnadjustedFrom;

	// ***********************************************************************
	// to
	// ***********************************************************************
	const visibleItemsTo = getVisibleItems<T>(itemsTo, visibleIndicesTo);

	const layoutTo = useDynamicListLayout({
		width,
		height,
		items: itemsTo,
		itemHeight,
		itemMarginTop,
		itemMarginBottom,
	});

	const visibleIndicesRangeTo =
		layoutFrom.getVisibleIndicesRange(visibleIndicesTo);

	const visibleIndicesRangeSizeTo =
		visibleIndicesRangeTo[1] - visibleIndicesRangeTo[0];

	// justify content
	const yStartTo =
		justifyContent === 'center' ? (height - visibleIndicesRangeSizeTo) / 2 : 0;

	const yStartUnadjustedTo = layoutTo.getListItemPaddedArea(
		visibleItemsTo[0].id
	).y1;

	const justifyContentShiftTo = yStartTo - yStartUnadjustedTo;

	// ******** global, but after from & to determination

	const transitionTypes = getTransitionTypes({
		allFrom: itemsFrom.map((it) => it.id),
		allTo: itemsTo.map((it) => it.id),
		visibleFrom: visibleItemsFrom.map((it) => it.id),
		visibleTo: visibleItemsTo.map((it) => it.id),
	});

	return {
		transitionType,
		frame,
		durationInFrames,
		easingPercentage,
		transitionTypes,
		itemHeight,
		width,
		//
		from: {
			items: itemsFrom,
			visibleIndices: visibleIndicesFrom,
			visibleItems: visibleItemsFrom,
			layout: layoutFrom,
			visibleIndicesRange: visibleIndicesRangeFrom,
			visibleIndicesRangeSize: visibleIndicesRangeSizeFrom,
			justifyContentShift: justifyContentShiftFrom,
			// TODO could be auto generated via the above info
			getListItemArea: (x) => {
				const area = layoutFrom.getListItemArea(x);
				const shiftedArea = {
					...area,
					y1: area.y1 + justifyContentShiftFrom,
					y2: area.y2 + justifyContentShiftFrom,
				};
				return shiftedArea;
			},
		},
		to: {
			items: itemsTo,
			visibleIndices: visibleIndicesTo,
			visibleItems: visibleItemsTo,
			layout: layoutTo,
			visibleIndicesRange: visibleIndicesRangeTo,
			visibleIndicesRangeSize: visibleIndicesRangeSizeTo,
			justifyContentShift: justifyContentShiftTo,
			// TODO could be auto generated via the above info
			getListItemArea: (x) => {
				const area = layoutTo.getListItemArea(x);
				const shiftedArea = {
					...area,
					y1: area.y1 + justifyContentShiftTo,
					y2: area.y2 + justifyContentShiftTo,
				};
				return shiftedArea;
			},
		},
	};
}

export function useEnterAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>
) {
	const {transitionTypes, easingPercentage} = context;

	const areaProperties = transitionTypes.enter.map((id) => {
		const areaTo = context.to.getListItemArea(id);

		const currentOpacity = interpolate(easingPercentage, [0, 1], [0, 1]);

		const item = context.to.items.find((it) => it.id === id);
		invariant(item);

		return {
			id,
			area: areaTo,
			opacity: currentOpacity,
			item,
		};
	});

	return areaProperties;
}

export function useExitAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>
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

export function useAppearAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>
) {
	return useUpdateTypeAreas(context, 'appear');
}

export function useDisappearAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>
) {
	return useUpdateTypeAreas(context, 'disappear');
}

export function useUpdateAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>
) {
	return useUpdateTypeAreas(context, 'update');
}

function useUpdateTypeAreas<T extends {id: string}>(
	context: TDynamicListTransitionContext<T>,
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
function getVisibleItems<T extends {id: string}>(
	items: T[],
	visibleIndices: [number, number]
): T[] {
	const [start, end] = visibleIndices;

	// Validate indices: must be integers
	if (!Number.isInteger(start) || !Number.isInteger(end)) {
		throw new Error('Indices must be integers.');
	}

	// Validate that start < end in the original visibleIndices
	if (start >= end) {
		throw new Error('Invalid indices: start must be less than end.');
	}

	// If the items list is empty, return an empty array
	if (items.length === 0) {
		return [];
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
