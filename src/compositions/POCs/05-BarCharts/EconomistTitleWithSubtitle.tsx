import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TypographyStyle} from '../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
	pageMarginTop?: number;
	pageMarginLeft?: number;
	pageMarginRight?: number;
	baseline?: number;
}> = ({
	title,
	subtitle,
	theme,
	baseline = 18,
	pageMarginLeft = 2 * 18,
	pageMarginRight = 2 * 18,
	pageMarginTop = 2 * 18,
}) => {
	const titleMarginBottomInBaselines = 2;
	const elementPaddingBottom = baseline * 4;

	// const className = `blah-${Math.random().toString(36).substring(7)}`;

	// Create the CSS styles as a string
	// const style = `
	// 	 .${className}::before {
	// 		 content: '';
	// 		 position: absolute;
	// 		 top: -10px;
	// 		left: -10px;
	// 		right: -10px;
	// 		bottom: -10px;
	// 		outline: 10px solid red; /* 5px solid border */
	// 		pointer-events: none; /* Allows clicks to pass through */
	// 	 }
	//  `;

	return (
		<>
			{/* <style>{style}</style> */}

			<div
				// className={className}
				style={{
					paddingBottom: elementPaddingBottom,
					backgroundColor: 'rgba(255,0,255,0.3)',
					position: 'relative',
					// outline: `5px solid rgba(255,0,255,0.8)`,
					// border: `10px solid rgba(255,0,255,0.8)`,
					// boxSizing: 'border-box',
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
						marginBottom={titleMarginBottomInBaselines}
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
		</>
	);
};
