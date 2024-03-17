import {
	Sequence,
	useVideoConfig,
	// useCurrentFrame,
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
	// const frame = useCurrentFrame();
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
				const tsStart = getFirstNItems(timeSeries, lengthPair[0]);
				const tsEnd = getFirstNItems(timeSeries, lengthPair[1]);
				return (
					<Sequence
						from={0 + i * transitionDuration}
						durationInFrames={transitionDuration}
					>
						<AxisTransition2
							backgroundColor={backgroundColor}
							textColor={textColor}
							startTimeSeries={tsStart}
							endTimeSeries={tsEnd}
						/>
					</Sequence>
				);
			})}
		</div>
	);
};
