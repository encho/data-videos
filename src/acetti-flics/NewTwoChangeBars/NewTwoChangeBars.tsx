import {
	useVideoConfig,
	useCurrentFrame,
	spring,
	Sequence,
	Easing,
	interpolate,
	// useVideoConfig
} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {measureText} from '@remotion/layout-utils';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {z} from 'zod';
import {Triangle} from '@remotion/shapes';
import numeral from 'numeral';

import {useChartLayout} from '../../compositions/TwoChangeBars/useChartLayout';
import {DisplayGridLayout} from '../../acetti-layout';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {AnimatedBarWithValueLabel} from './AnimatedBarWithValueLabel';
import {ChangeBar} from './ChangeBar';

export const newTwoChangeBarsSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	//
	leftBarValue: z.number(),
	leftBarLabel: z.string(),
	rightBarValue: z.number(),
	rightBarLabel: z.string(),
	valueFormatString: z.string(),
	percentageFormatString: z.string(),
	CHART_AREA_WIDTH: z.number(),
	CHART_AREA_HEIGHT: z.number(),
	minDomainValue: z.number().optional(),
	maxDomainValue: z.number().optional(),
});

interface Point {
	x: number;
	y: number;
}

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

function createPathWithTwoRoundedCorners(
	p1: Point,
	p2: Point,
	p3: Point,
	p4: Point,
	cornerRadius: number
): string {
	// Helper function to calculate tangent points for rounding
	function getTangentPoints(
		p1: Point,
		p2: Point,
		p3: Point,
		radius: number
	): {t1x: number; t1y: number; t2x: number; t2y: number} {
		const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
		const d2 = Math.hypot(p3.x - p2.x, p3.y - p2.y);

		const maxRadius = Math.min(d1, d2) / 2;
		const r = Math.min(radius, maxRadius);

		const t1x = p2.x - (r / d1) * (p2.x - p1.x);
		const t1y = p2.y - (r / d1) * (p2.y - p1.y);
		const t2x = p2.x + (r / d2) * (p3.x - p2.x);
		const t2y = p2.y + (r / d2) * (p3.y - p2.y);

		return {t1x, t1y, t2x, t2y};
	}

	// Calculate tangent points for the corner at p2
	const p2Tangents = getTangentPoints(p1, p2, p3, cornerRadius);

	// Calculate tangent points for the corner at p3
	const p3Tangents = getTangentPoints(p2, p3, p4, cornerRadius);

	// Build the SVG path string
	return `
    M ${p1.x} ${p1.y} 
    L ${p2Tangents.t1x} ${p2Tangents.t1y} 
    Q ${p2.x} ${p2.y} ${p2Tangents.t2x} ${p2Tangents.t2y}
    L ${p3Tangents.t1x} ${p3Tangents.t1y} 
    Q ${p3.x} ${p3.y} ${p3Tangents.t2x} ${p3Tangents.t2y}
    L ${p4.x} ${p4.y}
  `;
}

// function createPathWithRoundedCorner(
// 	p1: Point,
// 	p2: Point,
// 	p3: Point,
// 	cornerRadius: number
// ) {
// 	const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
// 	const d2 = Math.hypot(p3.x - p2.x, p3.y - p2.y);

// 	const maxRadius = Math.min(d1, d2) / 2;
// 	const radius = Math.min(cornerRadius, maxRadius);

// 	const t1x = p2.x - (radius / d1) * (p2.x - p1.x);
// 	const t1y = p2.y - (radius / d1) * (p2.y - p1.y);
// 	const t2x = p2.x + (radius / d2) * (p3.x - p2.x);
// 	const t2y = p2.y + (radius / d2) * (p3.y - p2.y);

// 	return `M ${p1.x} ${p1.y} L ${t1x} ${t1y} Q ${p2.x} ${p2.y} ${t2x} ${t2y} L ${p3.x} ${p3.y}`;
// }

const SPACE_BETWEEN_BARS = 100;

const PERC_CHANGE_DISPLAY_AREA_HEIGHT = 80;
const PERC_CHANGE_DISPLAY_PATH_STROKE_WIDTH = 4;
const PERC_CHANGE_DISPLAY_PATH_COLOR_UP = 'limegreen';
const PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN = 'red';
const PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL = 'gray';

export const NewTwoChangeBars: React.FC<
	z.infer<typeof newTwoChangeBarsSchema>
> = ({
	themeEnum,
	// TODO pass values directly, s.t. no theme object is necessary here
	// theme object has to be handled by flics upstream
	leftBarValue,
	rightBarValue,
	leftBarLabel,
	rightBarLabel,
	valueFormatString,
	percentageFormatString,
	CHART_AREA_HEIGHT,
	CHART_AREA_WIDTH,
	minDomainValue,
	maxDomainValue,
}) => {
	const theme =
		themeEnum === 'NERDY'
			? nerdyTheme
			: themeEnum === 'LORENZOBERTOLINI'
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	//
	const LEFT_BAR_VALUE = leftBarValue;
	const RIGHT_BAR_VALUE = rightBarValue;

	const RIGHT_BAR_COLOR = theme.TwoChangeBars.barsColor;
	const RIGHT_VALUE_COLOR = theme.typography.textColor;

	const LEFT_BAR_COLOR = theme.TwoChangeBars.barsColor;
	const LEFT_VALUE_COLOR = theme.typography.textColor;

	const LABEL_TEXT_SIZE = 40;
	const LABEL_MARGIN_TOP = 15;
	const LABEL_TEXT_COLOR = theme.typography.textColor;

	const VALUE_TEXT_SIZE = 34;
	const VALUE_MARGIN_TOP = 30;
	const VALUE_MARGIN_BOTTOM = 12;

	const BARS_VALUES_VISIBLE_DOMAIN = [
		minDomainValue || 0,
		// 0,
		maxDomainValue || Math.max(leftBarValue, rightBarValue),
	];

	const valueFormatter = (x: number) => numeral(x).format(valueFormatString);

	// const {width, height} = useVideoConfig();

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const DURATION_IN_SECONDS_BARS = 1;
	const DISPLAY_DELAY_IN_SECONDS = 0.3;
	const DURATION_IN_SECONDS_DISPLAY = 2.5;
	const DURATION_IN_SECONDS_LABEL_APPEARANCE = 0.75;

	const DURATION_IN_FRAMES_LABEL_APPEARANCE = Math.floor(
		DURATION_IN_SECONDS_LABEL_APPEARANCE * fps
	);
	const DURATION_IN_FRAMES_BARS = Math.floor(DURATION_IN_SECONDS_BARS * fps);
	const DISPLAY_DELAY_IN_FRAMES =
		DURATION_IN_FRAMES_BARS + Math.floor(DISPLAY_DELAY_IN_SECONDS * fps);
	const DURATION_IN_FRAMES_DISPLAY = Math.floor(
		DURATION_IN_SECONDS_DISPLAY * fps
	);

	// TODO add delay for second bar eventually
	const spr = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: DURATION_IN_FRAMES_BARS,
	});
	const percentageAnimation = spr;

	const pathAnimationDelay = 90 * 5.5;
	const pathLineAnimationDuration = 90 * 1;
	const pathTriangleAnimationDuration = 90 * 3;
	const pathSpring = spring({
		fps,
		frame,
		config: {damping: 50, stiffness: 500},
		durationInFrames: pathLineAnimationDuration,
		delay: pathAnimationDelay,
	});

	const triangleOpacitySpring = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: pathTriangleAnimationDuration,
		delay: pathAnimationDelay + pathLineAnimationDuration,
	});

	const globalPathExitOpacity = interpolate(
		frame,
		[durationInFrames - 90 * 2.25, durationInFrames - 90 * 1.75],
		[1, 0],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);
	const labelOpacitySpring = spring({
		fps,
		frame,
		config: {damping: 300},
		durationInFrames: DURATION_IN_FRAMES_LABEL_APPEARANCE,
	});

	const percentageAnimationDisplayArrow = spring({
		fps,
		frame,
		config: {damping: 300},
		// config: {damping: 100},
		delay: DISPLAY_DELAY_IN_FRAMES,
		durationInFrames: DURATION_IN_FRAMES_DISPLAY,
	});

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
		chartLayout.areas.percChangeDisplay.height +
		chartLayout.areas.firstBar.height -
		finalLeftBarHeight;

	const rightBarPathEndY =
		chartLayout.areas.percChangeDisplay.height +
		chartLayout.areas.firstBar.height -
		finalRightBarHeight -
		24; // for arrow...

	const H = 20;
	const topPathYLevel = Math.min(leftBarPathEndY, rightBarPathEndY) - H;

	const pathPoints: Point[] = [
		{x: firstBarCenterX, y: leftBarPathEndY},
		// {x: firstBarCenterX, y: PERC_CHANGE_DISPLAY_AREA_HEIGHT / 2},
		// {x: secondBarCenterX, y: PERC_CHANGE_DISPLAY_AREA_HEIGHT / 2},
		{x: firstBarCenterX, y: topPathYLevel},
		{x: secondBarCenterX, y: topPathYLevel},
		{
			x: secondBarCenterX,
			y: rightBarPathEndY,
		},
	];

	const displayCenterX =
		(chartLayout.areas.percChangeDisplay.x1 +
			chartLayout.areas.percChangeDisplay.x2) /
		2;

	const PERC_VALUE_TEXT_MARGIN_BOTTOM = 15;

	const displayCenterPoint = {
		x: displayCenterX,
		y: topPathYLevel - PERC_VALUE_TEXT_MARGIN_BOTTOM,
	};

	const percChange = RIGHT_BAR_VALUE / LEFT_BAR_VALUE - 1;
	const displayPercentageChangeText = numeral(percChange).format(
		percentageFormatString
	);

	const DISPLAY_FONT_SIZE = 30;
	const DISPLAY_FONT_FAMILY = 'Arial';
	const DISPLAY_FONT_WEIGHT = 600;

	// const displayTextWidth = measureText({
	// 	text: displayPercentageChangeText,
	// 	fontSize: DISPLAY_FONT_SIZE,
	// 	fontFamily: DISPLAY_FONT_FAMILY,
	// 	fontWeight: DISPLAY_FONT_WEIGHT,
	// });

	// const DISPLAY_RECT_BG_COLOR = theme.global.backgroundColor;
	// const displayRectWidth = displayTextWidth.width + 30;
	// const displayRectHeight = displayTextWidth.height + 10;
	// const displayRectPoint_x = displayCenterPoint.x - displayRectWidth / 2;
	// const displayRectPoint_y = displayCenterPoint.y - displayRectHeight / 2;

	const pathColor =
		RIGHT_BAR_VALUE > LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_UP
			: RIGHT_BAR_VALUE < LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN
			: PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL;

	// const pathData = createPathFromPoints(pathPoints);
	const pathData = createPathWithTwoRoundedCorners(
		pathPoints[0],
		pathPoints[1],
		pathPoints[2],
		pathPoints[3],
		5
	);

	const pathEvolution = evolvePath(pathSpring, pathData);

	const pathStrokeWidth = PERC_CHANGE_DISPLAY_PATH_STROKE_WIDTH;

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			{/* <DisplayGridLayout
				width={CHART_AREA_WIDTH}
				height={CHART_AREA_HEIGHT}
				areas={chartLayout.areas}
			/> */}
			{/* Perc Change Display */}
			<div
				style={{
					position: 'absolute',
					top: chartLayout.areas.percChangeDisplay.y1,
					left: chartLayout.areas.percChangeDisplay.x1,
					// display: 'none',
				}}
			>
				<svg
					style={{
						width: chartLayout.areas.percChangeDisplay.width,
						height: chartLayout.areas.percChangeDisplay.height,
						overflow: 'visible',
						opacity: globalPathExitOpacity,
						// opacity: percentageAnimationDisplayArrow,
					}}
				>
					<path
						d={pathData}
						strokeDasharray={pathEvolution.strokeDasharray}
						strokeDashoffset={pathEvolution.strokeDashoffset}
						stroke={pathColor}
						fill="none"
						strokeWidth={pathStrokeWidth}
					/>

					<g
						transform={`translate(${
							-24 / 2 + secondBarCenterX
						},${rightBarPathEndY})`}
						opacity={triangleOpacitySpring}
					>
						<Triangle
							length={24}
							fill={pathColor}
							direction="down"
							cornerRadius={6}
						/>
					</g>

					{/* <circle
						cx={displayCenterPoint.x}
						cy={displayCenterPoint.y}
						r={10}
						fill="orange"
					/> */}

					{/* <rect
						x={displayRectPoint_x}
						y={displayRectPoint_y}
						width={displayRectWidth}
						height={displayRectHeight}
						fill={DISPLAY_RECT_BG_COLOR}
						stroke={pathColor}
						strokeWidth={pathStrokeWidth}
						rx={3}
						ry={3}
					/> */}

					<text
						opacity={triangleOpacitySpring}
						x={displayCenterPoint.x}
						y={displayCenterPoint.y}
						text-anchor="middle"
						dominantBaseline="auto"
						dy={'0.06em'}
						fill={pathColor}
						fontSize={DISPLAY_FONT_SIZE}
						fontFamily={DISPLAY_FONT_FAMILY}
						fontWeight={DISPLAY_FONT_WEIGHT}
					>
						{/* +23,5% */}
						{displayPercentageChangeText}
					</text>
				</svg>
			</div>

			{/* percentage change arrow and display */}
			<Sequence
				name="ChangeBar_Left"
				from={90 * 1}
				durationInFrames={durationInFrames - 90 * 1}
				layout="none"
			>
				<ChangeBar
					areas={{
						valueLabel: chartLayout.areas.firstBarValueText,
						bar: chartLayout.areas.firstBar,
						label: chartLayout.areas.firstBarLabelText,
					}}
					label={leftBarLabel}
					value={leftBarValue}
					visibleDomain={BARS_VALUES_VISIBLE_DOMAIN as [number, number]}
					valueFormatter={valueFormatter}
					isTrimmed={Boolean(minDomainValue)}
					backgroundColor={theme.global.backgroundColor}
					barColor={theme.typography.logoColor}
				/>
			</Sequence>

			<Sequence
				name="ChangeBar_Right"
				from={90 * 3}
				durationInFrames={durationInFrames - 90 * 3}
				layout="none"
			>
				<ChangeBar
					areas={{
						valueLabel: chartLayout.areas.secondBarValueText,
						bar: chartLayout.areas.secondBar,
						label: chartLayout.areas.secondBarLabelText,
					}}
					label={rightBarLabel}
					value={rightBarValue}
					visibleDomain={BARS_VALUES_VISIBLE_DOMAIN as [number, number]}
					valueFormatter={valueFormatter}
					isTrimmed={Boolean(minDomainValue)}
					backgroundColor={theme.global.backgroundColor}
					barColor={theme.typography.logoColor}
				/>
			</Sequence>

			<div
				style={{
					position: 'absolute',
					top: chartLayout.areas.percChangeDisplay.y1,
					left: chartLayout.areas.percChangeDisplay.x1,
				}}
			>
				{/* <svg
					style={{
						width: chartLayout.areas.percChangeDisplay.width,
						height: chartLayout.areas.percChangeDisplay.height,
						overflow: 'visible',
						opacity: percentageAnimationDisplayArrow,
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
							fill={pathColor}
							direction="down"
							cornerRadius={6}
						/>
					</g>

					<circle
						cx={displayCenterPoint.x}
						cy={displayCenterPoint.y}
						r={10}
						fill="orange"
					/>

					<rect
						x={displayRectPoint_x}
						y={displayRectPoint_y}
						width={displayRectWidth}
						height={displayRectHeight}
						fill={DISPLAY_RECT_BG_COLOR}
						stroke={pathColor}
						strokeWidth={pathStrokeWidth}
						rx={3}
						ry={3}
					/>

					<text
						x={displayCenterPoint.x}
						y={displayCenterPoint.y}
						text-anchor="middle"
						dominant-baseline="middle"
						dy={'0.06em'}
						fill={pathColor}
						fontSize={DISPLAY_FONT_SIZE}
						fontFamily={DISPLAY_FONT_FAMILY}
						fontWeight={DISPLAY_FONT_WEIGHT}
					>
						{displayPercentageChangeText}
					</text>
				</svg> */}
			</div>

			{/* <div
				style={{
					position: 'absolute',
					top: chartLayout.areas.firstBar.y1,
					left: chartLayout.areas.firstBar.x1,
				}}
			>
				<AnimatedBarWithValueLabel
					width={chartLayout.areas.firstBar.width}
					height={chartLayout.areas.firstBar.height}
					currentBarValue={currentLeftBarDomainValue}
					currentBarHeight={currentLeftBarHeight}
					valueLabelFontSize={VALUE_TEXT_SIZE}
					valueLabelMarginBottom={VALUE_MARGIN_BOTTOM}
					barColor={LEFT_BAR_COLOR}
					valueLabelColor={LEFT_VALUE_COLOR}
					formatter={valueFormatter}
					displayTrimmer={Boolean(minDomainValue)}
					displayTrimmerAnimationPerc={percentageAnimation}
					backgroundColor={theme.global.backgroundColor}
				/>
			</div> */}
			{/* <div
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
						style={{
							color: LABEL_TEXT_COLOR,
							fontSize: LABEL_TEXT_SIZE,

							opacity: labelOpacitySpring,
						}}
					>
						{leftBarLabel}
					</div>
				</div>
			</div> */}
			{/* <div
				style={{
					position: 'absolute',
					top: chartLayout.areas.secondBar.y1,
					left: chartLayout.areas.secondBar.x1,
				}}
			>
				<AnimatedBarWithValueLabel
					width={chartLayout.areas.secondBar.width}
					height={chartLayout.areas.secondBar.height}
					currentBarHeight={currentRightBarHeight}
					currentBarValue={currentRightBarDomainValue}
					valueLabelFontSize={VALUE_TEXT_SIZE}
					valueLabelMarginBottom={VALUE_MARGIN_BOTTOM}
					barColor={RIGHT_BAR_COLOR}
					valueLabelColor={RIGHT_VALUE_COLOR}
					formatter={valueFormatter}
					displayTrimmer={Boolean(minDomainValue)}
					displayTrimmerAnimationPerc={percentageAnimation}
					backgroundColor={theme.global.backgroundColor}
				/>
			</div> */}

			{/* <div
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
						style={{
							color: LABEL_TEXT_COLOR,
							fontSize: LABEL_TEXT_SIZE,
							opacity: labelOpacitySpring,
						}}
					>
						{rightBarLabel}
					</div>
				</div>
			</div> */}
		</div>
	);
};
