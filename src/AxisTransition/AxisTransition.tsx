import {
	Sequence,
	useVideoConfig,
	AbsoluteFill,
	// useCurrentFrame,
	// spring
} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {
	DisplayGridLayout,
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './generateBrownianMotionTimeSeries';
import {AxisTransition2} from './AxisTransition2';
import {getFirstNItems} from './utils';
import {LineChart} from './LineChart';

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
	// const currentFrame = useCurrentFrame();
	const {durationInFrames, height, width} = useVideoConfig();

	// TODO consider adding major and minor ticks
	const TICK_SIZE = 16;
	const TICK_LABEL_MARGIN = 6;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 20, name: 'space'},
		{type: 'pixel', value: 100, name: 'xAxis'},
	];
	const chartColsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 20, name: 'space'},
		{type: 'pixel', value: 100, name: 'yAxis'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			xAxis: [
				{name: 'xAxis'},
				{name: 'plot'},
				{name: 'xAxis'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			yAxis: [
				{name: 'plot'},
				{name: 'yAxis'},
				{name: 'plot'},
				{name: 'yAxis'},
			] as TGridLayoutAreaSpec,
			plot: [
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
		},
	};

	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: chartGridLayoutSpec,
	});

	const xAxisArea = chartLayout.areas['xAxis'];

	const tsLengths = generateRange(100, 2000, 200);
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
		<AbsoluteFill style={{backgroundColor}}>
			<DisplayGridLayout
				hide={false}
				areas={chartLayout.areas}
				width={width}
				height={height}
			/>

			{/* the chart line */}
			<LineChart area={chartLayout.areas.plot} />

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
							<Sequence
								from={from}
								durationInFrames={durationInFrames}
								layout="none"
							>
								<AxisTransition2
									backgroundColor={backgroundColor}
									textColor={textColor}
									startTimeSeries={tsStart}
									endTimeSeries={tsEnd}
									top={700}
									left={0}
									area={xAxisArea}
									tickSize={TICK_SIZE}
									tickLabelMargin={TICK_LABEL_MARGIN}
								/>
							</Sequence>
						);
					}
					return <div />;
				})}
			</div>
		</AbsoluteFill>
	);
};
