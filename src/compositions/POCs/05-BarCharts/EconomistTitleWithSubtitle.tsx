import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TypographyStyle} from '../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
	baseline?: number;
}> = ({title, subtitle, theme, baseline: baselineProp}) => {
	const titleMarginBottomInBaselines = 3;

	const baseline = baselineProp || theme.page.baseline;

	return (
		<div
			style={{
				textWrap: 'balance',
			}}
		>
			<div>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={baseline}
					marginBottom={titleMarginBottomInBaselines}
				>
					{title}
				</TypographyStyle>
			</div>
			<div>
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
