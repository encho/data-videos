import {z} from 'zod';
import {Sequence, Easing} from 'remotion';

import {zThemeEnum} from '../../../acetti-themes/getThemeFromEnum';
import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from '../../../compositions/POCs/SparklinePOC/useChartLayout';
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
	const chartLayout = useChartLayout({
		width,
		height,
	});

	return (
		<div style={{position: 'relative', width}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					// stroke={'yellow'}
					// fill=""
					hide={true}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>
			<Sequence from={90 * 1}>
				{/* TODO this code has to be included in SparklineChart code */}
				{/* s.t.: */}
				{/* here: */}
				{/* <SparklineChart ... /> */}
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
							durationInFrames: 90 * 4, // here is full duration now
							easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
							numberOfSlices: 20,
							transitionType: 'DEFAULT',
						},
					]}
				>
					{({
						periodsScale,
						yScale,
						currentSliceInfo,
						// currentTransitionInfo,
					}) => {
						return (
							<SparklineChartComponent
								timeSeries={data}
								layoutAreas={{
									plot: chartLayout.areas.plot,
									xAxis: chartLayout.areas.xAxis,
									yAxis: chartLayout.areas.yAxis,
								}}
								yDomainType={Y_DOMAIN_TYPE}
								theme={theme}
								yScale={yScale}
								periodScale={periodsScale}
								fromPeriodScale={currentSliceInfo.periodsScaleFrom}
								toPeriodScale={currentSliceInfo.periodsScaleTo}
								//
								currentSliceInfo={currentSliceInfo}
							/>
						);
					}}
				</LineChartAnimationContainer>
			</Sequence>
		</div>
	);
};