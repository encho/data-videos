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

export const lastLogoPageDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	// title: z.string(),
	// subtitle: z.string(),
});

export const LastLogoPageDevComposition: React.FC<
	z.infer<typeof lastLogoPageDevCompositionSchema>
> = ({themeEnum}) => {
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
				<TitleWithSubtitle theme={theme} title={'LOGO'} subtitle={'LOGO'} />
			</div>
			<TitleWithSubtitleKeyframes theme={theme} />;
		</Page>
	);
};
