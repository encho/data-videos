import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import invariant from 'tiny-invariant';
import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {
	// formatToPercentage,
	findItemById,
	getEnterUpdateExits,
} from './utils';
import {TGridLayoutArea} from '../acetti-viz';
import {
	getLabelMappedValue,
	getTickMappedValue,
	// TAxisSpec,
	getTickValue,
	getLabelValue,
} from '../acetti-axis/axisSpec';
import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';
import {TAxisSpec} from '../acetti-axis/axisSpec';

const TICK_SIZE = 50;
const TICK_LABEL_MARGIN = 0;
const TEXT_COLOR = '#f05122';

const Transition_HorizontalDateAxis_Labels: React.FC<{
	from: TAxisSpec;
	to: TAxisSpec;
}> = ({from: startSpec, to: endSpec}) => {
	// TODO unnecessary?
	const frame = useCurrentFrame();
	// TODO unnecessary?
	const {durationInFrames} = useVideoConfig();

	// TODO get from prop
	const animationPercentage = frame / durationInFrames;

	// const TICK_SIZE = 50;
	// const TICK_LABEL_MARGIN = 0;
	// const TEXT_COLOR = '#f05122';

	const labelsEnterUpdateExits = getEnterUpdateExits(
		startSpec.labels.map((it) => it.id),
		endSpec.labels.map((it) => it.id)
	);

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = findItemById(endSpec.labels, labelId);
		invariant(endLabel);

		const endLabelValue = getLabelValue(endSpec, labelId);

		const startX = startSpec.scale(endLabelValue);
		const endX = getLabelMappedValue(endSpec, labelId);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
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

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = findItemById(startSpec.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(startSpec, labelId);
		const endX = getLabelMappedValue(endSpec, labelId);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: labelId, mappedValue: currentX, label: startLabel.label};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = findItemById(startSpec.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(startSpec, labelId);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 0.8],
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

	return (
		<g>
			{/* <rect width={100} height={100} fill="cyan" /> */}
			{/* enter labels  */}

			{enterLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={TEXT_COLOR}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={TICK_SIZE + TICK_LABEL_MARGIN}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* update labels  */}
			{updateLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={TEXT_COLOR}
							stroke={TEXT_COLOR}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={TICK_SIZE + TICK_LABEL_MARGIN}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* exit labels  */}
			{exitLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={TEXT_COLOR}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={TICK_SIZE + TICK_LABEL_MARGIN}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}
		</g>
	);
};

const Transition_HorizontalDateAxis_Ticks: React.FC<{
	from: TAxisSpec;
	to: TAxisSpec;
}> = ({from: startSpec, to: endSpec}) => {
	// TODO unnecessary?
	const frame = useCurrentFrame();
	// TODO unnecessary?
	const {durationInFrames} = useVideoConfig();

	// TODO get from prop
	const animationPercentage = frame / durationInFrames;

	// TODO get from prop
	const ticksEnterUpdateExits = getEnterUpdateExits(
		startSpec.ticks.map((it) => it.id),
		endSpec.ticks.map((it) => it.id)
	);

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startX = getTickMappedValue(startSpec, tickId);
		const endX = getTickMappedValue(endSpec, tickId);
		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;
		return {id: tickId, mappedValue: currentX};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = findItemById(endSpec.ticks, tickId);
		invariant(endTick);

		const startX = startSpec.scale(getTickValue(endSpec, tickId));
		const endX = getTickMappedValue(endSpec, tickId);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
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

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = findItemById(startSpec.ticks, tickId);
		invariant(startTick);

		const startX = startSpec.scale(startTick.value);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 0.8],
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

	// const TICK_SIZE = 80;
	// const TEXT_COLOR = '#f05122';

	return (
		<g>
			{/* enter ticks  */}
			{enterTicks.map((it, i) => {
				return (
					<g key={i}>
						<line
							x1={it.mappedValue}
							x2={it.mappedValue}
							y1={0}
							y2={TICK_SIZE / 2}
							stroke={TEXT_COLOR}
							strokeWidth={4}
							opacity={it.opacity}
						/>
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
							y1={0}
							y2={TICK_SIZE}
							stroke={TEXT_COLOR}
							strokeWidth={4}
						/>
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
							y1={0}
							y2={TICK_SIZE}
							stroke={TEXT_COLOR}
							strokeWidth={4}
							opacity={it.opacity}
						/>
					</g>
				);
			})}
		</g>
	);
};

export const AxisTransition2: React.FC<{
	startTimeSeries: TimeSeries;
	endTimeSeries: TimeSeries;
	backgroundColor: string;
	textColor: string;
	area: TGridLayoutArea;
	top?: number;
	left?: number;
	tickSize?: number;
	tickLabelMargin?: number;
}> = ({
	startTimeSeries,
	endTimeSeries,
	backgroundColor,
	textColor,
	area,
	tickSize = 10,
	tickLabelMargin = 0,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	const axisStart = getXAxisSpec(
		startTimeSeries.map((it) => it.date),
		area,
		'INTER_MONTHS'
	);
	const axisEnd = getXAxisSpec(
		endTimeSeries.map((it) => it.date),
		area,
		'INTER_MONTHS'
	);

	const axisStart_line_x1 = axisStart.scale(axisStart.domain[0]);
	const axisStart_line_x2 = axisStart.scale(axisStart.domain[1]);

	const axisEnd_line_x1 = axisEnd.scale(axisEnd.domain[0]);
	const axisEnd_line_x2 = axisEnd.scale(axisEnd.domain[1]);

	const aAxis_line_x1 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_line_x1, axisEnd_line_x1],
		{
			easing: Easing.bezier(0.25, 1, 0.5, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const aAxis_line_x2 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_line_x2, axisEnd_line_x2],
		{
			easing: Easing.bezier(0.25, 1, 0.5, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg overflow="visible" width={1080} height={100}>
					{/* startAxis: x axis line */}
					<g>
						<Transition_HorizontalDateAxis_Ticks
							from={axisStart}
							to={axisEnd}
						/>
						<Transition_HorizontalDateAxis_Labels
							from={axisStart}
							to={axisEnd}
						/>

						<line
							x1={aAxis_line_x1}
							x2={aAxis_line_x2}
							y1={0}
							y2={0}
							stroke={textColor}
							// TODO strokeWidth as variable
							strokeWidth={4}
						/>
					</g>

					{/* TODO implement! */}
					{/* <Transition_HorizontalDateAxis_Line
						startSpec={axisStart}
						endSpec={axisEnd}
					/> */}
				</svg>
			</div>
		</AbsoluteFill>
	);
};
