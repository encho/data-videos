import {Sequence, Easing, useVideoConfig} from 'remotion';
import numeral from 'numeral';

import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from './useChartLayout';
import {DisplayGridLayout} from '../../../acetti-layout';
import {SingleTimeseriesBuildupChart} from './SingleTimeseriesBuildupChart';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {getTextDimensions} from '../../../acetti-typography/CapSizeTextNew';

type TProps = {
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
	leftValueLabelWidth?: number;
	rightValueLabelWidth?: number;
	xAxisFormatString?: string;
};

export const SingleTimeseriesBuildup: React.FC<TProps> = ({
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
	xAxisFormatString = 'yyyy',
	leftValueLabelWidth: leftValueLabelWidthProp,
	rightValueLabelWidth: rightValueLabelWidthProp,
}) => {
	const {durationInFrames} = useVideoConfig();

	const firstDataValue = data[0].value;
	const lastDataValue = data[data.length - 1].value;

	const firstValueLabel = numeral(firstDataValue).format(formatString);
	const lastValueLabel = numeral(lastDataValue).format(formatString);

	// QUICK-FIX: At the moment with the current TextAnimationComponent this is fine
	// it would be more robust, if rendered and measured
	const measuredLeftValueLabelWidth = getTextDimensions({
		key: 'datavizValueLabel',
		theme,
		baseline,
		text: firstValueLabel,
	}).width;

	// QUICK-FIX: At the moment with the current TextAnimationComponent this is fine
	// it would be more robust, if rendered and measured
	const measuredRightValueLabelWidth = getTextDimensions({
		key: 'datavizValueLabel',
		theme,
		baseline,
		text: lastValueLabel,
	}).width;

	const leftValueLabelWidth =
		leftValueLabelWidthProp || measuredLeftValueLabelWidth;
	const rightValueLabelWidth =
		rightValueLabelWidthProp || measuredRightValueLabelWidth;

	const chartLayout = useChartLayout({
		baseline,
		width,
		height,
		leftValueLabelWidth,
		rightValueLabelWidth,
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
							numberOfSlices: 1,
							transitionType: 'DEFAULT',
						},
					]}
				>
					{({periodsScale, yScale, currentSliceInfo}) => {
						return (
							<>
								{/* <SingleTimeseriesBuildupChart
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
									// lineColor={lineColor}
									lineColor="cyan"
									yScale={yScale}
									periodScale={periodsScale}
									fromPeriodScale={currentSliceInfo.periodsScaleFrom}
									toPeriodScale={currentSliceInfo.periodsScaleTo}
									currentSliceInfo={currentSliceInfo}
									leftValueLabel={firstValueLabel}
									rightValueLabel={lastValueLabel}
									xAxisFormatString={xAxisFormatString}
								/> */}
								{/* <div style={{transform: `translateY(100) scale(0.5)`}}> */}
								<SingleTimeseriesBuildupChart
									id="2903"
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
									// TODO deprecate also in SparklineLarge component
									// fromPeriodScale={currentSliceInfo.periodsScaleFrom}
									// toPeriodScale={currentSliceInfo.periodsScaleTo}
									currentSliceInfo={currentSliceInfo}
									leftValueLabel={firstValueLabel}
									rightValueLabel={lastValueLabel}
									xAxisFormatString={xAxisFormatString}
								/>
								{/* </div> */}
							</>
						);
					}}
				</LineChartAnimationContainer>
			</Sequence>
		</div>
	);
};
