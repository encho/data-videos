import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {max, min} from 'd3-array';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {scaleLinear, scaleTime} from 'd3-scale';
import invariant from 'tiny-invariant';

function formatToPercentage(number: number): string {
	// Convert the number to percentage with two decimal places
	const percentage = (number * 100).toFixed(2);

	// Append '%' symbol
	return `${percentage}%`;
}

type TickSpec = {
	id: string;
	value: Date;
};

type LabelSpec = {
	id: string;
	value: Date;
	label: string;
};

type AxisSpec = {
	domain: [Date, Date];
	range: [number, number];
	ticks: TickSpec[];
	labels: LabelSpec[];
};

const axisStart: AxisSpec = {
	domain: [new Date(2019, 10, 20), new Date(2022, 10, 5)],
	range: [100, 1080 - 100],
	ticks: [
		{id: '01-01-2020', value: new Date(2020, 0, 1)},
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
	],
	labels: [
		{id: '01-01-2020_label', value: new Date(2020, 0, 1), label: '01/01/20'},
		{id: '01-02-2021_label', value: new Date(2021, 1, 1), label: '01/02/21'},
	],
	// labels:
};

const axisEnd: AxisSpec = {
	domain: [new Date(2020, 10, 20), new Date(2023, 10, 5)],
	range: [300, 1080 - 300],
	ticks: [
		{id: '01-02-2021', value: new Date(2021, 1, 1)},
		{id: '01-02-2022', value: new Date(2022, 1, 1)},
		{id: '01-10-2022', value: new Date(2022, 9, 1)},
	],
	labels: [
		{id: '01-02-2021_label', value: new Date(2021, 1, 1), label: '01/02/21'},
		{id: '01-02-2022_label', value: new Date(2022, 1, 1), label: '01/02/22'},
		{id: '01-10-2022_label', value: new Date(2022, 9, 1), label: '01/10/22'},
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

	const labelsEnterUpdateExits = getEnterUpdateExits(
		axisStart.labels.map((it) => it.id),
		axisEnd.labels.map((it) => it.id)
	);

	// console.log({ticksEnterUpdateExits});

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = findItemById(axisStart.ticks, tickId);
		const endTick = findItemById(axisEnd.ticks, tickId);
		invariant(startTick);
		invariant(endTick);

		const startX = xScaleStart(startTick.value);
		const endX = xScaleEnd(endTick.value);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: tickId, mappedValue: currentX};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = findItemById(axisStart.labels, labelId);
		const endLabel = findItemById(axisEnd.labels, labelId);
		invariant(startLabel);
		invariant(endLabel);

		const startX = xScaleStart(startLabel.value);
		const endX = xScaleEnd(endLabel.value);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: labelId, mappedValue: currentX, label: startLabel.label};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = findItemById(axisStart.ticks, tickId);
		invariant(startTick);

		const startX = xScaleStart(startTick.value);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[1, 0],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			mappedValue: startX,
			opacity: interpolatedOpacity,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = findItemById(axisStart.labels, labelId);
		invariant(startLabel);

		const startX = xScaleStart(startLabel.value);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[1, 0],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: labelId,
			mappedValue: startX,
			opacity: interpolatedOpacity,
			label: startLabel.label,
		};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = findItemById(axisEnd.ticks, tickId);
		invariant(endTick);

		const startX = xScaleStart(endTick.value);
		const endX = xScaleEnd(endTick.value);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				easing: Easing.linear,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			mappedValue: interpolatedX,
			opacity: interpolatedOpacity,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = findItemById(axisEnd.labels, labelId);
		invariant(endLabel);

		const startX = xScaleStart(endLabel.value);
		const endX = xScaleEnd(endLabel.value);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				easing: Easing.linear,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: labelId,
			mappedValue: interpolatedX,
			opacity: interpolatedOpacity,
			label: endLabel.label,
		};
	});

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<h1 style={{color: textColor, fontSize: 50}}>
				Transitioning between 2 Time Axes
			</h1>
			<h1 style={{color: textColor, fontSize: 30}}>
				Animation Percentage: {formatToPercentage(animationPercentage)}
			</h1>

			<svg width={1080} height={220} style={{backgroundColor: '#222222'}}>
				{/* startAxis: x axis line */}
				<g>
					<line
						x1={axisStart_lineX1}
						x2={axisStart_lineX2}
						y1={50}
						y2={50}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* endAxis: x axis line */}
				<g>
					<line
						x1={axisEnd_lineX1}
						x2={axisEnd_lineX2}
						y1={150}
						y2={150}
						stroke={textColor}
						strokeWidth={4}
					/>
				</g>

				{/* axis start: x ticks */}
				{axisStart.ticks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={xScaleStart(it.value)}
								x2={xScaleStart(it.value)}
								y1={50}
								y2={70}
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
								y1={150}
								y2={170}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}
			</svg>

			<h1 style={{color: textColor, fontSize: 30}}>Update Ticks & Labels</h1>
			<svg width={1080} height={100} style={{backgroundColor: '#222222'}}>
				{/* update ticks  */}
				{updateTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={'#0099cc'}
								strokeWidth={4}
							/>
						</g>
					);
				})}
				{/* update labels  */}
				{updateLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={'#0099cc'}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
							>
								{it.label}
							</text>
						</g>
					);
				})}
			</svg>

			<h1 style={{color: textColor, fontSize: 30}}>Exit Ticks</h1>
			<svg width={1080} height={100} style={{backgroundColor: '#222222'}}>
				{/* exit ticks  */}
				{exitTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={'red'}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}
				{/* exit labels  */}
				{exitLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={'red'}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
								opacity={it.opacity}
							>
								{it.label}
							</text>
						</g>
					);
				})}
			</svg>

			<h1 style={{color: textColor, fontSize: 30}}>Enter Ticks</h1>
			<svg width={1080} height={100} style={{backgroundColor: '#222222'}}>
				{/* enter ticks  */}
				{enterTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={'green'}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}
				{/* enter labels  */}
				{enterLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={'green'}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
								opacity={it.opacity}
							>
								{it.label}
							</text>
						</g>
					);
				})}
			</svg>

			<h1 style={{color: textColor, fontSize: 30}}>ALL Ticks</h1>
			<svg width={1080} height={100} style={{backgroundColor: '#222222'}}>
				{/* enter ticks  */}
				{enterTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={textColor}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}
				{/* enter labels  */}
				{enterLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={textColor}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
								opacity={it.opacity}
							>
								{it.label}
							</text>
						</g>
					);
				})}

				{/* update ticks  */}
				{updateTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={textColor}
								strokeWidth={4}
							/>
						</g>
					);
				})}
				{/* update labels  */}
				{updateLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={textColor}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
							>
								{it.label}
							</text>
						</g>
					);
				})}

				{/* exit ticks  */}
				{exitTicks.map((it, i) => {
					return (
						<g key={i}>
							<line
								x1={it.mappedValue}
								x2={it.mappedValue}
								y1={40}
								y2={60}
								stroke={textColor}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}
				{/* exit labels  */}
				{exitLabels.map((it, i) => {
					return (
						<g key={i}>
							<text
								textAnchor="middle"
								alignmentBaseline="baseline"
								fill={textColor}
								// fontFamily={fontFamilyXTicklabels}
								// fontSize={styling.xTickValuesFontSize}
								fontSize={16}
								x={it.mappedValue}
								y={80}
								opacity={it.opacity}
							>
								{it.label}
							</text>
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
