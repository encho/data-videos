import {
	Sequence,
	useVideoConfig,
	useCurrentFrame,
	// spring
} from 'remotion';

import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import generateBrownianMotionTimeSeries from './generateBrownianMotionTimeSeries';
import {AxisTransition2} from './AxisTransition2';
import {getFirstNItems} from './utils';

function generateRange(
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
function getAdjacentPairs(arr: number[]): number[][] {
	const pairs: number[][] = [];
	for (let i = 0; i < arr.length - 1; i++) {
		pairs.push([arr[i], arr[i + 1]]);
	}
	return pairs;
}

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2030, 0, 20)
);

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
}) => {
	const currentFrame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const tsLengths = generateRange(100, 2000, 100);
	const tsLengthPairs = getAdjacentPairs(tsLengths);
	const numberOfTransitions = tsLengthPairs.length;
	const transitionDuration = Math.floor(durationInFrames / numberOfTransitions);

	console.log({
		tsLengths,
		tsLengthPairs,
		numberOfTransitions,
		transitionDuration,
	});

	return (
		<div>
			{tsLengthPairs.map((lengthPair, i) => {
				const durationInFrames = transitionDuration;
				const from = 0 + i * durationInFrames;
				const tsStart = getFirstNItems(timeSeries, lengthPair[0]);
				const tsEnd = getFirstNItems(timeSeries, lengthPair[1]);
				// TODO: check if this is actually improving performance
				// if (currentFrame >= from && currentFrame < from + durationInFrames) {
				if (true) {
					return (
						<Sequence from={from} durationInFrames={durationInFrames}>
							<AxisTransition2
								backgroundColor={backgroundColor}
								textColor={textColor}
								startTimeSeries={tsStart}
								endTimeSeries={tsEnd}
							/>
						</Sequence>
					);
				}
				return <div />;
			})}
		</div>
	);
};
