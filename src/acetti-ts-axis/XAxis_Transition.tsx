import {useVideoConfig, interpolate} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-layout';
import {ThemeType} from '../acetti-themes/themeTypes';
import {getEnterUpdateExits} from '../acetti-ts-utils/utils';

import {TXAxisSpec} from './utils/axisSpecs_xAxis';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {TLineChartAnimationContext} from '../acetti-ts-base/LineChartAnimationContainer';

type TTheme_XAxis = ThemeType['xAxis'];

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

const getSecondaryLabel = (axisSpec: TXAxisSpec, labelId: string) => {
	const labelObj = axisSpec.secondaryLabels.find((item) => item.id === labelId);
	invariant(labelObj);
	return labelObj;
};

export const XAxis_Transition: React.FC<{
	area: TGridLayoutArea;
	fromAxisSpec: TXAxisSpec;
	toAxisSpec: TXAxisSpec;
	theme: TTheme_XAxis;
	periodsScale: TPeriodsScale;
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
}> = ({
	area,
	theme,
	fromAxisSpec,
	toAxisSpec,
	periodsScale,
	currentSliceInfo,
}) => {
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	const relativeFrame = currentSliceInfo.relativeFrame;
	const {fps} = useVideoConfig();

	// const FADE_IN_OUT_DURATION = fps * 3;
	const FADE_IN_OUT_DURATION = Math.min(
		currentSliceInfo.durationInFrames,
		fps * 0.8
	);

	const ticksEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.ticks.map((it) => it.id),
		toAxisSpec.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.labels.map((it) => it.id),
		toAxisSpec.labels.map((it) => it.id)
	);

	const secondaryLabelsEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.secondaryLabels.map((it) => it.id),
		toAxisSpec.secondaryLabels.map((it) => it.id)
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
			relativeFrame,
			[0, FADE_IN_OUT_DURATION],
			[0, 1],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const currentPeriodFloatIndex = endTick.periodFloatIndex;
		const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		// const interpolatedValue = interpolate(
		// 	relativeFrame,
		// 	[0, FADE_IN_OUT_DURATION],
		// 	[0, value],
		// 	{
		// 		extrapolateLeft: 'clamp',
		// 		extrapolateRight: 'clamp',
		// 	}
		// );

		return {
			id: tickId,
			value: value,
			opacity: interpolatedOpacity,
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = getTick(fromAxisSpec, tickId);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION],
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
		// TODO take info about animationPercentage from passed currentTransitionSlice object!
		const animationPercentage = 0;
		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		// TODO take info about animationPercentage from passed currentTransitionSlice object!
		const marginLeft = interpolate(
			animationPercentage,
			[0, 1],
			[startLabel.marginLeft || 0, endLabel.marginLeft || 0],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: labelId,
			value: currentX,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			// opacity: 1,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(toAxisSpec, labelId);
		const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION],
			[0, 1],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const marginLeft = endLabel.marginLeft || 0;

		return {
			id: labelId,
			value: endX,
			opacity: interpolatedOpacity,
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
			marginLeft,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);

		const startX = periodsScale.mapFloatIndexToRange(
			startLabel.periodFloatIndex
		);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION],
			[1, 0],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const marginLeft = startLabel.marginLeft || 0;

		return {
			id: labelId,
			value: startX,
			opacity: interpolatedOpacity,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
		};
	});

	// secondary labels
	// ***********************************************************
	const updateSecondaryLabels = secondaryLabelsEnterUpdateExits.update.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(fromAxisSpec, labelId);
			const endLabel = getSecondaryLabel(toAxisSpec, labelId);

			const startX = periodsScale.mapFloatIndexToRange(
				startLabel.periodFloatIndex
			);
			const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

			// TODO evtl. refine
			// TODO take info about animationPercentage from passed currentTransitionSlice object!
			const animationPercentage = 0;
			const currentX =
				(1 - animationPercentage) * startX + animationPercentage * endX;

			// const currentX = endX;

			// TODO take info about animationPercentage from passed currentTransitionSlice object!
			const marginLeft = interpolate(
				animationPercentage,
				[0, 1],
				[startLabel.marginLeft || 0, endLabel.marginLeft || 0],
				{
					// easing: Easing.bezier(0.25, 1, 0.5, 1),
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}
			);

			return {
				id: labelId,
				value: currentX,
				label: startLabel.label,
				textAnchor: startLabel.textAnchor,
				marginLeft,
			};
		}
	);

	const enterSecondaryLabels = secondaryLabelsEnterUpdateExits.enter.map(
		(labelId) => {
			const endLabel = getSecondaryLabel(toAxisSpec, labelId);
			const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

			const interpolatedOpacity = interpolate(
				relativeFrame,
				[0, FADE_IN_OUT_DURATION],
				[0, 1],
				{
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}
			);

			const marginLeft = endLabel.marginLeft || 0;

			return {
				id: labelId,
				value: endX,
				opacity: interpolatedOpacity,
				label: endLabel.label,
				textAnchor: endLabel.textAnchor,
				marginLeft,
			};
		}
	);

	const exitSecondaryLabels = secondaryLabelsEnterUpdateExits.exit.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(fromAxisSpec, labelId);

			const startX = periodsScale.mapFloatIndexToRange(
				startLabel.periodFloatIndex
			);

			const interpolatedOpacity = interpolate(
				relativeFrame,
				[0, FADE_IN_OUT_DURATION],
				[1, 0],
				{
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}
			);

			const marginLeft = startLabel.marginLeft || 0;

			return {
				id: labelId,
				value: startX,
				opacity: interpolatedOpacity,
				label: startLabel.label,
				textAnchor: startLabel.textAnchor,
				marginLeft,
			};
		}
	);

	return (
		<svg
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="xAxisAreaClipPath_____xxxxxxx">
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
							textAnchor={it.textAnchor}
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							alignmentBaseline="baseline"
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
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
							textAnchor={it.textAnchor}
							fill={theme.color}
							alignmentBaseline="baseline"
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
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
							textAnchor={it.textAnchor}
							alignmentBaseline="baseline"
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* update secondary labels  */}
			{updateSecondaryLabels.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						// transform="translate(0,40)"
						transform={`translate(0,${area.height - TICK_TEXT_FONT_SIZE})`}
					>
						<text
							textAnchor={it.textAnchor}
							fill={theme.color}
							alignmentBaseline="baseline"
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* enter secondary labels  */}
			{enterSecondaryLabels.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform={`translate(0,${area.height - TICK_TEXT_FONT_SIZE})`}
						// transform="translate(0,40)"
					>
						<text
							textAnchor={it.textAnchor}
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							alignmentBaseline="baseline"
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* exit secondary labels  */}
			{exitSecondaryLabels.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						// transform="translate(0,40)"
						transform={`translate(0,${area.height - TICK_TEXT_FONT_SIZE})`}
					>
						<text
							textAnchor={it.textAnchor}
							alignmentBaseline="baseline"
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={TICK_TEXT_FONT_SIZE}
							x={it.value + it.marginLeft}
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
						<line
							x1={it.value}
							x2={it.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
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
						<line
							x1={it.value}
							x2={it.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={4}
							opacity={it.opacity}
							// opacity={1}
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
							stroke={theme.tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}
		</svg>
	);
};
