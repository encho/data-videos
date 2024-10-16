import {z} from 'zod';
import {useCurrentFrame, Sequence, Easing, useVideoConfig} from 'remotion';
import {measureText} from '@remotion/layout-utils';

import {KeyFramesInspector} from '../../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {zThemeEnum} from '../../../acetti-themes/getThemeFromEnum';
import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from './useChartLayout';
import {DisplayGridLayout} from '../../../acetti-layout';
import {SparklineChartComponent} from './SparklineChartComponent';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {getLargeSparklineKeyFrames} from './getKeyframes';

const Y_DOMAIN_TYPE = 'FULL';

function formatCurrency(value: number): string {
	// Use toFixed(2) to format the number to two decimal places
	return `$${value.toFixed(2)}`;
}
// Example usage
// const formattedValue = formatCurrency(1023.3333);
// console.log(formattedValue); // Output: "$1023.33"

export const sparklinePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

type TSparklineChartWrapperProps = {
	data: {value: number; date: Date}[];
	width: number;
	height: number;
	theme: ThemeType;
	domain?: [number, number];
};

export const SparklineLarge: React.FC<TSparklineChartWrapperProps> = ({
	data,
	width,
	height,
	theme,
	domain,
	// TODO pass text props // Inter-Bold e.g.
}) => {
	const {durationInFrames} = useVideoConfig();

	const leftValueLabelTextProps = {
		fontFamily: 'Arial', // TODO use from text props
		fontWeight: 500,
		fontSize: 30,
		// letterSpacing: 1,
	};

	const rightValueLabelTextProps = {
		fontFamily: 'Arial', // TODO use from text props
		fontWeight: 500,
		fontSize: 36,
		// letterSpacing: 1,
	};

	const firstDataValue = data[0].value;
	const lastDataValue = data[data.length - 1].value;
	// TODO from data
	const firstValueLabel = formatCurrency(firstDataValue);
	const lastValueLabel = formatCurrency(lastDataValue);

	const leftValueLabelWidth = measureText({
		...leftValueLabelTextProps,
		text: firstValueLabel,
	}).width;

	const rightValueLabelWidth = measureText({
		...rightValueLabelTextProps,
		text: lastValueLabel,
	}).width;

	const chartLayout = useChartLayout({
		width,
		height,
		leftValueLabelWidth,
		rightValueLabelWidth,
	});

	return (
		<div style={{position: 'relative', width}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					hide={true}
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
								timeSeries={data}
								layoutAreas={{
									plot: chartLayout.areas.plot,
									xAxis: chartLayout.areas.xAxis,
									yAxis: chartLayout.areas.yAxis,
									leftValueLabel: chartLayout.areas.leftValueLabel,
									rightValueLabel: chartLayout.areas.rightValueLabel,
								}}
								// yDomainType={Y_DOMAIN_TYPE}
								theme={theme}
								yScale={yScale}
								periodScale={periodsScale}
								fromPeriodScale={currentSliceInfo.periodsScaleFrom}
								toPeriodScale={currentSliceInfo.periodsScaleTo}
								//
								currentSliceInfo={currentSliceInfo}
								leftValueLabel={firstValueLabel}
								leftValueLabelTextProps={leftValueLabelTextProps}
								rightValueLabel={lastValueLabel}
								rightValueLabelTextProps={rightValueLabelTextProps}
							/>
						);
					}}
				</LineChartAnimationContainer>
			</Sequence>
		</div>
	);
};
