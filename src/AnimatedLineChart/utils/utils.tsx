import {format} from 'date-fns';
import {TimeSeries} from './timeSeries/generateBrownianMotionTimeSeries';

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

//TODO  TIMESERIES NAMESPACE
// *********************
export function getFirstNItems(timeSeries: TimeSeries, n: number): TimeSeries {
	return timeSeries.slice(0, n);
}

/**
 * Generates a range of numbers within a specified range with a given step size.
 *
 * @param startNumber The starting number of the range (inclusive).
 * @param endNumber The ending number of the range (inclusive).
 * @param step The step size between each number in the range.
 * @returns An array containing numbers within the specified range with the given step size.
 *
 * @example
 * // Example usage:
 * const startNumber = 10;
 * const endNumber = 30;
 * const step = 5;
 * const result = generateRange(startNumber, endNumber, step);
 * console.log(result); // Output: [10, 15, 20, 25, 30]
 *
 * @example
 * // Example usage with a negative step:
 * const startNumber = 20;
 * const endNumber = 0;
 * const step = -4;
 * const result = generateRange(startNumber, endNumber, step);
 * console.log(result); // Output: [20, 16, 12, 8, 4, 0]
 *
 * @example
 * // Example usage with a step larger than the range:
 * const startNumber = 1;
 * const endNumber = 10;
 * const step = 20;
 * const result = generateRange(startNumber, endNumber, step);
 * console.log(result); // Output: [1]
 *
 * @example
 * // Example usage with a single number range:
 * const startNumber = 5;
 * const endNumber = 5;
 * const step = 1;
 * const result = generateRange(startNumber, endNumber, step);
 * console.log(result); // Output: [5]
 */
export function generateRange(
	startNumber: number,
	endNumber: number,
	step: number
): number[] {
	const result: number[] = [];
	for (let i = startNumber; i <= endNumber; i += step) {
		result.push(i);
	}
	return result;
}

/**
 * Generates pairs of adjacent elements from an array.
 *
 * @param arr An array of numbers.
 * @returns An array of pairs, each containing two adjacent elements from the input array.
 *
 * @example
 * // Example usage:
 * const inputArray = [10, 20, 30];
 * const result = getAdjacentPairs(inputArray);
 * console.log(result); // Output: [[10, 20], [20, 30]]
 *
 * @example
 * // Example usage with an empty array:
 * const emptyArray: number[] = [];
 * const result = getAdjacentPairs(emptyArray);
 * console.log(result); // Output: []
 */
export function getAdjacentPairs(arr: number[]): number[][] {
	const pairs: number[][] = [];
	for (let i = 0; i < arr.length - 1; i++) {
		pairs.push([arr[i], arr[i + 1]]);
	}
	return pairs;
}
