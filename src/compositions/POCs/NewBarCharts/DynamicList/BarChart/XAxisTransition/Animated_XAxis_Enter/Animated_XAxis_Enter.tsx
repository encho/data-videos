import React from 'react';
import {ScaleLinear} from 'd3-scale';
import {interpolate, Easing, useVideoConfig, Sequence} from 'remotion';

import {
	getKeyFrame,
	getKeyFramesInterpolator,
} from '../../../../../Keyframes/Keyframes/keyframes';
import {getKeyframes} from './getKeyframes';
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

export const Animated_XAxis_Enter: React.FC<{
	area: TGridLayoutArea;
	xScaleCurrent: ScaleLinear<number, number>;
	theme: ThemeType;
	xAxisSpec: TXAxisSpec;
	baseline: number;
	frame: number;
	durationInFrames: number;
	startFrame: number;
}> = ({
	area,
	xScaleCurrent,
	theme,
	xAxisSpec,
	baseline,
	frame,
	durationInFrames,
	startFrame,
}) => {
	const {fps} = useVideoConfig();

	const tickLabelStyle = theme.typography.textStyles.datavizTickLabel;

	const keyframes = getKeyframes({durationInFrames, fps, xAxisSpec});

	const axisLine_x1 = 0;

	const axisLine_x2 = getKeyFramesInterpolator(
		keyframes,
		['AXIS_LINE_ENTER_START', 'AXIS_LINE_ENTER_END'],
		[0, area.width],
		[Easing.ease]
	)(frame);

	const axisLine_opacity = getKeyFramesInterpolator(
		keyframes,
		['AXIS_LINE_ENTER_START', 'AXIS_LINE_ENTER_END'],
		[0, 1],
		[Easing.ease]
	)(frame);

	const axisLine_color = theme.xAxis.color;

	return (
		<Sequence from={startFrame} durationInFrames={durationInFrames}>
			<HtmlArea area={area} fill="black">
				{xAxisSpec.labels.map((it) => {
					const labelMappedValue = xScaleCurrent(it.domainValue);

					const keyframe_label_appear = getKeyFrame(
						keyframes,
						'LABEL_APPEAR__' + it.id
					);

					return (
						<Sequence from={keyframe_label_appear.frame}>
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
									<TextAnimationSubtle animateEnter>
										{it.label}
									</TextAnimationSubtle>
								</TypographyStyle>
							</div>
						</Sequence>
					);
				})}

				<svg overflow="visible" width={area.width} height={area.height}>
					{xAxisSpec.ticks.map((it, i) => {
						const tickMappedValue = xScaleCurrent(it.domainValue);

						const currentTickOpacity = getKeyFramesInterpolator(
							keyframes,
							[`TICK_ENTER_START__${it.id}`, `TICK_ENTER_END__${it.id}`],
							[0, 1],
							[Easing.ease]
						);

						return (
							<g key={i}>
								<line
									x1={tickMappedValue}
									x2={tickMappedValue}
									y1={0}
									y2={40}
									stroke={theme.xAxis.tickColor}
									// strokeWidth={theme.xaxis.strokeWidth} // TODO activate again
									strokeWidth={5}
									opacity={currentTickOpacity(frame)}
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
		</Sequence>
	);
};
