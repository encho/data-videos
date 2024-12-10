import React from 'react';
import invariant from 'tiny-invariant';

import {HtmlArea} from '../../../../../../../acetti-layout';
import {RoundedRightRect, RoundedLeftRect} from './RoundedRect/RoundedRect';
import {
	THorizontalBarComponentProps,
	THorizontalBarComponent,
} from './VerticalBar';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export function getHorizontalBarWithLabelAndValue({
	valueLabelFormatter,
}: {
	valueLabelFormatter: (x: number) => string;
}): THorizontalBarComponent {
	const HorizontalBarWithLabelAndValue: React.FC<
		THorizontalBarComponentProps
	> = ({
		area,
		valueFrom,
		valueTo,
		currentValue,
		currentColor,
		xScale,
		baseline,
		label,
		theme,
		animateEnter,
		animateExit,
	}) => {
		invariant(
			valueFrom || valueTo,
			'HorzontalBarWIthLabelAndValue: Either valueFrom or valueTo have to be passed!'
		);

		const zeroLine_x = xScale(0);

		const barRadius = baseline / 4;

		const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x);

		const relativeBarPositions = {
			y: 0,
			x: currentValue >= 0 ? zeroLine_x : zeroLine_x - currentBarWidth,
			height: area.height,
			width: currentBarWidth,
		};

		const barColor = currentColor;
		// const barColor = '#333';

		const startsPositively =
			valueFrom && valueFrom > 0 ? true : !valueFrom && valueTo && valueTo > 0;

		return (
			<HtmlArea area={area} style={{position: 'relative'}}>
				<svg width={area.width} height={area.height}>
					{currentValue > 0 && area.width ? (
						<RoundedRightRect
							y={relativeBarPositions.y}
							x={relativeBarPositions.x}
							height={relativeBarPositions.height}
							width={relativeBarPositions.width}
							fill={barColor}
							radius={barRadius}
						/>
					) : currentValue < 0 && area.width ? (
						<RoundedLeftRect
							y={relativeBarPositions.y}
							x={relativeBarPositions.x}
							height={relativeBarPositions.height}
							width={relativeBarPositions.width}
							fill={barColor}
							radius={barRadius}
						/>
					) : null}
				</svg>

				<div
					style={{
						position: 'absolute',
						top: 0,
						left:
							currentValue > 0 || startsPositively
								? zeroLine_x + baseline
								: zeroLine_x - baseline,
						height: '100%',
						display: 'flex',
						justifyContent: 'start',
						alignItems: 'center',
						transform:
							currentValue > 0 || startsPositively ? '' : `translateX(-100%)`,
					}}
				>
					<div
						style={{display: 'flex', gap: baseline * 0.5, alignItems: 'center'}}
					>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.datavizLabel}
							baseline={baseline * 0.8}
						>
							<TextAnimationSubtle
								innerDelayInSeconds={animateEnter ? 1.5 : 0}
								translateY={baseline * 1.15}
								animateExit={animateExit}
								animateEnter={animateEnter}
							>
								{label}
							</TextAnimationSubtle>
						</TypographyStyle>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.datavizValueLabel}
							baseline={baseline}
							color={theme.typography.textStyles.datavizLabel.color}
						>
							<TextAnimationSubtle
								innerDelayInSeconds={animateEnter ? 1.5 : 0}
								translateY={baseline * 1.15}
								animateExit={animateExit}
								animateEnter={animateEnter}
							>
								{valueLabelFormatter(currentValue)}
							</TextAnimationSubtle>
						</TypographyStyle>
					</div>
				</div>
			</HtmlArea>
		);
	};

	return HorizontalBarWithLabelAndValue;
}
