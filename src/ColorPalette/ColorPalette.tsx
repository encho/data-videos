import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {useVideoConfig} from 'remotion';
import chroma from 'chroma-js';

import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
// import {ThemeDataColors} from '../acetti-flics/ThemeDataColors';
import {ColorsList} from '../acetti-flics/ColorsList';
// import {SubtleSlideIn, } from './SubtleSlideIn';
import {TitleSlide} from './TitleSlide';

// TODO into global components acetti-components
import {Position} from '../AnimatedLineChartScaleBand/components/Position';

export const colorPaletteSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI']),
});

const colorBrewerKeys = Object.keys(chroma.brewer);

const colorsLists = colorBrewerKeys.map((colorBrewerKey) => {
	const colors = chroma.scale(colorBrewerKey).colors(11);
	const colorsList = colors.map((it, i) => {
		return {label: colorBrewerKey, color: it};
	});
	return {name: colorBrewerKey, colorsList};
});

export const ColorPalette: React.FC<z.infer<typeof colorPaletteSchema>> = ({
	themeEnum,
}) => {
	const {width, durationInFrames} = useVideoConfig();
	// TODO integrate into colorpalette
	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	const titleSlideDuration = 200;

	return (
		<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
			<Sequence from={0} durationInFrames={titleSlideDuration}>
				{/* TODO title colors, subtitle colors, font family in theme */}
				<Position position={{top: 100, left: 100}}>
					<TitleSlide
						titleColor={theme.xAxis.tickColor}
						title="Data Viz Color Palettes"
						subTitle="Color Brewer Palettes with chroma.js"
						titleFontSize={90}
						subTitleFontSize={40}
					/>
				</Position>
			</Sequence>

			<Sequence
				from={titleSlideDuration}
				durationInFrames={durationInFrames - titleSlideDuration}
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
					{colorsLists.map((colorsList, i) => {
						return (
							<div>
								<h1 style={{color: 'white', fontSize: 20}}>
									{colorsList.name}
								</h1>
								<ColorsList
									key={i}
									colorsList={colorsList.colorsList}
									width={width}
								/>
							</div>
						);
					})}
				</div>
			</Sequence>
		</AbsoluteFill>
	);
};
