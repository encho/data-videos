import {
	useVideoConfig,
	Sequence,
	// useCurrentFrame,
	// spring,
	// Easing,
	// interpolate,
	// useVideoConfig
} from 'remotion';
import {z} from 'zod';
import numeral from 'numeral';

import {useChartLayout} from '../../compositions/TwoChangeBars/useChartLayout';
import {DisplayGridLayout} from '../../acetti-layout';
import {AnimatedArrowPath} from './AnimatedArrowPath';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {ChangeBar} from './ChangeBar';
// import {FadeInAndOutText} from '../../compositions/SimpleStats/FadeInAndOutText';

export const newTwoChangeBarsSchema = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	//
	leftBarValue: z.number(),
	leftBarLabel: z.string(),
	rightBarValue: z.number(),
	rightBarLabel: z.string(),
	valueFormatString: z.string(),
	percentageFormatString: z.string(),
	// CHART_AREA_WIDTH: z.number(),
	CHART_AREA_HEIGHT: z.number(),
	minDomainValue: z.number().optional(),
	maxDomainValue: z.number().optional(),
	baseFontSize: z.number().optional(),
});

// TODO factor out

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
	// CHART_AREA_WIDTH,
	minDomainValue,
	maxDomainValue,
	baseFontSize = 34,
}) => {
	const theme =
		themeEnum === 'NERDY'
			? nerdyTheme
			: themeEnum === 'LORENZOBERTOLINI'
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	const LEFT_BAR_VALUE = leftBarValue;
	const RIGHT_BAR_VALUE = rightBarValue;
	const BAR_COLOR = theme.typography.textColor;
	const BACKGROUND_COLOR = theme.global.backgroundColor;

	const LABEL_TEXT_SIZE = baseFontSize * 1.25;
	const LABEL_MARGIN_TOP = baseFontSize * 0.25;
	const LABEL_TEXT_COLOR = theme.typography.textColor;

	const VALUE_TEXT_SIZE = baseFontSize;
	const VALUE_MARGIN_TOP = baseFontSize * 0.5;
	const VALUE_MARGIN_BOTTOM = baseFontSize * 0.25;

	const BAR_WIDTH = baseFontSize * 4;
	// const BAR_TRIMMER_HEIGHT = TODO

	const SPACE_BETWEEN_BARS = baseFontSize * 2;

	const DISPLAY_FONT_SIZE = baseFontSize * 1.25;
	const DISPLAY_FONT_FAMILY = 'Arial';
	const DISPLAY_FONT_WEIGHT = 600;

	const PERC_CHANGE_DISPLAY_AREA_HEIGHT = 80;
	const PERC_CHANGE_DISPLAY_PATH_STROKE_WIDTH = baseFontSize / 10;
	const PERC_CHANGE_DISPLAY_ARROW_SIZE = baseFontSize * 1;
	const PERC_CHANGE_DISPLAY_MIN_VERTICAL_PATH_LENGTH = baseFontSize * 1;

	const PERC_CHANGE_DISPLAY_PATH_COLOR_UP = 'limegreen';
	const PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN = 'red';
	const PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL = 'gray';

	const BARS_VALUES_VISIBLE_DOMAIN = [
		minDomainValue || 0,
		maxDomainValue || Math.max(leftBarValue, rightBarValue),
	];

	const valueFormatter = (x: number) => numeral(x).format(valueFormatString);

	// const frame = useCurrentFrame();
	const {
		// fps,
		durationInFrames,
	} = useVideoConfig();

	const chartLayout = useChartLayout({
		// width: CHART_AREA_WIDTH,
		height: CHART_AREA_HEIGHT,
		labelTextSize: LABEL_TEXT_SIZE,
		labelMarginTop: LABEL_MARGIN_TOP,
		valueTextSize: VALUE_TEXT_SIZE,
		valueMarginTop: VALUE_MARGIN_TOP,
		valueMarginBottom: VALUE_MARGIN_BOTTOM,
		percChangeDisplayAreaHeight: PERC_CHANGE_DISPLAY_AREA_HEIGHT,
		spaceBetweenBars: SPACE_BETWEEN_BARS,
		barWidth: BAR_WIDTH,
	});

	const percChange = RIGHT_BAR_VALUE / LEFT_BAR_VALUE - 1;
	const displayPercentageChangeText = numeral(percChange).format(
		percentageFormatString
	);

	const pathColor =
		RIGHT_BAR_VALUE > LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_UP
			: RIGHT_BAR_VALUE < LEFT_BAR_VALUE
			? PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN
			: PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL;

	return (
		<div
			style={{
				position: 'relative',
				width: chartLayout.width,
				height: chartLayout.height,
			}}
		>
			{/* <DisplayGridLayout
				width={chartLayout.width}
				height={chartLayout.height}
				areas={chartLayout.areas}
			/> */}
			<Sequence
				name="PercChange_Display"
				from={90 * 5.75}
				durationInFrames={durationInFrames - 90 * 5.73 - 90 * 1.5}
				layout="none"
			>
				<AnimatedArrowPath
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
					percentageChangeText={displayPercentageChangeText}
					fontSize={DISPLAY_FONT_SIZE}
					fontFamily={DISPLAY_FONT_FAMILY}
					fontWeight={DISPLAY_FONT_WEIGHT}
					arrowSize={PERC_CHANGE_DISPLAY_ARROW_SIZE}
					minVerticalPathLength={PERC_CHANGE_DISPLAY_MIN_VERTICAL_PATH_LENGTH}
				/>
			</Sequence>

			<Sequence
				name="ChangeBar_Left"
				from={90 * 1}
				// durationInFrames={durationInFrames - 90 * 1}
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
					backgroundColor={BACKGROUND_COLOR}
					barColor={BAR_COLOR}
					labelColor={LABEL_TEXT_COLOR}
					valueTextColor={LABEL_TEXT_COLOR}
				/>
			</Sequence>

			<Sequence
				name="ChangeBar_Right"
				from={90 * 3}
				// durationInFrames={durationInFrames - 90 * 3}
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
					backgroundColor={BACKGROUND_COLOR}
					barColor={BAR_COLOR}
					labelColor={LABEL_TEXT_COLOR}
					valueTextColor={LABEL_TEXT_COLOR}
				/>
			</Sequence>
		</div>
	);
};
