import {FadeInAndOutText} from '../../../acetti-typography/TextEffects/FadeInAndOutText';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TypographyStyle} from './TextStyles/TextStylesComposition';

export const SlideTitle: React.FC<{children: string; theme: ThemeType}> = ({
	children,
	theme,
}) => {
	// TODO implement!!!
	// const baseline = useBaseline();
	const baseline = 20;

	return (
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				marginBottom={4}
				marginTop={5}
			>
				<FadeInAndOutText>{children}</FadeInAndOutText>
			</TypographyStyle>
		</div>
	);
};
