import {z} from 'zod';
import {Img} from 'remotion';

import {DissolveExitFilter} from './DissolveExitFilter';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const svgFilterCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SvgFilterComposition: React.FC<
	z.infer<typeof svgFilterCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={30}
			>
				Svg Filter
			</TypographyStyle>
			<DissolveExitFilter seedString="hehehe">
				{({filterUrl}) => {
					return (
						<Img
							src="https://img.freepik.com/free-photo/green-paint-wall-background-texture_53876-23269.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1728518400&semt=ais_hybrid"
							style={{
								width: '80%',
								height: 'auto',
								borderRadius: '16px',
								filter: filterUrl,
							}}
						/>
					);
				}}
			</DissolveExitFilter>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
