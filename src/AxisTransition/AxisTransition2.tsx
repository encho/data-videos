import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {scaleTime} from 'd3-scale';
import invariant from 'tiny-invariant';
import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {getTimeSeriesDateSpan} from './getTimeSeriesDateSpan';
import {
	formatDate,
	// formatToPercentage,
	findItemById,
	getEnterUpdateExits,
} from './utils';
import {TGridLayoutArea} from '../acetti-viz';

type TickSpec = {
	id: string;
	value: Date;
};

type LabelSpec = {
	id: string;
	value: Date;
	label: string;
};

export type TAxisSpec = {
	domain: [Date, Date];
	range: [number, number];
	ticks: TickSpec[];
	labels: LabelSpec[];
};

// ****************************************************************

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
	// top = 0,
	// left = 0,
	tickSize = 10,
	tickLabelMargin = 0,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	// TODO possibly as props
	// const XAXIS_RANGE = [100, 1080 - 100] as [number, number];
	const XAXIS_RANGE = [area.x1, area.x2] as [number, number];

	const start_xAxis_domain = getTimeSeriesDateSpan(startTimeSeries);
	const start_xAxis_range = XAXIS_RANGE;
	const start_xAxis_xScale = scaleTime()
		.domain(start_xAxis_domain)
		.range(start_xAxis_range);
	// const start_xAxis_tickValues = start_xAxis_xScale.nice().ticks(4);
	const start_xAxis_tickValues = start_xAxis_xScale.ticks(4);
	const start_xAxis_ticks = start_xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		return {id, value: date};
	});
	const start_xAxis_labels = start_xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		const label = formatDate(date);
		return {id, label, value: date};
	});
	const axisStart: TAxisSpec = {
		domain: start_xAxis_domain,
		range: start_xAxis_range,
		ticks: start_xAxis_ticks,
		labels: start_xAxis_labels,
	};

	const end_xAxis_domain = getTimeSeriesDateSpan(endTimeSeries);
	const end_xAxis_range = XAXIS_RANGE;
	const end_xAxis_xScale = scaleTime()
		.domain(end_xAxis_domain)
		.range(end_xAxis_range);
	// const end_xAxis_tickValues = end_xAxis_xScale.nice().ticks(4);
	const end_xAxis_tickValues = end_xAxis_xScale.ticks(4);
	const end_xAxis_ticks = end_xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		return {id, value: date};
	});
	const end_xAxis_labels = end_xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		const label = formatDate(date);
		return {
			id,
			label,
			value: date,
			// textAnchor: TODO
			// TODO more text props 'center', etc...
		};
	});
	const axisEnd: TAxisSpec = {
		domain: end_xAxis_domain,
		range: end_xAxis_range,
		ticks: end_xAxis_ticks,
		labels: end_xAxis_labels,
	};

	// TODO inside 'real' AxisTransition2
	// TODO perhaps part of AxisSpec?
	const xScaleStart = scaleTime()
		.domain(axisStart.domain)
		.range(axisStart.range);

	const xScaleEnd = scaleTime().domain(axisEnd.domain).range(axisEnd.range);

	const axisStart_lineX1 = xScaleStart(axisStart.domain[0]);
	const axisStart_lineX2 = xScaleStart(axisStart.domain[1]);

	const axisEnd_lineX1 = xScaleEnd(axisEnd.domain[0]);
	const axisEnd_lineX2 = xScaleEnd(axisEnd.domain[1]);

	const aAxis_lineX1 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_lineX1, axisEnd_lineX1],
		{
			easing: Easing.bezier(0.25, 1, 0.5, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const aAxis_lineX2 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_lineX2, axisEnd_lineX2],
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

		const startX = xScaleStart(startLabel.value);

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
		const startX = xScaleStart(endTick.value);
		const endX = xScaleEnd(endTick.value);

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
		<AbsoluteFill
		// style={{backgroundColor}}
		>
			{/* <div
				style={{
					position: 'absolute',
					top: 250,
					left: 250,
					backgroundColor: 'green',
				}}
			>
				<h1 style={{color: textColor, fontSize: 30}}>
					Animation Percentage: {formatToPercentage(animationPercentage)}
				</h1>
			</div> */}

			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg
					overflow="visible"
					width={1080}
					height={100}
					// style={{backgroundColor: '#222222'}}
				>
					{/* startAxis: x axis line */}
					<g>
						<line
							x1={aAxis_lineX1}
							x2={aAxis_lineX2}
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
