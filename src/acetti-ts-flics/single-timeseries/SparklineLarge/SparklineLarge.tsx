import {z} from 'zod';
import {Sequence, Easing, useVideoConfig} from 'remotion';
import {measureText} from '@remotion/layout-utils';

import {zThemeEnum} from '../../../acetti-themes/getThemeFromEnum';
import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from './useChartLayout';
import {DisplayGridLayout} from '../../../acetti-layout';
import {SparklineChartComponent} from './SparklineChartComponent';
import {ThemeType} from '../../../acetti-themes/themeTypes';

const Y_DOMAIN_TYPE = 'FULL';

export const sparklinePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

type TSparklineChartWrapperProps = {
	data: {value: number; date: Date}[];
	width: number;
	height: number;
	theme: ThemeType;
};

export const SparklineLarge: React.FC<TSparklineChartWrapperProps> = ({
	data,
	width,
	height,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const leftValueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		fontSize: 30,
		// letterSpacing: 1,
	};

	const rightValueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		fontSize: 36,
		// letterSpacing: 1,
	};

	const firstValueLabel = '$1000.00';
	const lastValueLabel = '$1023.33';

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
			{/* <Sequence from={90 * 1}> */}
			<Sequence from={90 * 0}>
				<LineChartAnimationContainer
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
								yDomainType={Y_DOMAIN_TYPE}
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
