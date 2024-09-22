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
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {z} from 'zod';
import {Triangle} from '@remotion/shapes';
import numeral from 'numeral';

import {useChartLayout} from '../../compositions/TwoChangeBars/useChartLayout';
import {DisplayGridLayout} from '../../acetti-layout';
import {ArrowPathSequence} from './ArrowPathSequence';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {ChangeBar} from './ChangeBar';
import {FadeInAndOutText} from '../../compositions/SimpleStats/FadeInAndOutText';

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

// TODO factor out
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

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

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

	// calculate path animation infos
	// ********************
	const pathAnimationDelay = 90 * 5.5;
	const pathLineAnimationDuration = 90 * 1;
	const pathTriangleAnimationDuration = 90 * 0.3;

	const globalTriangleAnimationDelay =
		pathAnimationDelay + pathLineAnimationDuration;

	const percentageChangeTextDelayAfterPathFullyEntered = 90 * 0;

	const globalPercentageChangeAnimationDelay =
		globalTriangleAnimationDelay +
		pathTriangleAnimationDuration +
		percentageChangeTextDelayAfterPathFullyEntered;

	const pathSpring = spring({
		fps,
		frame,
		config: {damping: 50, stiffness: 500},
		durationInFrames: pathLineAnimationDuration,
		delay: pathAnimationDelay,
	});

	const triangleOpacitySpring = interpolate(
		frame,
		[
			globalTriangleAnimationDelay,
			globalTriangleAnimationDelay + pathTriangleAnimationDuration,
		],
		[0, 1],
		{
			// easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

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

	// calculate path points
	// ********************
	const getCurrentLeftBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(BARS_VALUES_VISIBLE_DOMAIN)
		.range([0, chartLayout.areas.firstBar.height]);

	const finalLeftBarHeight = getCurrentLeftBarHeight(LEFT_BAR_VALUE);

	const getCurrentRightBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(BARS_VALUES_VISIBLE_DOMAIN)
		.range([0, chartLayout.areas.firstBar.height]);

	const finalRightBarHeight = getCurrentRightBarHeight(RIGHT_BAR_VALUE);

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
		{x: firstBarCenterX, y: topPathYLevel},
		{x: secondBarCenterX, y: topPathYLevel},
		{
			x: secondBarCenterX,
			y: rightBarPathEndY,
		},
	];

	const percChange = RIGHT_BAR_VALUE / LEFT_BAR_VALUE - 1;
	const displayPercentageChangeText = numeral(percChange).format(
		percentageFormatString
	);

	const DISPLAY_FONT_SIZE = 30;
	const DISPLAY_FONT_FAMILY = 'Arial';
	const DISPLAY_FONT_WEIGHT = 600;

	const pathColor =
		RIGHT_BAR_VALUE > LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_UP
			: RIGHT_BAR_VALUE < LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN
			: PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL;

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
			<DisplayGridLayout
				width={CHART_AREA_WIDTH}
				height={CHART_AREA_HEIGHT}
				areas={chartLayout.areas}
			/>
			{/* Perc Change Display */}
			<Sequence
				from={globalPercentageChangeAnimationDelay}
				durationInFrames={90 * 3}
				layout="none"
			>
				<ArrowPathSequence
					areas={{
						percChangeDisplay: chartLayout.areas.percChangeDisplay,
						firstBar: chartLayout.areas.firstBar,
						secondBar: chartLayout.areas.secondBar,
					}}
					visibleDomain={BARS_VALUES_VISIBLE_DOMAIN as [number, number]}
					rightBarValue={RIGHT_BAR_VALUE}
					leftBarValue={LEFT_BAR_VALUE}
					color={pathColor}
					strokeWidth={PERC_CHANGE_DISPLAY_PATH_STROKE_WIDTH}
				/>
			</Sequence>

			<div
				style={{
					position: 'absolute',
					top: chartLayout.areas.percChangeDisplay.y1,
					left: chartLayout.areas.percChangeDisplay.x1,
				}}
			>
				<Sequence from={globalPercentageChangeAnimationDelay}>
					<div
						style={{
							position: 'absolute',
							top: topPathYLevel,
							marginTop: -DISPLAY_FONT_SIZE - 10, // the utilized fontsize below with some margin
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								marginTop: `${-0.3}em`, // TODO utilize capsize metrics for given font
								marginBottom: `${-0.32}em`, // TODO utilize capsize metrics for given font
								fontSize: DISPLAY_FONT_SIZE,
								color: pathColor,
								fontWeight: DISPLAY_FONT_WEIGHT,
								fontFamily: DISPLAY_FONT_FAMILY,
							}}
						>
							<FadeInAndOutText>{displayPercentageChangeText}</FadeInAndOutText>
						</div>
					</div>
				</Sequence>
				<svg
					style={{
						width: chartLayout.areas.percChangeDisplay.width,
						height: chartLayout.areas.percChangeDisplay.height,
						overflow: 'visible',
						// opacity: globalPathExitOpacity,
						opacity: 0,
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
			></div>
		</div>
	);
};
