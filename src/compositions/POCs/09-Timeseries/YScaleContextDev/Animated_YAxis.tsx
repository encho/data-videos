import {useVideoConfig, interpolate} from 'remotion';
import invariant from 'tiny-invariant';
// import {scaleLinear, ScaleLinear} from 'd3-scale';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
// import {usePage} from '../../../../acetti-components/PageContext';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {getEnterUpdateExits} from '../../../../acetti-ts-utils/utils';
import {
	TYAxisSpec,
	TYAxisScale,
} from '../../../../acetti-ts-axis/utils/axisSpecs_yAxis';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {getYAxisSpec} from '../../../../acetti-ts-axis/utils/axisSpecs_yAxis';
import {usePage} from '../../../../acetti-components/PageContext';

const getTick = (axisSpec: TYAxisSpec, tickId: string) => {
	const tickObj = axisSpec.ticks.find((item) => item.id === tickId);
	invariant(tickObj);
	return tickObj;
};

const getLabel = (axisSpec: TYAxisSpec, labelId: string) => {
	const labelObj = axisSpec.labels.find((item) => item.id === labelId);
	invariant(labelObj);
	return labelObj;
};

export const Animated_YAxis: React.FC<{
	area: TGridLayoutArea;
	yScale: TYAxisScale;
	yScaleFrom: TYAxisScale;
	yScaleTo: TYAxisScale;
	nrTicks?: number;
	tickFormatter: (x: number) => string;
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	debugEnterColor?: string;
	debugUpdateColor?: string;
	debugExitColor?: string;
	// TODO perhaps:
	// axisSpecFrom?: TXAxisSpec;
	// axisSpecTo?: TXAxisSpec;
}> = ({
	periodScaleAnimationContext,
	area,
	yScale,
	yScaleFrom,
	yScaleTo,
	nrTicks = 5,
	tickFormatter,
	debugEnterColor,
	debugExitColor,
	debugUpdateColor,
	// TODO perhaps:
	// axisSpecFrom: axisSpecFromProp,
	// axisSpecTo: axisSpecToProp,
}) => {
	// TODO from Theme
	// sizes and distances
	// ------------------------------------------------------------
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	const {theme: fullTheme, baseline: pageBaseline} = usePage();
	const theme = fullTheme.yAxis;

	// TODO also accept optinally from props
	const THE_BASELINE = pageBaseline;

	const currentSliceInfo = periodScaleAnimationContext.currentSliceInfo;

	const relativeFrame = currentSliceInfo.relativeFrame;
	const {fps} = useVideoConfig();

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		currentSliceInfo.durationInFrames,
		// fps * 0.8
		fps * 1
	);

	const datavizTickLabelStyle =
		fullTheme.typography.textStyles.datavizTickLabel;

	// colors
	// ------------------------------------------------------------
	// TODO in the theme we need lineColor, tickColor, tickLabelColor, secondaryTickLabelColor, evtl. labelColor
	const tickColorEnter = debugEnterColor || theme.tickColor;
	const tickColorUpdate = debugUpdateColor || theme.tickColor;
	const tickColorExit = debugExitColor || theme.tickColor;

	const tickLabelColorEnter = debugEnterColor || theme.color;
	const tickLabelColorUpdate = debugUpdateColor || theme.color;
	const tickLabelColorExit = debugExitColor || theme.color;

	const axisLineColor = debugUpdateColor || theme.color;
	// ------------------------------------------------------------

	// calculate here and potentially get as prop (as in x axis)
	const axisSpecFrom = getYAxisSpec(yScaleFrom, nrTicks, tickFormatter);
	const axisSpecTo = getYAxisSpec(yScaleTo, nrTicks, tickFormatter);

	// TODO how/if to implement in yScale context:
	// *******************************************
	const yDomain = yScale.domain();
	const yDomainSpan = yDomain[1] - yDomain[0];
	const getOpacityNearVisibleBoundary = (yDomainValue: number) => {
		return interpolate(
			yDomainValue,
			[
				yDomain[0] - 0.02 * yDomainSpan,
				yDomain[0] + 0.15 * yDomainSpan,
				yDomain[1] - 0.15 * yDomainSpan,
				yDomain[1] + 0.02 * yDomainSpan,
			],
			[0, 1, 1, 0],
			{}
		);
	};

	// ***************************

	const ticksEnterUpdateExits = getEnterUpdateExits(
		axisSpecFrom.ticks.map((it) => it.id),
		axisSpecTo.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		axisSpecFrom.labels.map((it) => it.id),
		axisSpecTo.labels.map((it) => it.id)
	);

	// ***************************

	// TODO check from below this for conguency with x-axis animation solution....
	// ***************************
	// ***************************
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = getTick(axisSpecFrom, tickId);
		const endTick = getTick(axisSpecTo, tickId);

		const currentDomainValue = interpolate(
			periodScaleAnimationContext.currentSliceInfo.easingPercentage,
			[0, 1],
			[startTick.domainValue, endTick.domainValue]
		);

		// TODO perhaps not needed to interpolate currentDomainValue after all
		// const domainValue = startTick.domainValue;
		// const value = yScale(domainValue);
		const value = yScale(currentDomainValue);

		return {
			id: tickId,
			value,
			// opacity: getOpacityNearVisibleBoundary(currentDomainValue),
			opacity: 1,
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

		const domainValue = endTick.domainValue;
		const value = yScale(domainValue);

		return {
			id: tickId,
			value,
			opacity: interpolatedOpacity * getOpacityNearVisibleBoundary(domainValue),
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

		const domainValue = startTick.domainValue;
		const value = yScale(domainValue);

		return {
			id: tickId,
			value,
			opacity: interpolatedOpacity * getOpacityNearVisibleBoundary(domainValue),
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(axisSpecFrom, labelId);
		const endLabel = getLabel(axisSpecTo, labelId);

		const currentDomainValue = interpolate(
			periodScaleAnimationContext.currentSliceInfo.easingPercentage,
			[0, 1],
			[startLabel.domainValue, endLabel.domainValue]
		);

		// TODO take info about animationPercentage from passed currentTransitionSlice object!
		const marginLeft = interpolate(
			periodScaleAnimationContext.currentSliceInfo.easingPercentage,
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
			value: yScale(currentDomainValue),
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(axisSpecTo, labelId);

		const domainValue = endLabel.domainValue;

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
			value: yScale(domainValue),
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
			marginLeft,
			opacity: interpolatedOpacity * getOpacityNearVisibleBoundary(domainValue),
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(axisSpecFrom, labelId);

		const domainValue = startLabel.domainValue;

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
			value: yScale(domainValue),
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			opacity: interpolatedOpacity * getOpacityNearVisibleBoundary(domainValue),
		};
	});

	// typography
	const tickLabelStyle = fullTheme.typography.textStyles.datavizTickLabel;
	const tickLabelCapHeight = tickLabelStyle.capHeightInBaselines * THE_BASELINE;

	return (
		<div style={{position: 'relative'}}>
			<div
				style={{
					overflow: 'visible',
					position: 'relative',
					// backgroundColor: 'lightcoral',
					width: area.width,
					height: area.height,
				}}
			>
				{/* enterLabels labels  */}
				{enterLabels.map((it, i) => {
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: it.value - tickLabelCapHeight / 2,
								left: TICK_LINE_SIZE + it.marginLeft,
							}}
						>
							<TypographyStyle
								typographyStyle={tickLabelStyle}
								baseline={THE_BASELINE}
							>
								<div
									style={{
										color: tickColorEnter,
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
			<svg
				style={{
					overflow: 'visible',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<defs>
					<clipPath id="areaClipPath_____xxxxxx">
						<rect x={0} y={0} width={area.width} height={area.height} />
					</clipPath>
				</defs>

				{/* enterLabels labels  */}
				{/* {enterLabels.map((it, i) => {
					return (
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<text
								textAnchor="start"
								alignmentBaseline="middle"
								fill={tickLabelColorEnter}
								fontSize={TICK_TEXT_FONT_SIZE}
								fontWeight={TICK_TEXT_FONT_WEIGHT}
								y={it.value}
								x={TICK_LINE_SIZE + it.marginLeft}
								opacity={it.opacity}
							>
								{it.label}
							</text>
						</g>
					);
				})} */}

				{/* update labels  */}
				{updateLabels.map((it, i) => {
					return (
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<text
								// textAnchor={it.textAnchor} // TODO use?
								textAnchor="start"
								alignmentBaseline="middle"
								fill={tickLabelColorUpdate}
								fontSize={TICK_TEXT_FONT_SIZE}
								fontWeight={TICK_TEXT_FONT_WEIGHT}
								y={it.value}
								x={TICK_LINE_SIZE + it.marginLeft}
							>
								{it.label}
							</text>
						</g>
					);
				})}

				{/* exit labels  */}
				{exitLabels.map((it, i) => {
					return (
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<text
								textAnchor="start"
								alignmentBaseline="middle"
								fill={tickLabelColorExit}
								fontSize={TICK_TEXT_FONT_SIZE}
								fontWeight={TICK_TEXT_FONT_WEIGHT}
								y={it.value}
								x={TICK_LINE_SIZE + it.marginLeft}
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
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<line
								y1={it.value}
								y2={it.value}
								x1={0}
								x2={TICK_LINE_SIZE}
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
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<line
								y1={it.value}
								y2={it.value}
								x1={0}
								x2={TICK_LINE_SIZE}
								stroke={tickColorExit}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}

				{updateTicks.map((it, i) => {
					return (
						<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
							<line
								y1={it.value}
								y2={it.value}
								x1={0}
								x2={TICK_LINE_SIZE}
								stroke={tickColorUpdate}
								strokeWidth={4}
								opacity={it.opacity}
							/>
						</g>
					);
				})}

				{/* axis line */}
				<g
					// clipPath="url(#areaClipPath)"
					transform="translate(0,0)"
				>
					<line
						x1={0}
						x2={0}
						y1={area.y1}
						y2={area.y2}
						stroke={axisLineColor}
						strokeWidth={4}
					/>
				</g>
			</svg>
		</div>
	);
};
