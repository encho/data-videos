import {
	AbsoluteFill,
	useVideoConfig,
	useCurrentFrame,
	interpolate,
} from 'remotion';
import {z} from 'zod';
import chroma from 'chroma-js';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';

import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {ColorsList} from '../acetti-flics/ColorsList';
import {TitleSlide} from './TitleSlide';
import {ThemeType} from '../acetti-themes/themeTypes';
import LorenzoBertoliniLogo from '../acetti-components/LorenzoBertoliniLogo';

// TODO into global components acetti-components
import {Position} from '../acetti-ts-base/Position';

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

	const paddingHorizontal = 40;
	const contentWidth = width - 2 * paddingHorizontal;

	return (
		<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
			<TransitionSeries>
				{/* @ts-ignore */}
				<TransitionSeries.Sequence durationInFrames={titleSlideDuration}>
					<Position
						position={{top: paddingHorizontal, left: paddingHorizontal}}
					>
						<TitleSlide
							titleColor={theme.typography.titleColor}
							subTitleColor={theme.typography.subTitleColor}
							// title="Data Viz Color Palettes"
							title="Color Palettes for Data Visualizations"
							subTitle="Color Brewer Palettes with chroma.js"
							titleFontSize={112}
							subTitleFontSize={50}
						/>
					</Position>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={linearTiming({durationInFrames: 30})}
				/>
				{/* @ts-ignore */}
				<TransitionSeries.Sequence
					durationInFrames={durationInFrames - 30 - titleSlideDuration}
				>
					<ColorsSequenceContent contentWidth={contentWidth} theme={theme} />
				</TransitionSeries.Sequence>
			</TransitionSeries>

			<LorenzoBertoliniLogo />
		</AbsoluteFill>
	);
};

export const ColorsSequenceContent: React.FC<{
	contentWidth: number;
	theme: ThemeType;
}> = ({
	// themeEnum,
	contentWidth,
	theme,
}) => {
	// const { durationInFrames} = useVideoConfig();
	// TODO integrate into colorpalette
	// const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const aPerc = interpolate(frame, [0, durationInFrames], [0, 1]);
	const aTranslateY = interpolate(aPerc, [0, 1], [100, -8550]);

	const padding = 10;
	const contentWidthInner = contentWidth - 2 * padding;

	return (
		<>
			<AbsoluteFill>
				<h1
					style={{
						// color: theme.typography.titleColor,
						color: '#777',
						position: 'relative',
						top: 40,
						left: 40,
						fontSize: 40,
						fontWeight: 600,
					}}
				>
					Color Palettes for Data Visualizations
				</h1>
			</AbsoluteFill>
			<div
				style={{
					perspective: '3000px',
					// perspective: '4000px',
					// perspective: '8000px',
					transformStyle: 'preserve-3d',
				}}
			>
				<div
					style={{
						height: 700,
						overflow: 'hidden',
						backgroundColor: '#242424',
						borderRadius: 8,
						borderColor: '#333',
						borderStyle: 'solid',
						borderWidth: 2,
						width: contentWidth,
						padding,

						transform: `translateX(-20px) rotateX(${20}deg) rotateY(${-20}deg) rotateZ(${1}deg)`,
					}}
				>
					<div
						style={{
							transform: `translateY(${aTranslateY}px)`,
							display: 'flex',
							flexDirection: 'column',
							gap: 36,
							width: contentWidthInner,
						}}
					>
						{colorsLists.map((colorsList, i) => {
							// {colorsLists.slice(0, 7).map((colorsList, i) => {
							return (
								<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
									<h1 style={{color: 'white', fontSize: 28, fontWeight: 600}}>
										{i + 1}: {colorsList.name}
									</h1>
									<ColorsList
										key={i}
										colorsList={colorsList.colorsList}
										width={contentWidthInner}
										noLabel
										textColorMain={theme.typography.textColor}
										textColorContrast={theme.global.backgroundColor}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};
