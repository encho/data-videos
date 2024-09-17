import {
	AbsoluteFill,
	useVideoConfig,
	useCurrentFrame,
	interpolate,
	// useVideoConfig
} from 'remotion';
import {z} from 'zod';
import chroma from 'chroma-js';
// import {linearTiming, TransitionSeries} from '@remotion/transitions';
// import {slide} from '@remotion/transitions/slide';

import {useChartLayout} from './useChartLayout';

import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {ColorsList} from '../acetti-flics/ColorsList';
import {TitleSlide} from './TitleSlide';
import {ThemeType} from '../acetti-themes/themeTypes';
import LorenzoBertoliniLogo from '../acetti-components/LorenzoBertoliniLogo';
import {TwoChangeBarsComponent} from './TwoChangeBarsComponent';

// TODO into global components acetti-components
import {Position} from '../acetti-ts-base/Position';
import {DisplayGridLayout} from '../acetti-layout';

export const twoChangeBarsSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	//
	startValue: z.number(),
	endValue: z.number(),
});

const colorBrewerKeys = Object.keys(chroma.brewer);

const colorsLists = colorBrewerKeys.map((colorBrewerKey) => {
	const colors = chroma.scale(colorBrewerKey).colors(11);
	const colorsList = colors.map((it, i) => {
		return {label: colorBrewerKey, color: it};
	});
	return {name: colorBrewerKey, colorsList};
});

export const TwoChangeBars: React.FC<z.infer<typeof twoChangeBarsSchema>> = ({
	themeEnum,
	startValue,
	endValue,
}) => {
	// const {width, height} = useVideoConfig();
	// TODO integrate into colorpalette
	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	// const titleSlideDuration = 200;

	const paddingHorizontal = 40;
	// const contentWidth = width - 2 * paddingHorizontal;

	const chartAreaWidth = 600;
	const chartAreaHeight = 600;

	const chartLayout = useChartLayout({
		width: chartAreaWidth,
		height: chartAreaHeight,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Position position={{top: paddingHorizontal, left: paddingHorizontal}}>
				<TitleSlide
					titleColor={theme.typography.titleColor}
					subTitleColor={theme.typography.subTitleColor}
					title="Two Change Bars Example"
					subTitle="Display a change of values over 2 periods"
					titleFontSize={70}
					subTitleFontSize={40}
				/>
			</Position>

			<Position position={{top: 300, left: 200}} backgroundColor="red">
				<div style={{position: 'relative'}}>
					<DisplayGridLayout
						width={chartAreaWidth}
						height={chartAreaHeight}
						areas={chartLayout.areas}
					/>
					<div
						style={{
							position: 'absolute',
							top: chartLayout.areas.firstBar.y1,
							left: chartLayout.areas.firstBar.x1,
							opacity: 0.5,
						}}
					>
						<TwoChangeBarsComponent
							width={chartLayout.areas.firstBar.width}
							height={chartLayout.areas.firstBar.height}
							endValuePerc={1}
						/>
					</div>
					<div
						style={{
							position: 'absolute',
							top: chartLayout.areas.firstBarLabelText.y1,
							left: chartLayout.areas.firstBarLabelText.x1,
							opacity: 0.5,
						}}
					>
						<div
							style={{
								width: chartLayout.areas.firstBarLabelText.width,
								height: chartLayout.areas.firstBarLabelText.height,
								backgroundColor: 'cyan',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<div style={{color: 'red', fontSize: 30}}>label 1</div>
						</div>
					</div>
					<div
						style={{
							position: 'absolute',
							top: chartLayout.areas.secondBar.y1,
							left: chartLayout.areas.secondBar.x1,
							opacity: 0.5,
						}}
					>
						<TwoChangeBarsComponent
							width={chartLayout.areas.secondBar.width}
							height={chartLayout.areas.secondBar.height}
							endValuePerc={0.4}
						/>
					</div>

					<div
						style={{
							position: 'absolute',
							top: chartLayout.areas.secondBarLabelText.y1,
							left: chartLayout.areas.secondBarLabelText.x1,
							opacity: 0.5,
						}}
					>
						<div
							style={{
								width: chartLayout.areas.secondBarLabelText.width,
								height: chartLayout.areas.secondBarLabelText.height,
								backgroundColor: 'cyan',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<div style={{color: 'red', fontSize: 30}}>label 2</div>
						</div>
					</div>
				</div>
			</Position>

			{/* 
			<Position position={{top: 300, left: 200}} backgroundColor="red">
				<TwoChangeBarsComponent width={200} height={600} endValuePerc={0.8} />
			</Position>
			<Position position={{top: 300, left: 500}} backgroundColor="red">
				<TwoChangeBarsComponent width={200} height={600} endValuePerc={0.4} />
			</Position> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
		// {/* </AbsoluteFill> */}
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
