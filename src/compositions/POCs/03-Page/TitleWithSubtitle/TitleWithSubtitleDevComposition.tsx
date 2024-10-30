import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

import {
	TitleWithSubtitle,
	TitleWithSubtitleKeyframes,
} from './TitleWithSubtitle';
import {Page} from '../SimplePage/ThemePage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const titleWithSubtitleDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TitleWithSubtitleDevComposition: React.FC<
	z.infer<typeof titleWithSubtitleDevCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {height} = useVideoConfig();

	return (
		<Page theme={theme}>
			<div
				style={{
					width: 900,
					// height: 300,
					// padding: 50,
					backgroundColor: theme.global.platteColor,
					// overflow: 'visible',
					// overflow: 'visible',
					overflow: 'hidden',
					marginBottom: height / 20,
				}}
			>
				<TitleWithSubtitle theme={theme} title="Title" subtitle="Subtitle" />
			</div>
			<TitleWithSubtitleKeyframes theme={theme} />;
		</Page>
	);
};
