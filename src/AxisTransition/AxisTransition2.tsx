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
		area
	);
	const axisEnd = getXAxisSpec(
		endTimeSeries.map((it) => it.date),
		area
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

	const ticksEnterUpdateExits = getEnterUpdateExits(
		axisStart.ticks.map((it) => it.id),
		axisEnd.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		axisStart.labels.map((it) => it.id),
		axisEnd.labels.map((it) => it.id)
	);

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startX = getTickMappedValue(axisStart, tickId);
		const endX = getTickMappedValue(axisEnd, tickId);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: tickId, mappedValue: currentX};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = findItemById(axisStart.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(axisStart, labelId);
		const endX = getLabelMappedValue(axisEnd, labelId);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {id: labelId, mappedValue: currentX, label: startLabel.label};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = findItemById(axisStart.ticks, tickId);
		invariant(startTick);

		const startX = axisStart.scale(startTick.value);

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

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = findItemById(axisStart.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(axisStart, labelId);

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

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = findItemById(axisEnd.ticks, tickId);
		invariant(endTick);

		const startX = axisStart.scale(getTickValue(axisEnd, tickId));
		const endX = getTickMappedValue(axisEnd, tickId);

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

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = findItemById(axisEnd.labels, labelId);
		invariant(endLabel);

		const endLabelValue = getLabelValue(axisEnd, labelId);

		const startX = axisStart.scale(endLabelValue);
		const endX = getLabelMappedValue(axisEnd, labelId);

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

					{/* enter ticks  */}
					{enterTicks.map((it, i) => {
						return (
							<g key={i}>
								<line
									x1={it.mappedValue}
									x2={it.mappedValue}
									y1={0}
									y2={tickSize}
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
									alignmentBaseline="hanging"
									fill={textColor}
									// fontFamily={fontFamilyXTicklabels}
									// fontSize={styling.xTickValuesFontSize}
									fontSize={16}
									x={it.mappedValue}
									y={tickSize + tickLabelMargin}
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
									y1={0}
									y2={tickSize}
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
									alignmentBaseline="hanging"
									fill={textColor}
									stroke={textColor}
									// fontFamily={fontFamilyXTicklabels}
									// fontSize={styling.xTickValuesFontSize}
									fontSize={16}
									x={it.mappedValue}
									y={tickSize + tickLabelMargin}
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
									y1={0}
									y2={tickSize}
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
									alignmentBaseline="hanging"
									fill={textColor}
									// fontFamily={fontFamilyXTicklabels}
									// fontSize={styling.xTickValuesFontSize}
									fontSize={16}
									x={it.mappedValue}
									y={tickSize + tickLabelMargin}
									opacity={it.opacity}
								>
									{it.label}
								</text>
							</g>
						);
					})}
				</svg>
			</div>
		</AbsoluteFill>
	);
};
