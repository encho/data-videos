import {memo, forwardRef} from 'react';

import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';
import {TColumnChartItem} from '../useColumnChartTransition/useColumnChartTransition';

type TValueLabelProps = {
	id: string;
	label: string;
	value: number;
	animateExit?: boolean;
	animateEnter?: boolean;
	baseline: number;
	theme: ThemeType;
};

export type TBarChartValueLabelComponent =
	React.ComponentType<TValueLabelProps>;

function defaultNumberFormatter(value: number): string {
	return value.toLocaleString('en-GB', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export const getDefaultValueLabelComponent = ({
	numberFormatter = defaultNumberFormatter,
}: {
	numberFormatter?: (value: number) => string;
}) =>
	memo(
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
						justifyContent: 'center',
						alignItems: 'center',
						// QUICK-FIX: for safety, as we are not measuring all interpolated values, just the from -and to values
						textWrap: 'nowrap',
						backgroundColor: 'rgba(255,0,255,0.2)',
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
							{numberFormatter(value)}
						</TextAnimationSubtle>
					</TypographyStyle>
				</div>
			);
		}
	);

interface ValueLabelsDivProps {
	data: TColumnChartItem[];
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
			<div style={{display: 'flex', flexDirection: 'row'}}>
				{data.map((it, i) => (
					<Component
						key={it.id + i}
						id={it.id}
						label={it.label}
						theme={theme}
						baseline={baseline}
						animateEnter={false}
						animateExit={false}
						value={it.value}
					/>
				))}
			</div>
		</div>
	);
});

MeasureValueLabels.displayName = 'MeasureValueLabels';
