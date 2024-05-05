import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {useVideoConfig} from 'remotion';
import chroma from 'chroma-js';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
// import {flip} from '@remotion/transitions/flip';
import {slide} from '@remotion/transitions/slide';

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
			<TransitionSeries>
				{/* @ts-ignore */}
				<TransitionSeries.Sequence durationInFrames={titleSlideDuration}>
					<Position position={{top: 100, left: 100}}>
						<TitleSlide
							titleColor={theme.xAxis.tickColor}
							title="Data Viz Color Palettes"
							subTitle="Color Brewer Palettes with chroma.js"
							titleFontSize={90}
							subTitleFontSize={40}
						/>
					</Position>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={linearTiming({durationInFrames: 30})}
				/>
				{/* <TransitionSeries.Transition
					presentation={flip()}
					timing={linearTiming({durationInFrames: 30})}
				/> */}
				{/* @ts-ignore */}
				<TransitionSeries.Sequence
					durationInFrames={durationInFrames - 30 - titleSlideDuration}
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
				</TransitionSeries.Sequence>
			</TransitionSeries>

			{/* <Sequence from={0} durationInFrames={titleSlideDuration}>
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
			</Sequence> */}
		</AbsoluteFill>
	);
};
