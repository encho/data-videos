import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import chroma from 'chroma-js';

import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
// import {ThemeDataColors} from '../acetti-flics/ThemeDataColors';
import {ColorsList} from '../acetti-flics/ColorsList';

export const colorPaletteSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI']),
});

const colorBrewerKeys = Object.keys(chroma.brewer);

const colorsLists = colorBrewerKeys.map((colorBrewerKey) => {
	const colors = chroma.scale(colorBrewerKey).colors(11);
	const colorsList = colors.map((it, i) => {
		return {label: colorBrewerKey, color: it};
	});
	return colorsList;
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
			{/* <ThemeDataColors dataColors={theme.dataColors} width={width} /> */}
			<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
				{/* <ThemeDataColors dataColors={nerdyTheme.dataColors} width={width} />
				<ThemeDataColors dataColors={nerdyTheme.dataColors} width={width} />
				<ThemeDataColors
					dataColors={lorenzobertoliniTheme.dataColors}
					width={width}
				/> */}
				{/* <ColorsList colorsList={colorsList_1} width={width} />
				<ColorsList colorsList={colorsList_2} width={width} />
				<ColorsList colorsList={colorsList_3} width={width} /> */}
				{colorsLists.map((colorsList, i) => {
					return <ColorsList key={i} colorsList={colorsList} width={width} />;
				})}
				{/* <div style={{color: 'red', fontSize: 20}}>{JSON.stringify(test)}</div> */}
			</div>
		</AbsoluteFill>
	);
};
