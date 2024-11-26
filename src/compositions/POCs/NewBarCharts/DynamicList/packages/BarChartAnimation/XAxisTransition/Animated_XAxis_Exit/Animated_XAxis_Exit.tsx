import React from 'react';
import {ScaleLinear} from 'd3-scale';
import {Easing, useVideoConfig, Sequence} from 'remotion';

import {getStyles} from '../getStyles';
import {
	getKeyFrame,
	getKeyFramesInterpolator,
} from '../../../../../../Keyframes/Keyframes/keyframes';
import {getKeyframes} from './getKeyframes';
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

export const Animated_XAxis_Exit: React.FC<{
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
	startFrame, // the startFrame of the current animation
}) => {
	const {fps} = useVideoConfig();

	const styles = getStyles({theme, baseline});

	const tickLabelStyle = theme.typography.textStyles.datavizTickLabel;

	const keyframes = getKeyframes({durationInFrames, fps, xAxisSpec});

	const axisLine_x2 = area.width;

	const axisLine_x1 = getKeyFramesInterpolator(
		keyframes,
		['AXIS_LINE_EXIT_START', 'AXIS_LINE_EXIT_END'],
		[0, area.width],
		[Easing.ease]
	)(frame);

	const axisLine_opacity = getKeyFramesInterpolator(
		keyframes,
		['AXIS_LINE_EXIT_START', 'AXIS_LINE_EXIT_END'],
		[1, 0],
		[Easing.ease]
	)(frame);

	const axisLine_color = theme.xAxis.color;

	return (
		<Sequence from={startFrame} durationInFrames={durationInFrames}>
			<HtmlArea area={area}>
				{xAxisSpec.labels.map((it) => {
					const labelMappedValue = xScaleCurrent(it.domainValue);

					const keyframe_label_disappear = getKeyFrame(
						keyframes,
						'LABEL_DISAPPEAR__' + it.id
					);

					return (
						<Sequence durationInFrames={keyframe_label_disappear.frame}>
							<div
								key={it.id}
								style={{
									position: 'absolute',
									top: styles.tickLabel.top,
									left: labelMappedValue,
									transform: 'translateX(-50%)',
								}}
							>
								<TypographyStyle
									typographyStyle={tickLabelStyle}
									baseline={baseline}
								>
									<TextAnimationSubtle animateExit animateEnter={false}>
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
							[`TICK_EXIT_START__${it.id}`, `TICK_EXIT_END__${it.id}`],
							[1, 0],
							[Easing.ease]
						);

						return (
							<g key={i}>
								<line
									opacity={currentTickOpacity(frame)}
									x1={tickMappedValue}
									x2={tickMappedValue}
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
		</Sequence>
	);
};
