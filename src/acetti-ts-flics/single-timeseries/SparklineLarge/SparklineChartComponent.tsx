import {ScaleLinear} from 'd3-scale';
import {useVideoConfig} from 'remotion';

import {TextAnimationSubtle} from '../../../compositions/POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Position} from '../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../../acetti-ts-periodsScale/periodsScale';
import {
	AnimatedSparklineStartDot,
	BuildingAnimatedLine,
} from '../../../acetti-ts-components/BuildingAnimatedLine';
import {getJustFirstAndLastAxisSpec} from '../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TLineChartAnimationContext} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {XAxis_SparklineLarge} from '../../../acetti-ts-axis/XAxis_SparklineLarge';
// import {FadeInAndOutText} from '../../../acetti-typography/TextEffects/FadeInAndOutText';
import {getExclusiveSequenceDuration} from '../../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {KeyFramesSequence} from '../../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {getLargeSparklineKeyFrames} from './getKeyframes';
import {getTextStyleCapHeight} from '../../../acetti-typography/CapSizeTextNew';

export const SparklineChartComponent: React.FC<{
	baseline: number;
	id: string; // id serves to uniquely define the mask
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
		leftValueLabel: TGridLayoutArea;
		rightValueLabel: TGridLayoutArea;
	};
	theme: ThemeType;
	yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
	fromPeriodScale: TPeriodsScale;
	toPeriodScale: TPeriodsScale;
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
	leftValueLabel: string;
	rightValueLabel: string;
	lineColor?: string;
}> = ({
	id,
	baseline,
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
	leftValueLabel,
	rightValueLabel,
	lineColor,
}) => {
	const {fps, durationInFrames} = useVideoConfig();

	const axisSpec = getJustFirstAndLastAxisSpec(currentPeriodsScale);

	const keyframes = getLargeSparklineKeyFrames({durationInFrames, fps});

	const XAXIS_FADE_IN_DURATION = getExclusiveSequenceDuration(
		keyframes,
		'X_AXIS_ENTER_START',
		'X_AXIS_ENTER_END'
	);

	const LEFT_VALUE_EXIT_DURATION = getExclusiveSequenceDuration(
		keyframes,
		'LEFT_VALUE_EXIT_START',
		'LEFT_VALUE_EXIT_END'
	);

	const SPARKLINE_FADE_IN_DURATION = getExclusiveSequenceDuration(
		keyframes,
		'SPARKLINE_ENTER',
		'SPARKLINE_ENTER_END'
	);

	const SPARKLINE_FADE_OUT_DURATION = getExclusiveSequenceDuration(
		keyframes,
		'SPARKLINE_EXIT_START',
		'SPARKLINE_END'
	);

	const valueLabelCapHeight = getTextStyleCapHeight({
		theme,
		baseline,
		key: 'datavizValueLabel',
	});

	return (
		<>
			<KeyFramesSequence
				name="XAXIS"
				from="X_AXIS_ENTER_START"
				to="X_AXIS_END"
				keyframes={keyframes}
			>
				<Position
					position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
				>
					<XAxis_SparklineLarge
						baseline={baseline}
						theme={theme}
						area={layoutAreas.xAxis}
						axisSpec={axisSpec}
						fadeInDurationInFrames={XAXIS_FADE_IN_DURATION}
						tickLabelColor={theme.yAxis.tickColor}
						lineColor={theme.yAxis.color}
					/>
				</Position>
			</KeyFramesSequence>

			<KeyFramesSequence
				name="SPARKLINE__ANIMATED_LINE"
				from="SPARKLINE_ENTER"
				to="SPARKLINE_END"
				keyframes={keyframes}
			>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<BuildingAnimatedLine
						id={id}
						lineColor={lineColor || theme.typography.textColor}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
						fadeInDurationInFrames={SPARKLINE_FADE_IN_DURATION}
						fadeOutDurationInFrames={SPARKLINE_FADE_OUT_DURATION}
					/>
				</Position>
			</KeyFramesSequence>

			{/* start dot */}
			<KeyFramesSequence
				name="LEFT_VALUE__DOT"
				from="LEFT_VALUE_ENTER"
				to="LEFT_VALUE_EXIT_END"
				keyframes={keyframes}
			>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<AnimatedSparklineStartDot
						dotColor={lineColor || theme.typography.textColor}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
						entryDurationInFrames={fps}
						fadeOutDurationInFrames={LEFT_VALUE_EXIT_DURATION}
					/>
				</Position>
			</KeyFramesSequence>

			<KeyFramesSequence
				name="LEFT_VALUE__LABEL"
				from="LEFT_VALUE_ENTER"
				to="LEFT_VALUE_EXIT_END"
				keyframes={keyframes}
			>
				<Position
					position={{
						left: layoutAreas.leftValueLabel.x1,
						top: layoutAreas.leftValueLabel.y1,
					}}
				>
					<div
						style={{
							position: 'relative',
							width: layoutAreas.leftValueLabel.width,
							height: layoutAreas.leftValueLabel.height,
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: yScale(timeSeries[0].value) - valueLabelCapHeight / 2,
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.datavizValueLabel}
								baseline={baseline}
								color={lineColor}
							>
								<TextAnimationSubtle translateY={baseline * 1.1}>
									{leftValueLabel}
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</Position>
			</KeyFramesSequence>

			<KeyFramesSequence
				name="RIGHT_VALUE__LABEL"
				from="RIGHT_VALUE_START"
				to="RIGHT_VALUE_END"
				keyframes={keyframes}
			>
				<Position
					position={{
						left: layoutAreas.rightValueLabel.x1,
						top: layoutAreas.rightValueLabel.y1,
					}}
				>
					<div
						style={{
							position: 'relative',
							width: layoutAreas.rightValueLabel.width,
							height: layoutAreas.rightValueLabel.height,
						}}
					>
						<div
							style={{
								position: 'absolute',
								top:
									yScale(timeSeries[timeSeries.length - 1].value) -
									valueLabelCapHeight / 2,
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'flex-start',
							}}
						>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.datavizValueLabel}
								baseline={baseline}
								color={lineColor}
							>
								<TextAnimationSubtle translateY={baseline * 1.1}>
									{rightValueLabel}
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</Position>
			</KeyFramesSequence>
		</>
	);
};
