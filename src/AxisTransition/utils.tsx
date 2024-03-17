// import {AbsoluteFill, Easing, interpolate} from 'remotion';
// import {z} from 'zod';
// import {zColor} from '@remotion/zod-types';
// // import {max, min} from 'd3-array';
// import {
// 	useCurrentFrame,
// 	useVideoConfig,
// 	// spring
// } from 'remotion';
// import {
// 	// scaleLinear,
// 	scaleTime,
// } from 'd3-scale';
// import invariant from 'tiny-invariant';
// import generateBrownianMotionTimeSeries from './generateBrownianMotionTimeSeries';
// import {getTimeSeriesDateSpan} from './getTimeSeriesDateSpan';

import {format} from 'date-fns';

// *********************************************************
// FORMATTERS
// *********************************************************
export function formatDate(date: Date): string {
	return format(date, 'dd/MM/yy');
}

export function formatToPercentage(number: number): string {
	// Convert the number to percentage with two decimal places
	const percentage = (number * 100).toFixed(2);
	return `${percentage}%`;
}

// *********************************************************
// ANIMATION UTILS
// *********************************************************
export function findItemById<T extends {id: string}>(
	items: T[],
	id: string
): T | undefined {
	const item = items.find((item) => item.id === id);
	// TODO use invariant here!
	// invariant(item);
	return item;
}

export function getEnterUpdateExits(
	arr1: string[],
	arr2: string[]
): {enter: string[]; update: string[]; exit: string[]} {
	const enter: string[] = [];
	const update: string[] = [];
	const exit: string[] = [];

	// Find ids present only in the second array (enter)
	for (const id of arr2) {
		if (!arr1.includes(id)) {
			enter.push(id);
		} else {
			update.push(id);
		}
	}

	// Find ids present only in the first array (exit)
	for (const id of arr1) {
		if (!arr2.includes(id)) {
			exit.push(id);
		}
	}

	return {enter, update, exit};
}
