import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';

export const textMaskCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TextMaskComposition: React.FC<
	z.infer<typeof textMaskCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Text Mask</SlideTitle>

			{/* <Position position={{top: 100, left: 100}}></Position> */}
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
