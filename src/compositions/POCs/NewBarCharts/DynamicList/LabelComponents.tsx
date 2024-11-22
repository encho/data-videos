import {memo} from 'react';

import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export type TBarChartLabelComponent = React.ComponentType<{
	children: string;
	id: string;
	animateExit: boolean;
	animateEnter: boolean;
	baseline: number;
	theme: ThemeType;
}>;

export type TBarChartValueLabelComponent = React.ComponentType<{
	animateExit?: boolean;
	animateEnter?: boolean;
	baseline: number;
	theme: ThemeType;
	//
	id: string; // TODO deprecate
	value: number; // TODO deprecate
}>;

function formatPercentage(value: number): string {
	// Add a + sign for positive values, keep the sign for negative values
	const sign = value > 0 ? '+' : '';
	// Format the number with two decimal places and append %
	return `${sign}${value.toFixed(2)}%`;
}
// // Example usage
// console.log(formatPercentage(40.4)); // Output: "+40.40%"
// console.log(formatPercentage(-15.678)); // Output: "-15.68%"
// console.log(formatPercentage(0)); // Output: "0.00%"

export const DefaultValueLabelComponent = memo(
	({
		animateExit,
		animateEnter,
		baseline,
		theme,
		value,
	}: {
		// children: string;
		// id: string;
		baseline: number;
		theme: ThemeType;
		// eslint-disable-next-line
		animateEnter?: boolean;
		// eslint-disable-next-line
		animateExit?: boolean;
		value: number;
	}) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: value >= 0 ? 'flex-start' : 'flex-end',
					alignItems: 'center',
					height: '100%',
					// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
					textWrap: 'nowrap',
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizValueLabel}
					baseline={baseline}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
						animateExit={animateExit}
						animateEnter={animateEnter}
					>
						{formatPercentage(value)}
					</TextAnimationSubtle>
				</TypographyStyle>
			</div>
		);
	}
);
