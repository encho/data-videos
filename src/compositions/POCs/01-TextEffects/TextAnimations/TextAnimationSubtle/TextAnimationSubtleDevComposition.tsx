import {z} from 'zod';
import React from 'react';

import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	TextAnimationSubtle,
	TextAnimationSubtleKeyframes,
} from './TextAnimationSubtle';
import {Page} from '../../../03-Page/SimplePage/ThemePage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../../acetti-themes/getThemeFromEnum';

export const textAnimationSubtleDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
});

export const TextAnimationSubtleDevComposition: React.FC<
	z.infer<typeof textAnimationSubtleDevCompositionSchema>
> = ({themeEnum, title, subtitle}) => {
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<Page theme={theme}>
			<div
				style={{
					width: 900,
					backgroundColor: theme.global.platteColor,
					overflow: 'hidden',
					marginBottom: theme.page.baseline * 4,
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={theme.page.baseline}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0.5}
						translateY={theme.page.baseline * 2}
					>
						{title}
					</TextAnimationSubtle>
				</TypographyStyle>

				{/* <TextAnimationSubtle theme={theme}>{title}</TextAnimationSubtle> */}
			</div>
			<TextAnimationSubtleKeyframes innerDelayInSeconds={0.5} />;
		</Page>
	);
};
