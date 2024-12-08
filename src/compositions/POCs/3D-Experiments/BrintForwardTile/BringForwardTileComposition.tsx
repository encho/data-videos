import {useVideoConfig} from 'remotion';
import {z} from 'zod';

import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TilesAnimation} from './TilesAnimation';

export const bringForwardTileCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	themeEnumPlatte: zThemeEnum,
});

export const BringForwardTileComposition: React.FC<
	z.infer<typeof bringForwardTileCompositionSchema>
> = ({themeEnum, themeEnumPlatte}) => {
	const {width, height} = useVideoConfig();

	const theme = useThemeFromEnum(themeEnum);
	const themePlatte = useThemeFromEnum(themeEnumPlatte);

	return (
		<div style={{width, height, backgroundColor: theme.global.backgroundColor}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<PageContext
					margin={80}
					nrBaselines={50}
					width={width}
					height={height}
					theme={themePlatte}
				>
					<TilesAnimation width={width} height={height}>
						<Page boxShadow borderRadius={5}>
							{({baseline, theme}) => {
								return (
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Platte Content Here...
									</TypographyStyle>
								);
							}}
						</Page>
					</TilesAnimation>
				</PageContext>
			</div>
		</div>
	);
};
