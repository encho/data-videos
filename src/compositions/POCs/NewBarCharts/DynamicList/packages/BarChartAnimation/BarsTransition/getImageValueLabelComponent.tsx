import {memo} from 'react';
import invariant from 'tiny-invariant';
import {Img} from 'remotion';

import {TBarChartValueLabelComponent} from './ValueLabelComponent';
import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

function defaultNumberFormatter(value: number): string {
	return value.toLocaleString('en-GB', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export const getImageValueLabelComponent = ({
	numberFormatter = defaultNumberFormatter,
	imageMappings,
}: {
	imageMappings: {[id: string]: string};
	numberFormatter?: (value: number) => string;
}): TBarChartValueLabelComponent =>
	memo(
		({
			animateExit,
			animateEnter,
			baseline,
			theme,
			value,
			label,
			id,
		}: {
			id: string;
			value: number;
			label: string;
			// eslint-disable-next-line
			animateEnter?: boolean;
			// eslint-disable-next-line
			animateExit?: boolean;
			baseline: number;
			theme: ThemeType;
		}) => {
			const imageSrc = imageMappings[id];
			invariant(imageSrc);

			return (
				<div
					style={{
						display: 'flex',
						justifyContent: value >= 0 ? 'flex-start' : 'flex-end',
						flexDirection: value >= 0 ? 'row' : 'row-reverse',
						alignItems: 'center',
						height: '100%',
						// QUICK-FIX: for safety, as we are not measuring all interpolated values, just the from -and to values
						textWrap: 'nowrap',
						gap: baseline * 0.5,
					}}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0}
						translateY={baseline * 1.15}
						animateExit={animateExit}
						animateEnter={animateEnter}
					>
						<Img
							style={{
								borderRadius: '50%',
								width: baseline * 2,
								height: baseline * 2,
							}}
							src={imageSrc}
						/>
					</TextAnimationSubtle>

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
							{label}
						</TextAnimationSubtle>
					</TypographyStyle>

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
