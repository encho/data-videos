import {
	// useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-viz';
import {ThemeType} from '../acetti-themes/themeTypes';
import {getEnterUpdateExits} from '../AnimatedLineChartScaleBand/utils/utils';

import {TYAxisSpec, TYAxisScale} from './utils/axisSpecs_yAxis';
// import {TPeriodsScale} from '../../../periodsScale/periodsScale';
import {TLineChartAnimationContext} from '../acetti-ts-base/LineChartAnimationContainer';

type TTheme_YAxis = ThemeType['yAxis'];

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

export const YAxis_Transition: React.FC<{
	area: TGridLayoutArea;
	fromAxisSpec: TYAxisSpec;
	toAxisSpec: TYAxisSpec;
	theme: TTheme_YAxis;
	yScale: TYAxisScale;
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
}> = ({
	area,
	theme,
	fromAxisSpec,
	toAxisSpec,
	yScale,
	// TODO pass animation context data e.g. currentSliceInfo and currentTransitionInfo
	currentSliceInfo,
}) => {
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	const relativeFrame = currentSliceInfo.relativeFrame;
	const {fps} = useVideoConfig();
	// const animationPercentage = frame / durationInFrames;
	// const animationPercentage = easingPercentage;

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

		const domainValue = startTick.domainValue;
		const value = yScale(domainValue);

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

		const domainValue = endTick.domainValue;
		const value = yScale(domainValue);

		return {
			id: tickId,
			value,
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

		const domainValue = startTick.domainValue;
		const value = yScale(domainValue);

		// const currentPeriodFloatIndex = startTick.periodFloatIndex;
		// const value = periodsScale.mapFloatIndexToRange(currentPeriodFloatIndex);

		return {
			id: tickId,
			value,
			opacity: interpolatedOpacity,
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);
		const endLabel = getLabel(toAxisSpec, labelId);

		const startY = yScale(startLabel.domainValue);
		const endY = yScale(endLabel.domainValue);

		// TODO evtl. refine
		// TODO take info about animationPercentage from passed currentTransitionSlice object!
		const animationPercentage = 0;
		const currentY =
			(1 - animationPercentage) * startY + animationPercentage * endY;

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
			value: currentY,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
			// opacity: 1,
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = getLabel(toAxisSpec, labelId);
		const endY = yScale(endLabel.domainValue);

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
			value: endY,
			opacity: interpolatedOpacity,
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
			marginLeft,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = getLabel(fromAxisSpec, labelId);

		const endY = yScale(startLabel.domainValue);

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
			value: endY,
			opacity: interpolatedOpacity,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
			marginLeft,
		};
	});

	return (
		<svg
			// width={area.width}
			// height={area.height}
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="areaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{/* enterLabels labels  */}
			{enterLabels.map((it, i) => {
				return (
					<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
						<text
							textAnchor="start"
							alignmentBaseline="middle"
							fill={theme.color}
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

			{/* update labels  */}
			{updateLabels.map((it, i) => {
				return (
					<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
						<text
							// textAnchor={it.textAnchor} // TODO use?
							textAnchor="start"
							alignmentBaseline="middle"
							fill={theme.color}
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
							fill={theme.color}
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
					<g key={i} clipPath="url(#areaClipPath)" transform="translate(0,0)">
						<line
							y1={it.value}
							y2={it.value}
							x1={0}
							x2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={4}
							opacity={it.opacity}
							// opacity={1}
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
							stroke={theme.tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}
		</svg>
	);
};
