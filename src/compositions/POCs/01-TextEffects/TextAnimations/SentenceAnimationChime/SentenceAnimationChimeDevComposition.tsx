import {z} from 'zod';
import React from 'react';

import {PageContext} from '../../../../../acetti-components/PageContext';
import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	SentenceAnimationChime,
	SentenceAnimationChimeKeyframes,
} from './SentenceAnimationChime';
import {Page} from '../../../../../acetti-components/Page';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../../acetti-themes/getThemeFromEnum';
import {useVideoConfig} from 'remotion';

export const sentenceAnimationChimeDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	text: z.string(),
	innerDelayInSeconds: z.number(),
	translateYInPageBaselines: z.number(),
});

export const SentenceAnimationChimeDevComposition: React.FC<
	z.infer<typeof sentenceAnimationChimeDevCompositionSchema>
> = ({themeEnum, text, innerDelayInSeconds, translateYInPageBaselines}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	return (
		<PageContext
			width={width}
			height={height}
			margin={40}
			nrBaselines={40}
			theme={theme}
		>
			<Page>
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
									<SentenceAnimationChime
										innerDelayInSeconds={innerDelayInSeconds}
										translateY={baseline * translateYInPageBaselines}
									>
										{text}
									</SentenceAnimationChime>
								</TypographyStyle>
							</div>
							<SentenceAnimationChimeKeyframes
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
