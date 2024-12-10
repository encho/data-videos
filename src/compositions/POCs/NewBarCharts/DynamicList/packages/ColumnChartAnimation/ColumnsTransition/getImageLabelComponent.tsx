import {memo} from 'react';
import {Img} from 'remotion';
import invariant from 'tiny-invariant';

import {TextAnimationSubtle} from '../../../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';
import {TBarChartLabelComponent} from './LabelComponent';

export const getImageLabelComponent = ({
	imageMappings,
}: {
	imageMappings: {[id: string]: string};
}): TBarChartLabelComponent =>
	memo(
		({
			// eslint-disable-next-line
			id,
			label,
			animateExit,
			animateEnter,
			baseline,
			theme,
		}: {
			label: string;
			id: string;
			baseline: number;
			theme: ThemeType;
			// eslint-disable-next-line
			animateEnter?: boolean;
			// eslint-disable-next-line
			animateExit?: boolean;
		}) => {
			const imageSrc = imageMappings[id];
			invariant(imageSrc);

			return (
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						height: '100%',
						// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
						textWrap: 'nowrap',
						gap: baseline * 0.5,
					}}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.datavizLabel}
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
				</div>
			);
		}
	);
