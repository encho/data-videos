import {useVideoConfig, interpolate} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-layout';
import {getEnterUpdateExits} from '../../../../acetti-ts-utils/utils';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {usePage} from '../../../../acetti-components/PageContext';
import {TXAxisSpec} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {TPeriodScaleAnimationContext} from './usePeriodScaleAnimation';

// TODO from Theme
// sizes and distances
// ------------------------------------------------------------
// const TICK_LINE_SIZE = 24; // TODO into theme
// const TICK_LINE_WIDTH = 4; // TODO into theme
// const AXIS_LINE_WIDTH = 4; // TODO into theme

const TICKLABEL_MARGIN_TOP_IN_BASELINES = 0.6;
const SECONDARY_TICKLABEL_MARGIN_TOP_IN_BASELINES = 0.8;

export function useXAxisAreaHeight(baselineProp?: number) {
	const {theme, baseline: themeBaseline} = usePage();

	const baseline = baselineProp || themeBaseline;

	const tickLabelStyle = theme.typography.textStyles.datavizTickLabel;
	const secondaryTickLabelStyle =
		theme.typography.textStyles.datavizSecondaryTickLabel;

	const tickLabelHeight = tickLabelStyle.capHeightInBaselines * baseline;
	const secondaryTickLabelHeight =
		secondaryTickLabelStyle.capHeightInBaselines * baseline;

	const tickLabelMarginTop = TICKLABEL_MARGIN_TOP_IN_BASELINES * baseline;
	const secondaryTickLabelMarginTop =
		SECONDARY_TICKLABEL_MARGIN_TOP_IN_BASELINES * baseline;

	const xAxisAreaHeight =
		tickLabelMarginTop +
		tickLabelHeight +
		secondaryTickLabelMarginTop +
		secondaryTickLabelHeight;

	return xAxisAreaHeight;
}

export const Animated_XAxis: React.FC<{
	periodsScaleAnimation: TPeriodScaleAnimationContext;
	area: TGridLayoutArea;
	axisSpecFrom?: TXAxisSpec;
	axisSpecTo?: TXAxisSpec;
	debugEnterColor?: string;
	debugUpdateColor?: string;
	debugExitColor?: string;
}> = ({
	periodsScaleAnimation,
	area,
	axisSpecFrom: axisSpecFromProp,
	axisSpecTo: axisSpecToProp,
	debugEnterColor,
	debugUpdateColor,
	debugExitColor,
}) => {
	const {theme: fullTheme, baseline: pageBaseline, sizes} = usePage();

	const THE_BASELINE = pageBaseline;

	const TICK_LINE_SIZE_IN_BASELINES =
		fullTheme.typography.textStyles.datavizTickLabel.capHeightInBaselines +
		TICKLABEL_MARGIN_TOP_IN_BASELINES;

	const TICK_LINE_SIZE = THE_BASELINE * TICK_LINE_SIZE_IN_BASELINES;

	const TICK_LINE_WIDTH = sizes.lineWidths.small; // TODO too generic?
	const AXIS_LINE_WIDTH = sizes.lineWidths.small; // TODO too generic?

	const SECONDARY_TICKLABEL_TOP_Y =
		TICK_LINE_SIZE + THE_BASELINE * SECONDARY_TICKLABEL_MARGIN_TOP_IN_BASELINES;

	// TODO rename to xAxisTheme e.g.
	const theme = fullTheme.xAxis;

	const periodsScale = periodsScaleAnimation.periodsScale;
	const currentSliceInfo = periodsScaleAnimation.currentSliceInfo;

	const periodScaleFrom =
		periodsScaleAnimation.currentSliceInfo.periodsScaleFrom;

	const periodScaleTo = periodsScaleAnimation.currentSliceInfo.periodsScaleTo;

	const axisSpecFrom =
		axisSpecFromProp ||
		getAxisSpec(periodScaleFrom, getAxisSpecType(periodScaleFrom));

	const axisSpecTo =
		axisSpecToProp ||
		getAxisSpec(periodScaleTo, getAxisSpecType(periodScaleTo));

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

	const relativeFrame = currentSliceInfo.relativeFrame;
	const {fps} = useVideoConfig();

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const visibleDomainIndicesRange =
		visibleDomainIndices[1] - visibleDomainIndices[0];

	const getOpacityNearVisibleBoundary = (domainIndex: number) => {
		return interpolate(
			domainIndex,
			[
				visibleDomainIndices[0] - 0.02 * visibleDomainIndicesRange,
				visibleDomainIndices[0] + 0.15 * visibleDomainIndicesRange,
				visibleDomainIndices[1] - 0.15 * visibleDomainIndicesRange,
				visibleDomainIndices[1] + 0.02 * visibleDomainIndicesRange,
			],
			[0, 1, 1, 0],
			{}
		);
	};

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		currentSliceInfo.durationInFrames,
		fps * 1 // TODO this duration setting into theme
	);

	const ticksEnterUpdateExits = getEnterUpdateExits(
		axisSpecFrom.ticks.map((it) => it.id),
		axisSpecTo.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		axisSpecFrom.labels.map((it) => it.id),
		axisSpecTo.labels.map((it) => it.id)
	);

	const secondaryLabelsEnterUpdateExits = getEnterUpdateExits(
		axisSpecFrom.secondaryLabels.map((it) => it.id),
		axisSpecTo.secondaryLabels.map((it) => it.id)
	);

	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = getTick(axisSpecFrom, tickId);
		// TODO bring back mixing both
		// const endTick = getTick(axisSpecTo, tickId);

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
			opacity: 1,
			color: tickColorUpdate,
		};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = getTick(axisSpecTo, tickId);

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
			value: value,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
			color: tickColorEnter,
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = getTick(axisSpecFrom, tickId);

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
			color: tickColorExit,
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(axisSpecFrom, labelId);
		const endLabel = getLabel(axisSpecTo, labelId);

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
			opacity: 1,
			color: tickLabelColorUpdate,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(axisSpecTo, labelId);
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
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
			marginLeft,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(endLabel.periodFloatIndex),
			color: tickLabelColorEnter,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(axisSpecFrom, labelId);

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
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(startLabel.periodFloatIndex),
			color: tickLabelColorExit,
		};
	});

	// secondary labels
	// ***********************************************************
	const updateSecondaryLabels = secondaryLabelsEnterUpdateExits.update.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(axisSpecFrom, labelId);
			const endLabel = getSecondaryLabel(axisSpecTo, labelId);

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
				opacity: 1,
				color: secondaryTickLabelColorUpdate,
			};
		}
	);

	const enterSecondaryLabels = secondaryLabelsEnterUpdateExits.enter.map(
		(labelId) => {
			const endLabel = getSecondaryLabel(axisSpecTo, labelId);

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
				label: endLabel.label,
				textAnchor: endLabel.textAnchor,
				marginLeft,
				opacity:
					interpolatedOpacity *
					getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
				color: secondaryTickLabelColorEnter,
			};
		}
	);

	const exitSecondaryLabels = secondaryLabelsEnterUpdateExits.exit.map(
		(labelId) => {
			const startLabel = getSecondaryLabel(axisSpecFrom, labelId);

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
				label: startLabel.label,
				textAnchor: startLabel.textAnchor,
				marginLeft,
				opacity:
					interpolatedOpacity *
					getOpacityNearVisibleBoundary(currentPeriodFloatIndex),
				color: secondaryTickLabelColorExit,
			};
		}
	);

	// typography
	const tickLabelStyle = fullTheme.typography.textStyles.datavizTickLabel;
	const tickLabelCapHeight = tickLabelStyle.capHeightInBaselines * THE_BASELINE;

	const secondaryTickLabelStyle =
		fullTheme.typography.textStyles.datavizSecondaryTickLabel;

	return (
		<div style={{position: 'relative'}}>
			<div
				style={{
					overflow: 'visible',
					position: 'relative',
					width: area.width,
					height: area.height,
				}}
			>
				{/* all labels */}
				<div id="x-axis-labels">
					{[...enterLabels, ...updateLabels, ...exitLabels].map((it, i) => {
						return (
							// TODO: how to address textAnchor??
							<div
								key={i}
								style={{
									position: 'absolute',
									// top: tickLabelCapHeight, // TODO from theme setting or so
									top: TICK_LINE_SIZE - tickLabelCapHeight, // TODO from theme setting or so
									left: it.value + it.marginLeft,
								}}
							>
								<TypographyStyle
									typographyStyle={tickLabelStyle}
									baseline={THE_BASELINE}
								>
									<div
										style={{
											color: it.color,
											opacity: it.opacity,
										}}
									>
										{it.label}
									</div>
								</TypographyStyle>
							</div>
						);
					})}
				</div>

				<div id="x-axis-secondary-labels">
					{[
						...enterSecondaryLabels,
						...updateSecondaryLabels,
						...exitSecondaryLabels,
					].map((it, i) => {
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: SECONDARY_TICKLABEL_TOP_Y,
									left: it.value + it.marginLeft,
								}}
							>
								{/* // TODO: how to deal with textAnchor */}
								<TypographyStyle
									typographyStyle={secondaryTickLabelStyle} // TODO secondaryTickLabelStyle
									baseline={THE_BASELINE}
								>
									<div
										style={{
											color: it.color,
											opacity: it.opacity,
										}}
									>
										{it.label}
									</div>
								</TypographyStyle>
							</div>
						);
					})}
				</div>
			</div>

			<svg
				style={{
					position: 'absolute',
					overflow: 'visible',
					top: 0,
					left: 0,
				}}
			>
				{/* all ticks  */}
				{[...updateTicks, ...enterTicks, ...exitTicks].map((it, i) => {
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
								stroke={it.color}
								strokeWidth={TICK_LINE_WIDTH}
								opacity={it.opacity}
							/>
						</g>
					);
				})}

				{/* axis line */}
				<g transform="translate(0,0)">
					<line
						x1={area.x1}
						x2={area.x2}
						y1={0}
						y2={0}
						stroke={axisLineColor}
						strokeWidth={AXIS_LINE_WIDTH}
					/>
				</g>
			</svg>
		</div>
	);
};

// *******************************************
// TODO factor these funcitionalities out
// *******************************************

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

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
} as const;

type TSpecType = keyof typeof AXIS_SPEC_FUNCTIONS;

const getAxisSpecType = (periodsScale: TPeriodsScale): TSpecType => {
	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE =
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: 'quarterStarts';

	return SPEC_TYPE;
};

const getAxisSpec = (periodsScale: TPeriodsScale, specType: TSpecType) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};
