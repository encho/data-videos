import {useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {TextAnimationSubtle} from '../../../compositions/POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Position} from '../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	periodsScale,
	TPeriodsScale,
} from '../../../acetti-ts-periodsScale/periodsScale';
import {
	AnimatedSparklineStartDot,
	BuildingAnimatedLine,
} from '../../../acetti-ts-components/BuildingAnimatedLine';
import {getJustFirstAndLastAxisSpec} from '../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TLineChartAnimationContext} from '../../../acetti-ts-base/LineChartAnimationContainer';
// import {XAxis_SparklineLarge} from '../../../acetti-ts-axis/XAxis_SparklineLarge';
// import {FadeInAndOutText} from '../../../acetti-typography/TextEffects/FadeInAndOutText';
import {getExclusiveSequenceDuration} from '../../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {KeyFramesSequence} from '../../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {getLargeSparklineKeyFrames} from './getKeyframes';
import {getTextStyleCapHeight} from '../../../acetti-typography/CapSizeTextNew';
import {XAxis_Transition} from '../../../acetti-ts-axis/XAxis_Transition';
import {XAxis_SpecBased} from '../../../acetti-ts-axis/XAxis_SpecBased';
import {XAxis_EntryTransition} from '../../../acetti-ts-axis/XAxis_EntryTransition';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from '../../../acetti-ts-axis/utils/axisSpecs_xAxis';

// TODO: export use because of passed parametrization
// e.g. formatter: {type: "currency", currency: "USD", digits: 0, locale: "en-GB"}
const currencyFormatter = (x: number) => {
	const formatter = new Intl.NumberFormat('en-GB', {
		maximumFractionDigits: 0, // Ensures no decimal places
		minimumFractionDigits: 0, // Ensures no decimal places
	});
	return '$ ' + formatter.format(x);
};

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
} as const;

type TSpecType = keyof typeof AXIS_SPEC_FUNCTIONS;

const getAxisSpecType = (periodsScale: TPeriodsScale): TSpecType => {
	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE =
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: 'quarterStarts';

	return SPEC_TYPE;
};

const getAxisSpec = (periodsScale: TPeriodsScale, specType: TSpecType) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};

export const SingleTimeseriesBuildupChart: React.FC<{
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
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
	leftValueLabel: string;
	rightValueLabel: string;
	lineColor?: string;
	xAxisFormatString?: string;
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
	xAxisFormatString,
	currentSliceInfo,
	// TODO currentSliceInfo try to extract from and to period scales here?
}) => {
	const {fps, durationInFrames} = useVideoConfig();

	// const {periodsScaleFrom, periodsScaleTo} = currentSliceInfo;

	const keyframes = getLargeSparklineKeyFrames({durationInFrames, fps});

	// const XAXIS_FADE_IN_DURATION = getExclusiveSequenceDuration(
	// 	keyframes,
	// 	'X_AXIS_ENTER_START',
	// 	'X_AXIS_ENTER_END'
	// );

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

	// x-axis
	const currentSpecType = getAxisSpecType(currentPeriodsScale);
	const currentAxisSpec = getAxisSpec(currentPeriodsScale, currentSpecType);

	return (
		<>
			<KeyFramesSequence
				name="XAXIS"
				// TODO re-enactivate ?? but the currentSliceInfo is also giving frame info...
				// from="X_AXIS_ENTER_START"
				// to="X_AXIS_END"
				from="LEFT_VALUE_ENTER"
				to="RIGHT_VALUE_END"
				keyframes={keyframes}
			>
				<Position
					position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
				>
					<XAxis_EntryTransition
						fromAxisSpec={{labels: [], ticks: [], secondaryLabels: []}}
						toAxisSpec={currentAxisSpec}
						theme={theme.xAxis}
						area={layoutAreas.xAxis}
						periodsScale={currentPeriodsScale}
						currentSliceInfo={currentSliceInfo}
					/>

					{/* <XAxis_SpecBased
						area={layoutAreas.xAxis}
						axisSpec={currentAxisSpec}
						theme={theme.xAxis}
						periodsScale={currentPeriodsScale}
					/> */}
				</Position>

				{/* <Position
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
				</Position> */}
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
			{/* <KeyFramesSequence
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
			</KeyFramesSequence> */}

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