import {z} from 'zod';
import React from 'react';

// TODO LastLogoPageContentContent rather
import {
	LastLogoPageContent,
	LastLogoPageContentKeyframes,
} from './LastLogoPage';
import {Page} from '../SimplePage/ThemePage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const lastLogoPageContentDevCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const LastLogoPageContentDevComposition: React.FC<
	z.infer<typeof lastLogoPageContentDevCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<Page theme={theme}>
			<div
				style={{
					width: theme.page.contentWidth,
					height: theme.page.contentHeight / 2,
					backgroundColor: theme.global.platteColor,
					overflow: 'hidden',
					marginBottom: theme.page.baseline * 4,
				}}
			>
				<LastLogoPageContent theme={theme} baseline={theme.page.baseline * 2} />
			</div>
			<LastLogoPageContentKeyframes
				theme={theme}
				width={theme.page.contentWidth}
			/>
			;
		</Page>
	);
};
