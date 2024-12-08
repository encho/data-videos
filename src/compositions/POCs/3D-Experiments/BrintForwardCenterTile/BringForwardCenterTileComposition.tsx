import {useVideoConfig} from 'remotion';
import {z} from 'zod';

import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {BringForwardCenterTile} from './BringForwardCenterTile';

export const bringForwardCenterTileCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	themeEnumPlatte: zThemeEnum,
});

export const BringForwardCenterTileComposition: React.FC<
	z.infer<typeof bringForwardCenterTileCompositionSchema>
> = ({themeEnum, themeEnumPlatte}) => {
	const {width, height} = useVideoConfig();

	const theme = useThemeFromEnum(themeEnum);
	const themePlatte = useThemeFromEnum(themeEnumPlatte);

	return (
		<div style={{width, height, backgroundColor: theme.global.backgroundColor}}>
			<PageContext
				margin={80}
				nrBaselines={50}
				width={width}
				height={height}
				theme={themePlatte}
			>
				<BringForwardCenterTile
					centerTile={() => {
						return (
							<Page boxShadow borderRadius={5}>
								{({baseline, theme}) => {
									return (
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h1}
											baseline={baseline}
											marginBottom={7}
										>
											Center Tile
										</TypographyStyle>
									);
								}}
							</Page>
						);
					}}
					rightTile={() => {
						return (
							<Page boxShadow borderRadius={5}>
								{({baseline, theme}) => {
									return (
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h1}
											baseline={baseline}
											marginBottom={7}
										>
											Right Tile
										</TypographyStyle>
									);
								}}
							</Page>
						);
					}}
					leftTile={() => {
						return (
							<Page boxShadow borderRadius={5}>
								{({baseline, theme}) => {
									return (
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h1}
											baseline={baseline}
											marginBottom={7}
										>
											Left Tile
										</TypographyStyle>
									);
								}}
							</Page>
						);
					}}
				/>
			</PageContext>
		</div>
	);
};
