import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {max, min} from 'd3-array';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {scaleLinear, scaleTime} from 'd3-scale';
import invariant from 'tiny-invariant';

type TickSpec = {
	id: string;
	value: Date;
};

type AxisSpec = {
	domain: [Date, Date];
	range: [number, number];
	ticks: TickSpec[];
	// labels: LabelsSpec[];
};

const axisStart: AxisSpec = {
	domain: [new Date(2019, 10, 20), new Date(2022, 10, 5)],
	range: [100, 1080 - 100],
	ticks: [
		{id: '01-01-2020', value: new Date(2020, 0, 1)},
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
	],
	// labels:
};

const axisEnd: AxisSpec = {
	domain: [new Date(2020, 10, 20), new Date(2023, 10, 5)],
	range: [100, 1080 - 100],
	ticks: [
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
		{id: '01-02-2022', value: new Date(2022, 1, 1)},
		{id: '01-10-2022', value: new Date(2022, 9, 1)},
	],
	// labels:
};

function getEnterUpdateExits(
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

interface Item {
	id: string;
	// other fields...
}

// function findItemById(items: Item[], id: string): Item | undefined {
// 	return items.find((item) => item.id === id);
// }

function findItemById<T extends {id: string}>(
	items: T[],
	id: string
): T | undefined {
	return items.find((item) => item.id === id);
}

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	// TODO perhaps part of AxisSpec?
	const xScaleStart = scaleTime()
		.domain(axisStart.domain)
		.range(axisStart.range);
	const xScaleEnd = scaleTime().domain(axisEnd.domain).range(axisEnd.range);

	const axisStart_lineX1 = xScaleStart(axisStart.domain[0]);
	const axisStart_lineX2 = xScaleStart(axisStart.domain[1]);

	const axisEnd_lineX1 = xScaleEnd(axisEnd.domain[0]);
	const axisEnd_lineX2 = xScaleEnd(axisEnd.domain[1]);

	// console.log({axisStart_lineX1, axisStart_lineX2});

	const ticksEnterUpdateExits = getEnterUpdateExits(
		axisStart.ticks.map((it) => it.id),
		axisEnd.ticks.map((it) => it.id)
	);

	console.log({ticksEnterUpdateExits});

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = findItemById(axisStart.ticks, tickId);
		const endTick = findItemById(axisEnd.ticks, tickId);
		invariant(startTick);
		invariant(endTick);
		console.log({startTick, endTick});

		const startX = xScaleStart(startTick.value);
		const endX = xScaleEnd(endTick.value);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: tickId, mappedValue: currentX};
	});

	console.log(updateTicks);

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<h1 style={{color: textColor, fontSize: 50}}>hello axis transition</h1>
			<h1 style={{color: textColor, fontSize: 50}}>{animationPercentage}</h1>

			<svg width={1080} height={500} style={{backgroundColor: 'green'}}>
				{/* startAxis: x axis line */}
				<g>
					<line
						x1={axisStart_lineX1}
						x2={axisStart_lineX2}
						y1={100}
						y2={100}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* endAxis: x axis line */}
				<g>
					<line
						x1={axisEnd_lineX1}
						x2={axisEnd_lineX2}
						y1={300}
						y2={300}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* update ticks  */}
				{updateTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={400}
								y2={420}
								stroke={'orange'}
								strokeWidth={4}
							/>
						</g>
					);
				})}

				{/* axis start: x ticks */}
				{axisStart.ticks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={xScaleStart(it.value)}
								x2={xScaleStart(it.value)}
								y1={100}
								y2={120}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}

				{/* axis end: x ticks */}
				{axisEnd.ticks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={xScaleEnd(it.value)}
								x2={xScaleEnd(it.value)}
								y1={300}
								y2={320}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
