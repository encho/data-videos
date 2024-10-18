import {z} from 'zod';
import {Sequence, Easing, useVideoConfig} from 'remotion';
// import {measureText} from '@remotion/layout-utils';
import numeral from 'numeral';

import {zThemeEnum} from '../../../acetti-themes/getThemeFromEnum';
import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from './useChartLayout';
import {DisplayGridLayout} from '../../../acetti-layout';
import {SparklineChartComponent} from './SparklineChartComponent';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {getTextDimensions} from '../../../acetti-typography/new/CapSizeTextNew';

export const sparklinePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

type TSparklineChartWrapperProps = {
	id: string; // The id serves to uniquely define the svg mask
	theme: ThemeType;
	baseline: number;
	data: {value: number; date: Date}[];
	width: number;
	height: number;
	domain?: [number, number];
	lineColor?: string;
	showLayout?: boolean;
	formatString?: string;
};

export const SparklineLarge: React.FC<TSparklineChartWrapperProps> = ({
	id,
	theme,
	baseline,
	data,
	width,
	height,
	domain,
	lineColor,
	showLayout = false,
	formatString = '$ 0.0',
}) => {
	const {durationInFrames} = useVideoConfig();

	const firstDataValue = data[0].value;
	const lastDataValue = data[data.length - 1].value;

	const firstValueLabel = numeral(firstDataValue).format(formatString);
	const lastValueLabel = numeral(lastDataValue).format(formatString);

	// TODO make a smaller value label in theme
	const leftValueLabelWidth = getTextDimensions({
		key: 'datavizValueLabel',
		theme,
		baseline,
		text: firstValueLabel,
	}).width;

	const rightValueLabelWidth = getTextDimensions({
		key: 'datavizValueLabel',
		theme,
		baseline,
		text: lastValueLabel,
	}).width;

	const chartLayout = useChartLayout({
		baseline,
		width,
		height,
		// QUICK-FIX: Currently we need to adjust the widths, as small errors may arise
		leftValueLabelWidth: leftValueLabelWidth * 1.25,
		rightValueLabelWidth: rightValueLabelWidth * 1.25,
	});

	return (
		<div style={{position: 'relative', width}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					hide={!showLayout}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>
			<Sequence name="LineChartAnimationContainer">
				<LineChartAnimationContainer
					yDomain={domain}
					timeSeries={data}
					viewSpecs={[
						{
							area: chartLayout.areas.plot,
							visibleDomainIndices: [0.5, data.length - 0.5],
						},
						{
							area: chartLayout.areas.plot,
							visibleDomainIndices: [0.5, data.length - 0.5],
						},
					]}
					transitionSpecs={[
						{
							durationInFrames,
							easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
							numberOfSlices: 20,
							transitionType: 'DEFAULT',
						},
					]}
				>
					{({periodsScale, yScale, currentSliceInfo}) => {
						return (
							<SparklineChartComponent
								id={id}
								baseline={baseline}
								timeSeries={data}
								layoutAreas={{
									plot: chartLayout.areas.plot,
									xAxis: chartLayout.areas.xAxis,
									yAxis: chartLayout.areas.yAxis,
									leftValueLabel: chartLayout.areas.leftValueLabel,
									rightValueLabel: chartLayout.areas.rightValueLabel,
								}}
								theme={theme}
								lineColor={lineColor}
								yScale={yScale}
								periodScale={periodsScale}
								fromPeriodScale={currentSliceInfo.periodsScaleFrom}
								toPeriodScale={currentSliceInfo.periodsScaleTo}
								currentSliceInfo={currentSliceInfo}
								leftValueLabel={firstValueLabel}
								rightValueLabel={lastValueLabel}
							/>
						);
					}}
				</LineChartAnimationContainer>
			</Sequence>
		</div>
	);
};
