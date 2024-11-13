import {useVideoConfig, interpolate} from 'remotion';
import invariant from 'tiny-invariant';

import {TYScaleAnimationContext} from './useYScaleAnimation';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {getEnterUpdateExits} from '../../../../acetti-ts-utils/utils';
import {TYAxisSpec} from '../../../../acetti-ts-axis/utils/axisSpecs_yAxis';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
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
	periodScaleAnimation: TPeriodScaleAnimationContext;
	yScaleAnimation: TYScaleAnimationContext;
	// yAxisSpecFrom: TYAxisSpec; // evtl. as optional prop?
	// yAxisSpecTo: TYAxisSpec; // evtl. as optional prop?
	// TODO better debugColors object {update, enter, exit}
	debugEnterColor?: string;
	debugUpdateColor?: string;
	debugExitColor?: string;
}> = ({
	periodScaleAnimation,
	yScaleAnimation,
	area,
	debugEnterColor,
	debugExitColor,
	debugUpdateColor,
}) => {
	// TODO from Theme
	// sizes and distances
	// ------------------------------------------------------------
	const TICK_LINE_SIZE = 24; // TODO into theme
	const TICK_LINE_WIDTH = 4; // TODO into theme
	const AXIS_LINE_WIDTH = 4; // TODO into theme

	const {theme: fullTheme, baseline: pageBaseline} = usePage();
	const theme = fullTheme.yAxis;

	// TODO also accept optinally from props
	const THE_BASELINE = pageBaseline;

	const {yScale, yAxisSpecFrom, yAxisSpecTo} = yScaleAnimation;

	const currentSliceInfo = periodScaleAnimation.currentSliceInfo;

	const relativeFrame = currentSliceInfo.relativeFrame;
	const {fps} = useVideoConfig();

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		currentSliceInfo.durationInFrames,
		fps * 1 // TODO this duration setting into theme
	);

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
		yAxisSpecFrom.ticks.map((it) => it.id),
		yAxisSpecTo.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		yAxisSpecFrom.labels.map((it) => it.id),
		yAxisSpecTo.labels.map((it) => it.id)
	);

	// ***************************

	// TODO check from below this for conguency with x-axis animation solution....
	// ***************************
	// ***************************
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startTick = getTick(yAxisSpecFrom, tickId);
		const endTick = getTick(yAxisSpecTo, tickId);

		const currentDomainValue = interpolate(
			periodScaleAnimation.currentSliceInfo.easingPercentage,
			[0, 1],
			[startTick.domainValue, endTick.domainValue]
		);

		const value = yScale(currentDomainValue);

		return {
			id: tickId,
			value,
			opacity: 1,
			color: tickColorUpdate,
		};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = getTick(yAxisSpecTo, tickId);

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
			color: tickColorEnter,
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = getTick(yAxisSpecFrom, tickId);

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
			color: tickColorExit,
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(yAxisSpecFrom, labelId);
		const endLabel = getLabel(yAxisSpecTo, labelId);

		const currentDomainValue = interpolate(
			periodScaleAnimation.currentSliceInfo.easingPercentage,
			[0, 1],
			[startLabel.domainValue, endLabel.domainValue]
		);

		const marginLeft = interpolate(
			periodScaleAnimation.currentSliceInfo.easingPercentage,
			[0, 1],
			[startLabel.marginLeft || 0, endLabel.marginLeft || 0],
			{
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
			opacity: 1,
			color: tickLabelColorUpdate,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(yAxisSpecTo, labelId);

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
			color: tickLabelColorEnter,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(yAxisSpecFrom, labelId);

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
			color: tickLabelColorExit,
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
					width: area.width,
					height: area.height,
				}}
			>
				{/* all labels  */}
				{[...enterLabels, ...updateLabels, ...exitLabels].map((it, i) => {
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

			<svg
				style={{
					overflow: 'visible',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				{/* all ticks  */}
				{[...enterTicks, ...updateTicks, ...exitTicks].map((it, i) => {
					return (
						<g key={i} transform="translate(0,0)">
							<line
								y1={it.value}
								y2={it.value}
								x1={0}
								x2={TICK_LINE_SIZE}
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
						x1={0}
						x2={0}
						y1={0}
						y2={area.height}
						stroke={axisLineColor}
						strokeWidth={AXIS_LINE_WIDTH}
					/>
				</g>
			</svg>
		</div>
	);
};
