import {z} from 'zod';
import React from 'react';

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
	title: z.string(),
	subtitle: z.string(),
});

export const TitleWithSubtitleDevComposition: React.FC<
	z.infer<typeof titleWithSubtitleDevCompositionSchema>
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
				<TitleWithSubtitle theme={theme} title={title} subtitle={subtitle} />
			</div>
			<TitleWithSubtitleKeyframes theme={theme} />;
		</Page>
	);
};
