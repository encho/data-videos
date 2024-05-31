import {
	// useCurrentFrame,
	// useVideoConfig,
	interpolate,
} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-viz';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {getEnterUpdateExits} from '../../../utils/utils';

import {TXAxisSpec} from './axisSpecs';
import {TPeriodsScale} from '../../../periodsScale/periodsScale';

type TTheme_XAxis = ThemeType['xAxis'];

// const getTickValue = (axisSpec: TXAxisSpec, tickId: string) => {
// 	const tickObj = axisSpec.ticks.find((item) => item.id === tickId);
// 	invariant(tickObj);
// 	return tickObj.value;
// };

const getTick = (axisSpec: TXAxisSpec, tickId: string) => {
	const tickObj = axisSpec.ticks.find((item) => item.id === tickId);
	invariant(tickObj);
	return tickObj;
};

const getLabel = (axisSpec: TXAxisSpec, labelId: string) => {
	const labelObj = axisSpec.labels.find((item) => item.id === labelId);
	invariant(labelObj);
	return labelObj;
};

export const XAxis_Transition: React.FC<{
	area: TGridLayoutArea;
	fromAxisSpec: TXAxisSpec;
	toAxisSpec: TXAxisSpec;
	theme: TTheme_XAxis;
	easingPercentage: number;
	periodsScale: TPeriodsScale;
}> = ({
	area,
	theme,
	fromAxisSpec,
	toAxisSpec,
	easingPercentage,
	periodsScale,
}) => {
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	// const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();
	// const animationPercentage = frame / durationInFrames;
	const animationPercentage = easingPercentage;

	const ticksEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.ticks.map((it) => it.id),
		toAxisSpec.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.labels.map((it) => it.id),
		toAxisSpec.labels.map((it) => it.id)
	);

	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = getTick(fromAxisSpec, tickId);
		// TODO bring back mixing both
		// const endTick = getTick(toAxisSpec, tickId);

		// TODO linear animation percentage here is fine, normally floatIndices are identical anyway!!!
		// const currentPeriodFloatIndex = interpolate(
		// 	animationPercentage,
		// 	[0, 1],
		// 	[startTick.periodFloatIndex, endTick.periodFloatIndex],
		// 	{
		// 		extrapolateLeft: 'clamp',
		// 		extrapolateRight: 'clamp',
		// 	}
		// );

		const currentPeriodFloatIndex = startTick.periodFloatIndex;
		const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		return {id: tickId, value};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = getTick(toAxisSpec, tickId);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const currentPeriodFloatIndex = endTick.periodFloatIndex;
		const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		return {
			id: tickId,
			value,
			opacity: interpolatedOpacity,
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = getTick(fromAxisSpec, tickId);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 0.8],
			[1, 0],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const currentPeriodFloatIndex = startTick.periodFloatIndex;
		const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		return {
			id: tickId,
			value,
			opacity: interpolatedOpacity,
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);
		const endLabel = getLabel(toAxisSpec, labelId);

		const startX = periodsScale.mapFloatIndexToRange(
			startLabel.periodFloatIndex
		);
		const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

		// TODO evtl. refine
		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {
			id: labelId,
			value: currentX,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(toAxisSpec, labelId);

		const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

		// const interpolatedX = interpolate(
		// 	animationPercentage,
		// 	[0, 1],
		// 	[startX, endX],
		// 	{
		// 		easing: Easing.linear,
		// 		extrapolateLeft: 'clamp',
		// 		extrapolateRight: 'clamp',
		// 	}
		// );

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: labelId,
			value: endX,
			opacity: interpolatedOpacity,
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);
		// const endLabel = getLabel(toAxisSpec, labelId);

		const startX = periodsScale.mapFloatIndexToRange(
			startLabel.periodFloatIndex
		);
		// const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 0.8],
			[1, 0],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: labelId,
			value: startX,
			opacity: interpolatedOpacity,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
		};
	});

	// console.log({updateTicks, enterTicks, exitTicks});

	return (
		<svg
			width={area.width}
			height={area.height}
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="xAxisAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{/* enterLabels labels  */}
			{enterLabels.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,0)"
					>
						<text
							// textAnchor="middle"
							textAnchor={it.textAnchor}
							alignmentBaseline="hanging"
							fill={'green'}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.value}
							// y={tickSize + tickLabelMargin}
							y={0}
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
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,0)"
					>
						<text
							// textAnchor="middle"
							textAnchor={it.textAnchor}
							alignmentBaseline="hanging"
							fill={'magenta'}
							stroke={'magenta'}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							// TODO ??
							// x={it.value + MARGIN??}
							x={it.value}
							// y={tickSize + tickLabelMargin}
							y={0}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* exit labels  */}
			{exitLabels.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,0)"
					>
						<text
							// textAnchor="middle"
							textAnchor={it.textAnchor}
							alignmentBaseline="hanging"
							fill={'orange'}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.value}
							// y={tickSize + tickLabelMargin}
							y={0}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* enter ticks  */}
			{enterTicks.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,0)"
					>
						{/* <g key={i}> */}
						<line
							x1={it.value}
							x2={it.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={'green'}
							strokeWidth={4}
							opacity={it.opacity}
						/>
					</g>
				);
			})}

			{/* exit ticks  */}
			{exitTicks.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,0)"
					>
						{/* <g key={i}> */}
						<line
							x1={it.value}
							x2={it.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={'red'}
							strokeWidth={4}
							opacity={it.opacity}
						/>
					</g>
				);
			})}

			{updateTicks.map((xTick) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<line
							x1={xTick.value}
							x2={xTick.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							// stroke={theme.tickColor}
							stroke={'orange'}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{/* {fromAxisSpec.ticks.map((xTick) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<line
							x1={xTick.value}
							x2={xTick.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})} */}

			{/* {fromAxisSpec.labels.map((xLabel) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<text
							textAnchor="left"
							alignmentBaseline="baseline"
							fill={theme.color}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							x={xLabel.value}
							y={TICK_TEXT_FONT_SIZE}
						>
							{xLabel.label}
						</text>
					</g>
				);
			})} */}
		</svg>
	);
};
