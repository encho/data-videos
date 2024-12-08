import {z} from 'zod';
import React from 'react';
import {isNumber} from 'lodash';

import {SentenceAnimationChime} from '../../01-TextEffects/TextAnimations/SentenceAnimationChime/SentenceAnimationChime';
import {usePage} from '../../../../acetti-components/PageContext';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';

export const titleWithSubtitleDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TitleWithSubtitle: React.FC<{
	theme?: ThemeType;
	title: string;
	subtitle: string;
	baseline?: number;
	innerDelayInSeconds?: number;
	subtitleInnerDelayInSeconds?: number;
	animateEnter?: boolean;
	animateExit?: boolean;
}> = ({
	theme: themeProp,
	title,
	subtitle,
	baseline: baselineProp,
	innerDelayInSeconds = 0,
	subtitleInnerDelayInSeconds,
	animateEnter = true,
	animateExit = true,
}) => {
	const page = usePage();

	const baseline = baselineProp || page.baseline;
	const theme = themeProp || page.theme;

	const SUBTITLE_INNER_DELAY_IN_SECONDS = isNumber(subtitleInnerDelayInSeconds)
		? innerDelayInSeconds
		: innerDelayInSeconds + 1;

	return (
		<div>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				style={{
					textWrap: 'balance',
				}}
				marginBottom={4}
			>
				<SentenceAnimationChime
					innerDelayInSeconds={innerDelayInSeconds}
					translateY={baseline * 1.1}
					animateEnter={animateEnter}
					animateExit={animateExit}
				>
					{title}
				</SentenceAnimationChime>
			</TypographyStyle>

			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h2}
				baseline={baseline}
				style={{
					textWrap: 'balance',
				}}
			>
				<SentenceAnimationChime
					innerDelayInSeconds={SUBTITLE_INNER_DELAY_IN_SECONDS}
					translateY={baseline * 1.1}
					animateEnter={animateEnter}
					animateExit={animateExit}
				>
					{subtitle}
				</SentenceAnimationChime>
			</TypographyStyle>
		</div>
	);
};
