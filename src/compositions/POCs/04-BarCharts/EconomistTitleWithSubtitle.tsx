import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TypographyStyle} from '../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
}> = ({title, subtitle, theme}) => {
	const baseline = 18;
	const pageMarginLeft = baseline * 2;
	const pageMarginRight = baseline * 2;
	const pageMarginTop = baseline * 2;
	const elementPaddingBottom = baseline * 3;

	return (
		<div
			style={{
				paddingBottom: elementPaddingBottom,
			}}
		>
			<div
				style={{
					marginLeft: pageMarginLeft,
					marginRight: pageMarginRight,
					paddingTop: pageMarginTop,
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={baseline}
					marginBottom={6}
				>
					{title}
				</TypographyStyle>
			</div>
			<div style={{marginLeft: pageMarginLeft}}>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h2}
					baseline={baseline}
				>
					{subtitle}
				</TypographyStyle>
			</div>
		</div>
	);
};
