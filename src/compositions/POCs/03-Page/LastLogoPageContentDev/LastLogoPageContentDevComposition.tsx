import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

// TODO LastLogoPageContentContent rather
import {PageContext} from '../../../../acetti-components/PageContext';
import {
	LastLogoPageContent,
	LastLogoPageContentKeyframes,
} from './LastLogoPage';
import {Page} from '../../../../acetti-components/Page';
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
	const {width, height} = useVideoConfig();

	return (
		<PageContext margin={50} nrBaselines={40} width={width} height={height}>
			<Page theme={theme} show>
				{({baseline, contentWidth, contentHeight}) => {
					return (
						<>
							<div
								style={{
									width: contentWidth,
									height: contentHeight / 2,
									backgroundColor: theme.global.platteColor,
									overflow: 'hidden',
									marginBottom: baseline * 4,
								}}
							>
								<LastLogoPageContent theme={theme} baseline={baseline * 2} />
							</div>
							<LastLogoPageContentKeyframes
								theme={theme}
								width={contentWidth}
							/>
						</>
					);
				}}
			</Page>
		</PageContext>
	);
};
