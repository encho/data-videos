import {
	AbsoluteFill,
	useVideoConfig,
	useCurrentFrame,
	interpolate,
	spring,
	// useVideoConfig
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {z} from 'zod';
import chroma from 'chroma-js';
import {Triangle} from '@remotion/shapes';
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

interface Point {
	x: number;
	y: number;
}

// const CHART_AREA_WIDTH = 300;
// const CHART_AREA_HEIGHT = 300;

const CHART_AREA_WIDTH = 500;
const CHART_AREA_HEIGHT = 600;

const SPACE_BETWEEN_BARS = 120;

const PERC_CHANGE_DISPLAY_AREA_HEIGHT = 80;
const PERC_CHANGE_DISPLAY_PATH_COLOR_UP = 'limegreen';
const PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN = 'red';
const PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL = 'gray';

const LABEL_TEXT_SIZE = 40;
const LABEL_MARGIN_TOP = 15;
const LABEL_TEXT_COLOR = 'gray';

const VALUE_TEXT_SIZE = 35;
const VALUE_MARGIN_TOP = 15;
const VALUE_MARGIN_BOTTOM = 5;

const RIGHT_BAR_COLOR = '#404040';
const RIGHT_VALUE_COLOR = 'gray';

const LEFT_BAR_COLOR = '#404040';
const LEFT_VALUE_COLOR = 'gray';

const BARS_VALUES_VISIBLE_DOMAIN = [0, 1000];
// const BARS_VALUES_VISIBLE_DOMAIN = [700, 1000];

const LEFT_BAR_VALUE = 700;
const RIGHT_BAR_VALUE = 1000;
// const LEFT_BAR_VALUE = 1000;
// const RIGHT_BAR_VALUE = 800;
// const LEFT_BAR_VALUE = 1000;
// const RIGHT_BAR_VALUE = 1000;

const formatToOneDecimalPlaceGerman = (num: number): string => {
	return num.toLocaleString('de-DE', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
};

export const TwoChangeBars: React.FC<z.infer<typeof twoChangeBarsSchema>> = ({
	themeEnum,
	startValue,
	endValue,
}) => {
	// const {width, height} = useVideoConfig();
	// TODO integrate into colorpalette
	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	// TODO add delay for second bar eventually
	const spr = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: durationInFrames / 2,
	});
	const percentageAnimation = spr;

	const paddingHorizontal = 40;
	// const contentWidth = width - 2 * paddingHorizontal;

	const chartLayout = useChartLayout({
		width: CHART_AREA_WIDTH,
		height: CHART_AREA_HEIGHT,
		//
		labelTextSize: LABEL_TEXT_SIZE,
		labelMarginTop: LABEL_MARGIN_TOP,
		valueTextSize: VALUE_TEXT_SIZE,
		valueMarginTop: VALUE_MARGIN_TOP,
		valueMarginBottom: VALUE_MARGIN_BOTTOM,
		percChangeDisplayAreaHeight: PERC_CHANGE_DISPLAY_AREA_HEIGHT,
		spaceBetweenBars: SPACE_BETWEEN_BARS,
	});

	const getLeftBarCurrentDomain: ScaleLinear<number, number> = scaleLinear()
		.domain([0, 1])
		.range([Math.max(0, BARS_VALUES_VISIBLE_DOMAIN[0]), LEFT_BAR_VALUE]);

	const getCurrentLeftBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(BARS_VALUES_VISIBLE_DOMAIN)
		.range([0, chartLayout.areas.firstBar.height]);

	// const currentLeftBarHeight = getCurrentLeftBarHeight(
	// 	getLeftBarCurrentDomain(percentageAnimation)
	// );

	const currentLeftBarDomainValue =
		getLeftBarCurrentDomain(percentageAnimation);

	const currentLeftBarHeight = getCurrentLeftBarHeight(
		currentLeftBarDomainValue
	);

	const finalLeftBarHeight = getCurrentLeftBarHeight(
		getLeftBarCurrentDomain(1.0)
	);

	const getRightBarCurrentDomain: ScaleLinear<number, number> = scaleLinear()
		.domain([0, 1])
		.range([Math.max(0, BARS_VALUES_VISIBLE_DOMAIN[0]), RIGHT_BAR_VALUE]);

	const getCurrentRightBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(BARS_VALUES_VISIBLE_DOMAIN)
		.range([0, chartLayout.areas.firstBar.height]);

	const currentRightBarDomainValue =
		getRightBarCurrentDomain(percentageAnimation);

	const currentRightBarHeight = getCurrentRightBarHeight(
		currentRightBarDomainValue
	);

	const finalRightBarHeight = getCurrentRightBarHeight(
		getRightBarCurrentDomain(1.0)
	);

	const firstBarCenterX =
		(chartLayout.areas.firstBar.x1 + chartLayout.areas.firstBar.x2) / 2;

	const secondBarCenterX =
		(chartLayout.areas.secondBar.x1 + chartLayout.areas.secondBar.x2) / 2;

	const leftBarPathEndY =
		PERC_CHANGE_DISPLAY_AREA_HEIGHT +
		chartLayout.areas.firstBar.height -
		finalLeftBarHeight;

	const rightBarPathEndY =
		PERC_CHANGE_DISPLAY_AREA_HEIGHT +
		chartLayout.areas.firstBar.height -
		finalRightBarHeight -
		24;

	const pathPoints: Point[] = [
		{x: firstBarCenterX, y: leftBarPathEndY},
		{x: firstBarCenterX, y: PERC_CHANGE_DISPLAY_AREA_HEIGHT / 2},
		{x: secondBarCenterX, y: PERC_CHANGE_DISPLAY_AREA_HEIGHT / 2},
		{
			x: secondBarCenterX,
			y: rightBarPathEndY,
		},
	];

	const pathColor =
		RIGHT_BAR_VALUE > LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_UP
			: RIGHT_BAR_VALUE < LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN
			: PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL;

	// Function to convert points into a valid 'd' attribute for the path
	const createPathFromPoints = (points: Point[]): string => {
		if (points.length === 0) {
			return '';
		}

		// Start at the first point (using M for "move to")
		let path = `M ${points[0].x} ${points[0].y}`;

		// Iterate through the remaining points, adding lines (using L for "line to")
		for (let i = 1; i < points.length; i++) {
			path += ` L ${points[i].x} ${points[i].y}`;
		}

		return path;
	};

	const pathData = createPathFromPoints(pathPoints);

	const pathStrokeWidth = 4;

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

			{/* <Position position={{top: 300, left: 200}} backgroundColor="red"> */}
			<div
				style={{
					marginTop: 280,
					// width: '100%',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div>
					<div style={{position: 'relative'}}>
						<DisplayGridLayout
							width={CHART_AREA_WIDTH}
							height={CHART_AREA_HEIGHT}
							areas={chartLayout.areas}
							stroke={'#404040'}
							fill={'#191919'}
						/>
						{/* percentage change arrow and display */}
						<div
							style={{
								position: 'absolute',
								top: chartLayout.areas.percChangeDisplay.y1,
								left: chartLayout.areas.percChangeDisplay.x1,
							}}
						>
							<svg
								style={{
									width: chartLayout.areas.percChangeDisplay.width,
									height: chartLayout.areas.percChangeDisplay.height,
									overflow: 'visible',
								}}
							>
								<path
									d={pathData}
									stroke={pathColor}
									fill="none"
									strokeWidth={pathStrokeWidth}
								/>

								<g
									transform={`translate(${
										-24 / 2 + secondBarCenterX
									},${rightBarPathEndY})`}
								>
									<Triangle
										length={24}
										stroke={pathColor}
										strokeWidth={pathStrokeWidth}
										direction="down"
										cornerRadius={6}
									/>
								</g>
							</svg>
						</div>

						<div
							style={{
								position: 'absolute',
								top: chartLayout.areas.firstBar.y1,
								left: chartLayout.areas.firstBar.x1,
							}}
						>
							<TwoChangeBarsComponent
								width={chartLayout.areas.firstBar.width}
								height={chartLayout.areas.firstBar.height}
								currentBarValue={currentLeftBarDomainValue}
								currentBarHeight={currentLeftBarHeight}
								// currentBarHeight={finalLeftBarHeight}
								valueLabelFontSize={VALUE_TEXT_SIZE}
								valueLabelMarginBottom={VALUE_MARGIN_BOTTOM}
								barColor={LEFT_BAR_COLOR}
								valueLabelColor={LEFT_VALUE_COLOR}
								formatter={formatToOneDecimalPlaceGerman}
							/>
						</div>
						<div
							style={{
								position: 'absolute',
								top: chartLayout.areas.firstBarLabelText.y1,
								left: chartLayout.areas.firstBarLabelText.x1,
							}}
						>
							<div
								style={{
									width: chartLayout.areas.firstBarLabelText.width,
									height: chartLayout.areas.firstBarLabelText.height,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{color: LABEL_TEXT_COLOR, fontSize: LABEL_TEXT_SIZE}}
								>
									2023
								</div>
							</div>
						</div>
						<div
							style={{
								position: 'absolute',
								top: chartLayout.areas.secondBar.y1,
								left: chartLayout.areas.secondBar.x1,
							}}
						>
							<TwoChangeBarsComponent
								width={chartLayout.areas.secondBar.width}
								height={chartLayout.areas.secondBar.height}
								currentBarHeight={currentRightBarHeight}
								currentBarValue={currentRightBarDomainValue}
								// currentBarHeight={finalRightBarHeight}
								valueLabelFontSize={VALUE_TEXT_SIZE}
								valueLabelMarginBottom={VALUE_MARGIN_BOTTOM}
								barColor={RIGHT_BAR_COLOR}
								valueLabelColor={RIGHT_VALUE_COLOR}
								formatter={formatToOneDecimalPlaceGerman}
							/>
						</div>

						<div
							style={{
								position: 'absolute',
								top: chartLayout.areas.secondBarLabelText.y1,
								left: chartLayout.areas.secondBarLabelText.x1,
							}}
						>
							<div
								style={{
									width: chartLayout.areas.secondBarLabelText.width,
									height: chartLayout.areas.secondBarLabelText.height,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{color: LABEL_TEXT_COLOR, fontSize: LABEL_TEXT_SIZE}}
								>
									2024
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* </Position> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
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
