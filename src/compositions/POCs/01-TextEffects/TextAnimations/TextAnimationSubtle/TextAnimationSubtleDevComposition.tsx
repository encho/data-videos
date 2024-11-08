import {z} from 'zod';
import React from 'react';

import {PageContext} from '../../../../../acetti-components/PageContext';
import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	TextAnimationSubtle,
	TextAnimationSubtleKeyframes,
} from './TextAnimationSubtle';
import {Page} from '../../../03-Page/SimplePage/NewPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../../acetti-themes/getThemeFromEnum';
import {useVideoConfig} from 'remotion';

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
	const {width, height} = useVideoConfig();

	return (
		<PageContext width={width} height={height} margin={40} nrBaselines={40}>
			<Page theme={theme} show>
				{({baseline}) => {
					return (
						<>
							<div
								style={{
									width: 900,
									backgroundColor: theme.global.platteColor,
									overflow: 'hidden',
									marginBottom: baseline * 4,
								}}
							>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={baseline}
								>
									<TextAnimationSubtle
										innerDelayInSeconds={innerDelayInSeconds}
										translateY={baseline * translateYInPageBaselines}
									>
										{text}
									</TextAnimationSubtle>
								</TypographyStyle>
							</div>
							<TextAnimationSubtleKeyframes
								innerDelayInSeconds={innerDelayInSeconds}
								theme={theme}
							/>
						</>
					);
				}}
			</Page>
		</PageContext>
	);
};
