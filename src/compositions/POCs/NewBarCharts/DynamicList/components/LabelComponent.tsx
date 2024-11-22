import {memo} from 'react';

import {TextAnimationSubtle} from '../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';

export type TBarChartLabelComponent = React.ComponentType<{
	children: string;
	id: string;
	animateExit: boolean;
	animateEnter: boolean;
	baseline: number;
	theme: ThemeType;
}>;

export const DefaultLabelComponent = memo(
	({
		// eslint-disable-next-line
		id,
		children,
		animateExit,
		animateEnter,
		baseline,
		theme,
	}: {
		children: string;
		id: string;
		baseline: number;
		theme: ThemeType;
		// eslint-disable-next-line
		animateEnter?: boolean;
		// eslint-disable-next-line
		animateExit?: boolean;
	}) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					height: '100%',
					// QUICK-FIX: would not be neeed actually, why is text wrapping in some cases??
					textWrap: 'nowrap',
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
						{children}
					</TextAnimationSubtle>
				</TypographyStyle>
			</div>
		);
	}
);
