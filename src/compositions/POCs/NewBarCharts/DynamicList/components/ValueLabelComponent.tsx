import {memo, forwardRef} from 'react';

import {TextAnimationSubtle} from '../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {TBarChartItem} from '../useBarChartTransition';

type TValueLabelProps = {
	id: string;
	value: number;
	animateExit?: boolean;
	animateEnter?: boolean;
	baseline: number;
	theme: ThemeType;
};

export type TBarChartValueLabelComponent =
	React.ComponentType<TValueLabelProps>;

// TODO pass in from outside
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
		value: number;
		// eslint-disable-next-line
		animateEnter?: boolean;
		// eslint-disable-next-line
		animateExit?: boolean;
		baseline: number;
		theme: ThemeType;
	}) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: value >= 0 ? 'flex-start' : 'flex-end',
					alignItems: 'center',
					height: '100%',
					// QUICK-FIX: for safety, as we are not measuring all interpolated values, just the from -and to values
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

interface ValueLabelsDivProps {
	data: TBarChartItem[];
	theme: ThemeType;
	baseline: number;
	Component: TBarChartValueLabelComponent;
}

export const MeasureValueLabels = forwardRef<
	HTMLDivElement,
	ValueLabelsDivProps
>(({data, theme, baseline, Component}, ref) => {
	return (
		<div
			ref={ref}
			style={{
				position: 'fixed',
				left: '-9999px', // Move off-screen
				top: '-9999px',
				whiteSpace: 'nowrap', // Prevent labels from wrapping
				visibility: 'hidden',
			}}
		>
			{data.map((it, i) => (
				<Component
					key={it.id + i}
					id={it.id}
					theme={theme}
					baseline={baseline}
					animateEnter={false}
					animateExit={false}
					value={it.value}
				/>
			))}
		</div>
	);
});

MeasureValueLabels.displayName = 'MeasureValueLabels';
