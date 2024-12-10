import React from 'react';
import {ScaleLinear} from 'd3-scale';
import {interpolate, useVideoConfig} from 'remotion';
import invariant from 'tiny-invariant';

import {getStyles} from '../getStyles_XAxis';
import {getEnterUpdateExits} from '../../../../../../../../acetti-ts-utils/utils';
import {TypographyStyle} from '../../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TGridLayoutArea} from '../../../../../../../../acetti-layout';
import {HtmlArea} from '../../../../../../../../acetti-layout';
import {ThemeType} from '../../../../../../../../acetti-themes/themeTypes';
import {TextAnimationSubtle} from '../../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

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

	const styles = getStyles({theme, baseline});

	const FADE_IN_OUT_DURATION_IN_FRAMES = Math.min(
		Math.floor(fps * 0.75),
		durationInFrames
	);

	const axisLine_x1 = 0;
	const axisLine_x2 = area.width;
	const axisLine_opacity = 1;

	const ticksEnterUpdateExits = getEnterUpdateExits(
		xAxisSpecFrom.ticks.map((it) => it.id),
		xAxisSpecTo.ticks.map((it) => it.id)
	);

	const labelsEnterUpdateExits = getEnterUpdateExits(
		xAxisSpecFrom.labels.map((it) => it.id),
		xAxisSpecTo.labels.map((it) => it.id)
	);

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

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const labelTo = getLabel(xAxisSpecTo, labelId);
		const labelMappedValue = xScaleCurrent(labelTo.domainValue);

		return {
			id: labelId,
			label: labelTo.label,
			value: labelMappedValue,
			opacity: getOpacityNearVisibleBoundary(labelTo.domainValue),
		};
	});

	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const tickTo = getTick(xAxisSpecTo, tickId);
		const tickMappedValue = xScaleCurrent(tickTo.domainValue);

		return {
			id: tickId,
			value: tickMappedValue,
			opacity: getOpacityNearVisibleBoundary(tickTo.domainValue),
		};
	});

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const labelTo = getLabel(xAxisSpecTo, labelId);
		const labelMappedValue = xScaleCurrent(labelTo.domainValue);

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
			id: labelId,
			label: labelTo.label,
			value: labelMappedValue,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(labelTo.domainValue),
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

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const labelFrom = getLabel(xAxisSpecFrom, labelId);
		const labelMappedValue = xScaleCurrent(labelFrom.domainValue);

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
			id: labelId,
			label: labelFrom.label,
			value: labelMappedValue,
			opacity:
				interpolatedOpacity *
				getOpacityNearVisibleBoundary(labelFrom.domainValue),
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
		<HtmlArea area={area}>
			{[...updateLabels, ...enterLabels, ...exitLabels].map((it) => {
				return (
					<div
						key={it.id}
						style={{
							position: 'absolute',
							top: styles.tickLabel.top,
							left: it.value,
							transform: 'translateX(-50%)',
							opacity: it.opacity,
						}}
					>
						<TypographyStyle
							typographyStyle={styles.tickLabel.typographyStyle}
							baseline={baseline}
						>
							<TextAnimationSubtle animateEnter>{it.label}</TextAnimationSubtle>
						</TypographyStyle>
					</div>
				);
			})}

			<svg overflow="visible" width={area.width} height={area.height}>
				{[...enterTicks, ...updateTicks, ...exitTicks].map((it, i) => {
					return (
						<g key={it.id}>
							<line
								opacity={it.opacity}
								x1={it.value}
								x2={it.value}
								y1={0}
								y2={styles.tick.size}
								stroke={styles.tick.color}
								strokeWidth={styles.tick.strokeWidth}
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
					stroke={styles.line.color}
					strokeWidth={styles.line.strokeWidth}
				/>
			</svg>
		</HtmlArea>
	);
};
