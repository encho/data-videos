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
	text: z.string(),
	innerDelayInSeconds: z.number(),
	translateYInPageBaselines: z.number(),
});

export const TextAnimationSubtleDevComposition: React.FC<
	z.infer<typeof textAnimationSubtleDevCompositionSchema>
> = ({themeEnum, text, innerDelayInSeconds, translateYInPageBaselines}) => {
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
						innerDelayInSeconds={innerDelayInSeconds}
						translateY={theme.page.baseline * translateYInPageBaselines}
					>
						{text}
					</TextAnimationSubtle>
				</TypographyStyle>
			</div>
			<TextAnimationSubtleKeyframes innerDelayInSeconds={innerDelayInSeconds} />
			;
		</Page>
	);
};
