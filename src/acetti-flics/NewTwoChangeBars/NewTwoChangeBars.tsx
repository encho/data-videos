import {useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';
import numeral from 'numeral';

import {zodThemeType} from '../../acetti-themes/themeTypes';
import {useChartLayout} from '../../compositions/POCs/06-ColumnCharts/TwoChangeBars/useChartLayout';
import {AnimatedArrowPath} from './AnimatedArrowPath';
import {ChangeBar} from './ChangeBar';
import {DisplayGridLayout} from '../../acetti-layout';
import {getTextStyleCapHeight} from '../../acetti-typography/CapSizeTextNew';

export const newTwoChangeBarsSchema = z.object({
	theme: zodThemeType,
	leftBarValue: z.number(),
	leftBarLabel: z.string(),
	rightBarValue: z.number(),
	rightBarLabel: z.string(),
	valueFormatString: z.string(),
	percentageFormatString: z.string(),
	CHART_AREA_HEIGHT: z.number(),
	minDomainValue: z.number().optional(),
	maxDomainValue: z.number().optional(),
	baseline: z.number().optional(),
});

export const NewTwoChangeBars: React.FC<
	z.infer<typeof newTwoChangeBarsSchema>
> = ({
	theme,
	leftBarValue,
	rightBarValue,
	leftBarLabel,
	rightBarLabel,
	valueFormatString,
	percentageFormatString,
	CHART_AREA_HEIGHT,
	minDomainValue,
	maxDomainValue,
	baseline = 34,
}) => {
	const LEFT_BAR_VALUE = leftBarValue;
	const RIGHT_BAR_VALUE = rightBarValue;
	const BAR_COLOR = theme.typography.textColor;
	const BACKGROUND_COLOR = theme.global.backgroundColor;

	const labelHeight = getTextStyleCapHeight({
		baseline,
		theme,
		key: 'datavizLabel',
	});

	const valueLabelHeight = getTextStyleCapHeight({
		baseline,
		theme,
		key: 'datavizValueLabel',
	});

	const LABEL_MARGIN_TOP = baseline * 0.5; // TODO from theme, as in ColumnChart!!!!
	const LABEL_TEXT_COLOR = theme.typography.textColor;

	const VALUE_MARGIN_TOP = baseline * 0.75; // TODO from theme!!!
	const VALUE_MARGIN_BOTTOM = baseline * 0.5; // TODO from ibcs Theme!!!!

	const BAR_WIDTH = baseline * 4; // TODO from theme

	const SPACE_BETWEEN_BARS = baseline * 2; // TODO from theme!!!!

	const PERC_CHANGE_DISPLAY_AREA_HEIGHT = baseline * 2.25; // TODO from theme
	const PERC_CHANGE_DISPLAY_PATH_STROKE_WIDTH = baseline / 10;
	const PERC_CHANGE_DISPLAY_ARROW_SIZE = baseline;
	const PERC_CHANGE_DISPLAY_MIN_VERTICAL_PATH_LENGTH = baseline;
	const PERC_CHANGE_DISPLAY_PATH_COLOR_UP = 'limegreen'; // TODO from theme
	const PERC_CHANGE_DISPLAY_PATH_COLOR_DOWN = 'red'; // TODO from theme
	const PERC_CHANGE_DISPLAY_PATH_COLOR_NEUTRAL = 'gray'; // TODO from theme

	const BARS_VALUES_VISIBLE_DOMAIN = [
		minDomainValue || 0,
		maxDomainValue || Math.max(leftBarValue, rightBarValue),
	];

	const valueFormatter = (x: number) => numeral(x).format(valueFormatString);

	const {durationInFrames, fps} = useVideoConfig();

	const chartLayout = useChartLayout({
		height: CHART_AREA_HEIGHT,
		labelTextSize: labelHeight, // TODO rename to labelCapHeight or so labelHeight
		labelMarginTop: LABEL_MARGIN_TOP,
		valueTextSize: valueLabelHeight,
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
			<DisplayGridLayout
				hide
				width={chartLayout.width}
				height={chartLayout.height}
				areas={chartLayout.areas}
			/>
			<Sequence
				name="PercChange_Display"
				from={Math.floor(fps * 5.75)}
				durationInFrames={Math.floor(durationInFrames - fps * 5.73 - fps * 1.5)}
				layout="none"
			>
				<AnimatedArrowPath
					theme={theme}
					baseline={baseline}
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
					arrowSize={PERC_CHANGE_DISPLAY_ARROW_SIZE}
					minVerticalPathLength={PERC_CHANGE_DISPLAY_MIN_VERTICAL_PATH_LENGTH}
				/>
			</Sequence>

			<Sequence name="ChangeBar_Left" from={fps} layout="none">
				<ChangeBar
					theme={theme}
					baseline={baseline}
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

			<Sequence name="ChangeBar_Right" from={Math.floor(fps * 3)} layout="none">
				<ChangeBar
					theme={theme}
					baseline={baseline}
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
