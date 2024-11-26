import React from 'react';
import {ScaleLinear} from 'd3-scale';
import {interpolate, Easing, useVideoConfig, Sequence} from 'remotion';
import invariant from 'tiny-invariant';

import {getEnterUpdateExits} from '../../../../../../../acetti-ts-utils/utils';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TGridLayoutArea} from '../../../../../../../acetti-layout';
import {HtmlArea} from '../../../../../../../acetti-layout';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';
import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

type TTickSpec_XAxis = {
	id: string;
	domainValue: number;
};

type TLabelSpec_XAxis = {
	id: string;
	domainValue: number;
	label: string;
	// textAnchor?: 'start' | 'middle' | 'end';
	// marginLeft?: number;
};

// TODO import from somewehere
export type TXAxisSpec = {
	ticks: TTickSpec_XAxis[];
	labels: TLabelSpec_XAxis[];
};

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

export const Animated_XAxis_Update: React.FC<{
	area: TGridLayoutArea;
	xScaleCurrent: ScaleLinear<number, number>;
	theme: ThemeType;
	xAxisSpecFrom: TXAxisSpec;
	xAxisSpecTo: TXAxisSpec;
	baseline: number;
	frame: number;
	durationInFrames: number;
	startFrame: number;
}> = ({
	area,
	xScaleCurrent,
	theme,
	xAxisSpecFrom,
	xAxisSpecTo,
	baseline,
	frame,
	durationInFrames,
	startFrame,
}) => {
	const {fps} = useVideoConfig();

	const tickLabelStyle = theme.typography.textStyles.datavizTickLabel;

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		Math.floor(fps * 0.75),
		durationInFrames
	);

	// const keyframes = getKeyframes({durationInFrames, fps, xAxisSpec});

	const axisLine_x1 = 0;
	const axisLine_x2 = area.width;
	const axisLine_opacity = 1;
	const axisLine_color = theme.xAxis.color;

	const ticksEnterUpdateExits = getEnterUpdateExits(
		xAxisSpecFrom.ticks.map((it) => it.id),
		xAxisSpecTo.ticks.map((it) => it.id)
	);

	// const labelsEnterUpdateExits = getEnterUpdateExits(
	// 	xAxisSpecFrom.ticks.map((it) => it.id),
	// 	xAxisSpecTo.ticks.map((it) => it.id)
	// );

	const visibleDomainValues = xScaleCurrent.domain();
	const visibleDomainValuesRange =
		visibleDomainValues[1] - visibleDomainValues[0];

	const getOpacityNearVisibleBoundary = (domainValue: number) => {
		return interpolate(
			domainValue,
			[
				visibleDomainValues[0] - 0.01 * visibleDomainValuesRange,
				visibleDomainValues[0],
				visibleDomainValues[1],
				visibleDomainValues[1] + 0.01 * visibleDomainValuesRange,
			],
			[0.1, 1, 1, 0.1],
			{}
		);
	};

	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const tickTo = getTick(xAxisSpecTo, tickId);

		const tickMappedValue = xScaleCurrent(tickTo.domainValue);

		return {
			id: tickId,
			value: tickMappedValue,
			opacity: getOpacityNearVisibleBoundary(tickTo.domainValue),
		};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const tickTo = getTick(xAxisSpecTo, tickId);

		const tickMappedValue = xScaleCurrent(tickTo.domainValue);

		const interpolatedOpacity = interpolate(
			frame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
			[0, 1],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			value: tickMappedValue,
			opacity:
				interpolatedOpacity * getOpacityNearVisibleBoundary(tickTo.domainValue),
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const tickFrom = getTick(xAxisSpecFrom, tickId);

		const tickMappedValue = xScaleCurrent(tickFrom.domainValue);

		const interpolatedOpacity = interpolate(
			frame,
			[0, FADE_IN_OUT_DURATION_IN_FRAMES],
			[1, 0],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			value: tickMappedValue,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(tickFrom.domainValue),
		};
	});

	return (
		// <Sequence from={startFrame} durationInFrames={durationInFrames}>
		<HtmlArea area={area} fill="black">
			{/* {xAxisSpecTo.labels.map((it) => {
				const labelMappedValue = xScaleCurrent(it.domainValue);

				return (
					<div
						key={it.id}
						style={{
							position: 'absolute',
							top: 80,
							left: labelMappedValue,
							transform: 'translateX(-50%)',
						}}
					>
						<TypographyStyle
							typographyStyle={tickLabelStyle}
							baseline={baseline}
						>
							<TextAnimationSubtle animateEnter>{it.label}</TextAnimationSubtle>
						</TypographyStyle>
					</div>
				);
			})} */}

			<svg overflow="visible" width={area.width} height={area.height}>
				{[...enterTicks, ...updateTicks, ...exitTicks].map((it, i) => {
					// const tickMappedValue = xScaleCurrent(it.domainValue);

					// const currentTickOpacity = getKeyFramesInterpolator(
					// 	keyframes,
					// 	[`TICK_ENTER_START__${it.id}`, `TICK_ENTER_END__${it.id}`],
					// 	[0, 1],
					// 	[Easing.ease]
					// );

					return (
						<g key={it.id}>
							<line
								x1={it.value}
								x2={it.value}
								y1={0}
								y2={40}
								stroke={theme.xAxis.tickColor}
								// strokeWidth={theme.xaxis.strokeWidth} // TODO activate again
								strokeWidth={5}
								opacity={it.opacity}
							/>
						</g>
					);
				})}

				<line
					x1={axisLine_x1}
					x2={axisLine_x2}
					opacity={axisLine_opacity}
					y1={0}
					y2={0}
					stroke={axisLine_color}
					strokeWidth={5}
				/>
			</svg>
		</HtmlArea>
		// </Sequence>
	);
};
