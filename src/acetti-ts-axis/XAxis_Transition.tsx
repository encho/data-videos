import {useVideoConfig, interpolate} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-layout';
import {ThemeType} from '../acetti-themes/themeTypes';
import {getEnterUpdateExits} from '../acetti-ts-utils/utils';

import {TXAxisSpec} from './utils/axisSpecs_xAxis';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {TPeriodScaleAnimationContext} from '../compositions/POCs/09-Timeseries/utils/usePeriodScaleAnimation';

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
	currentSliceInfo: TPeriodScaleAnimationContext['currentSliceInfo'];
	debugEnterColor?: string;
	debugUpdateColor?: string;
	debugExitColor?: string;
}> = ({
	area,
	theme,
	fromAxisSpec,
	toAxisSpec,
	periodsScale,
	currentSliceInfo,
	debugEnterColor,
	debugUpdateColor,
	debugExitColor,
}) => {
	// TODO from Theme
	// sizes and distances
	// ------------------------------------------------------------
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	// colors
	// ------------------------------------------------------------
	// TODO in the theme we need lineColor, tickColor, tickLabelColor, secondaryTickLabelColor, evtl. labelColor
	const tickColorEnter = debugEnterColor || theme.tickColor;
	const tickColorUpdate = debugUpdateColor || theme.tickColor;
	const tickColorExit = debugExitColor || theme.tickColor;

	const tickLabelColorEnter = debugEnterColor || theme.color;
	const tickLabelColorUpdate = debugUpdateColor || theme.color;
	const tickLabelColorExit = debugExitColor || theme.color;

	const secondaryTickLabelColorEnter = debugEnterColor || theme.color;
	const secondaryTickLabelColorUpdate = debugUpdateColor || theme.color;
	const secondaryTickLabelColorExit = debugExitColor || theme.color;

	const axisLineColor = debugUpdateColor || theme.color;

	const {relativeFrame} = currentSliceInfo;
	const {fps} = useVideoConfig();

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndicesRange =
		visibleDomainIndices[1] - visibleDomainIndices[0];

	const getOpacityNearVisibleBoundary = (domainIndex: number) => {
		return interpolate(
			domainIndex,
			[
				visibleDomainIndices[0] - 0.01 * visibleDomainIndicesRange,
				visibleDomainIndices[0],
				visibleDomainIndices[1],
				visibleDomainIndices[1] + 0.01 * visibleDomainIndicesRange,
			],
			[0.1, 1, 1, 0.1],
			{}
		);
	};

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		currentSliceInfo.durationInFrames,
		fps
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

		return {
			id: tickId,
			value,
			opacity: getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
		};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = getTick(toAxisSpec, tickId);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
			[0, 1],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const currentPeriodFloatIndex = endTick.periodFloatIndex;
		const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		return {
			id: tickId,
			value,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = getTick(fromAxisSpec, tickId);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
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
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);
		const endLabel = getLabel(toAxisSpec, labelId);

		const interpolatedPeriodFloatIndex = interpolate(
			currentSliceInfo.easingPercentage,
			[0, 1],
			[startLabel.periodFloatIndex, endLabel.periodFloatIndex]
		);

		const currentX = periodsScale.mapFloatIndexToRange(
			interpolatedPeriodFloatIndex
		);

		const marginLeft = interpolate(
			currentSliceInfo.easingPercentage,
			[0, 1],
			[startLabel.marginLeft || 0, endLabel.marginLeft || 0]
		);

		return {
			id: labelId,
			value: currentX,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			opacity: getOpacityNearVisibleBoundary(interpolatedPeriodFloatIndex),
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(toAxisSpec, labelId);
		const endX = periodsScale.mapFloatIndexToRange(endLabel.periodFloatIndex);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
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
			// opacity: interpolatedOpacity,
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
			marginLeft,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(endLabel.periodFloatIndex),
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);

		const startX = periodsScale.mapFloatIndexToRange(
			startLabel.periodFloatIndex
		);

		const interpolatedOpacity = interpolate(
			relativeFrame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
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
			// opacity: interpolatedOpacity,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(startLabel.periodFloatIndex),
		};
	});

	// secondary labels
	// ***********************************************************
	const updateSecondaryLabels = secondaryLabelsEnterUpdateExits.update.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(fromAxisSpec, labelId);
			const endLabel = getSecondaryLabel(toAxisSpec, labelId);

			const currentPeriodFloatIndex =
				currentSliceInfo.easingPercentage * startLabel.periodFloatIndex +
				(1 - currentSliceInfo.easingPercentage) * endLabel.periodFloatIndex;

			const currentX = periodsScale.mapFloatIndexToRange(
				currentPeriodFloatIndex
			);

			const marginLeft = interpolate(
				currentSliceInfo.easingPercentage,
				[0, 1],
				[startLabel.marginLeft || 0, endLabel.marginLeft || 0],
				{
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
				opacity: getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
			};
		}
	);

	const enterSecondaryLabels = secondaryLabelsEnterUpdateExits.enter.map(
		(labelId) => {
			const endLabel = getSecondaryLabel(toAxisSpec, labelId);

			const currentPeriodFloatIndex = endLabel.periodFloatIndex;

			const endX = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

			const interpolatedOpacity = interpolate(
				relativeFrame,
				[0, FADE_IN_OUT_DURATION_IN_FRAMES],
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
				// opacity: interpolatedOpacity,

				label: endLabel.label,
				textAnchor: endLabel.textAnchor,
				marginLeft,
				opacity:
					interpolatedOpacity *
					getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
			};
		}
	);

	const exitSecondaryLabels = secondaryLabelsEnterUpdateExits.exit.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(fromAxisSpec, labelId);

			const currentPeriodFloatIndex = startLabel.periodFloatIndex;

			const startX = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

			const interpolatedOpacity = interpolate(
				relativeFrame,
				[0, FADE_IN_OUT_DURATION_IN_FRAMES],
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
				// opacity: interpolatedOpacity,
				label: startLabel.label,
				textAnchor: startLabel.textAnchor,
				marginLeft,
				opacity:
					interpolatedOpacity *
					getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
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
							fill={tickLabelColorEnter}
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
							// fill={theme.color} // TODO get a grip on the colors
							// fill={it.color}
							fill={tickLabelColorUpdate}
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
							// fill={theme.color}
							fill={tickLabelColorExit}
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
							// fill={theme.color}
							fill={secondaryTickLabelColorUpdate}
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
							// fill={theme.color}
							fill={secondaryTickLabelColorEnter}
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
							// fill={theme.color}
							fill={secondaryTickLabelColorExit}
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
							stroke={tickColorEnter}
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
							stroke={tickColorExit}
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
							stroke={tickColorUpdate}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{/* axis line */}
			<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
				<line
					x1={area.x1}
					x2={area.x2}
					y1={0}
					y2={0}
					stroke={axisLineColor}
					strokeWidth={4}
				/>
			</g>
		</svg>
	);
};
