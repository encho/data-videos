import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {DataColors} from '../acetti-flics/DataColors';

export const colorPaletteSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI']),
});

export const ColorPalette: React.FC<z.infer<typeof colorPaletteSchema>> = ({
	themeEnum,
}) => {
	const {width} = useVideoConfig();
	// TODO integrate into colorpalette
	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	return (
		<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
			{/* TODO integrate title animated */}
			<DataColors dataColors={theme.dataColors} width={width} />
		</AbsoluteFill>
	);
};
