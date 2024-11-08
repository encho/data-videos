import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';
import {
	TitleWithSubtitle,
	TitleWithSubtitleKeyframes,
} from './TitleWithSubtitle';
import {Page} from '../../../../acetti-components/Page';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const titleWithSubtitleDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
});

export const TitleWithSubtitleDevComposition: React.FC<
	z.infer<typeof titleWithSubtitleDevCompositionSchema>
> = ({themeEnum, title, subtitle}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {width, height} = useVideoConfig();

	const INNER_DELAY_SECONDS = 1;

	return (
		<PageContext margin={50} nrBaselines={40} width={width} height={height}>
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
								<TitleWithSubtitle
									theme={theme}
									title={title}
									subtitle={subtitle}
									innerDelayInSeconds={INNER_DELAY_SECONDS}
								/>
							</div>
							<TitleWithSubtitleKeyframes
								theme={theme}
								innerDelayInSeconds={INNER_DELAY_SECONDS}
							/>
						</>
					);
				}}
			</Page>
		</PageContext>
	);
};
