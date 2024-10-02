import {ScaleLinear} from 'd3-scale';
import {Sequence, useVideoConfig} from 'remotion';

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
import {FadeInAndOutText} from '../../../compositions/SimpleStats/FadeInAndOutText';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

export const SparklineChartComponent: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
		leftValueLabel: TGridLayoutArea;
		rightValueLabel: TGridLayoutArea;
	};
	yDomainType: TYDomainType;
	theme: ThemeType;
	yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
	fromPeriodScale: TPeriodsScale;
	toPeriodScale: TPeriodsScale;
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
	leftValueLabel: string;
	leftValueLabelTextProps: {
		fontSize: number;
		fontFamily: string;
		fontWeight: number;
	};
	rightValueLabel: string;
	rightValueLabelTextProps: {
		fontSize: number;
		fontFamily: string;
		fontWeight: number;
	};
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
	leftValueLabel,
	leftValueLabelTextProps,
	rightValueLabel,
	rightValueLabelTextProps,
}) => {
	const {fps, durationInFrames} = useVideoConfig();

	const axisSpec = getJustFirstAndLastAxisSpec(currentPeriodsScale);

	const XAXIS_FADE_IN_DURATION = Math.floor(fps * 1.5);
	const DISPLAY_LEFT_VALUE_DELAY =
		XAXIS_FADE_IN_DURATION + Math.floor(fps * 0.1);

	const LEFT_VALUE_DOT_DURATION =
		durationInFrames - DISPLAY_LEFT_VALUE_DELAY - Math.floor(fps * 1);

	const SPARKLINE_DELAY = DISPLAY_LEFT_VALUE_DELAY + Math.floor(fps * 1.2);
	const SPARKLINE_FADE_IN_DURATION = Math.floor(fps * 1.0);
	const SPARKLINE_FADE_OUT_DURATION = Math.floor(fps * 1.0);

	const DISPLAY_RIGHT_VALUE_DELAY =
		SPARKLINE_DELAY + SPARKLINE_FADE_IN_DURATION - Math.floor(fps * 0.5);

	return (
		<>
			{/* xAxis */}
			<Sequence from={90 * 0}>
				<Position
					position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
				>
					<XAxis_SparklineLarge
						periodsScale={currentPeriodsScale}
						theme={theme.xAxis}
						area={layoutAreas.xAxis}
						axisSpec={axisSpec}
						clip={false}
						fadeInDurationInFrames={XAXIS_FADE_IN_DURATION}
						tickLabelColor={theme.typography.textColor}
						lineColor={theme.typography.subTitle.color}
					/>
				</Position>
			</Sequence>

			{/* sparkline */}
			<Sequence from={SPARKLINE_DELAY}>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<BuildingAnimatedLine
						lineColor={theme.typography.textColor}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
						fadeInDurationInFrames={SPARKLINE_FADE_IN_DURATION}
						fadeOutDurationInFrames={SPARKLINE_FADE_OUT_DURATION}
					/>
				</Position>
			</Sequence>

			{/* start dot */}
			<Sequence
				name="leftDot"
				from={DISPLAY_LEFT_VALUE_DELAY}
				durationInFrames={LEFT_VALUE_DOT_DURATION}
			>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<AnimatedSparklineStartDot
						dotColor={theme.typography.textColor}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
						fadeOutDurationInFrames={SPARKLINE_FADE_OUT_DURATION}
					/>
				</Position>
			</Sequence>

			{/* leftValueLabel */}
			<Sequence
				name="leftValueLabel"
				from={DISPLAY_LEFT_VALUE_DELAY}
				durationInFrames={LEFT_VALUE_DOT_DURATION}
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
								top:
									yScale(timeSeries[0].value) -
									leftValueLabelTextProps.fontSize / 2,
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<div
								style={{
									color: theme.typography.textColor,
									fontSize: leftValueLabelTextProps.fontSize,
									fontFamily: leftValueLabelTextProps.fontFamily,
									fontWeight: leftValueLabelTextProps.fontWeight,
									marginTop: '-0.35em', // TODO use capsize trimming
								}}
							>
								<FadeInAndOutText>{leftValueLabel}</FadeInAndOutText>
							</div>
						</div>
					</div>
				</Position>
			</Sequence>

			{/* rightValueLabel */}
			<Sequence from={DISPLAY_RIGHT_VALUE_DELAY}>
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
									rightValueLabelTextProps.fontSize / 2,
								width: '100%',
								height: '100%',
								display: 'flex',
								justifyContent: 'flex-start',
							}}
						>
							<div
								style={{
									color: theme.typography.textColor,
									fontSize: rightValueLabelTextProps.fontSize,
									fontFamily: rightValueLabelTextProps.fontFamily,
									fontWeight: rightValueLabelTextProps.fontWeight,
									marginTop: '-0.35em', // TODO use capsize trimming
								}}
							>
								<FadeInAndOutText>{rightValueLabel}</FadeInAndOutText>
							</div>
						</div>
					</div>
				</Position>
			</Sequence>
		</>
	);
};
