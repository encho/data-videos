import {z} from 'zod';
import {Sequence, Easing} from 'remotion';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {LineChartAnimationContainer} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {useChartLayout} from './useChartLayout';
import {DisplayGridLayout} from '../../../acetti-layout';
import {SparklineChart} from '../../../acetti-ts-components/SparklineChart';

const Y_DOMAIN_TYPE = 'FULL';

const timeSeries = [
	{value: 149, date: new Date('2010-12-31')},
	{value: 57, date: new Date('2011-12-31')},
	{value: 58, date: new Date('2012-12-31')},
	{value: 65, date: new Date('2013-12-31')},
	{value: 77, date: new Date('2014-12-31')},
	{value: 94, date: new Date('2015-12-31')},
	{value: 91, date: new Date('2016-12-31')},
	{value: 65, date: new Date('2017-12-31')},
	{value: 114, date: new Date('2018-12-31')},
	{value: 60, date: new Date('2019-12-31')},
	{value: 64, date: new Date('2020-12-31')},
	{value: 118, date: new Date('2021-12-31')},
	{value: 94, date: new Date('2022-12-31')},
	{value: 127, date: new Date('2023-12-31')},
	{value: 68, date: new Date('2024-12-31')},
	{value: 40, date: new Date('2025-12-31')},
	{value: 88, date: new Date('2026-12-31')},
];

export const sparklinePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SparklinePOC: React.FC<z.infer<typeof sparklinePOCSchema>> = ({
	themeEnum,
}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const CHART_WIDTH = 800;
	const CHART_HEIGHT = 400;
	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 60,
							marginTop: 50,
							fontFamily: 'Arial',
							fontWeight: 700,
						}}
					>
						<FadeInAndOutText>SparklinePOC</FadeInAndOutText>
					</div>
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'center', marginTop: 180}}>
				<div style={{position: 'relative', width: CHART_WIDTH}}>
					<div style={{position: 'absolute'}}>
						<DisplayGridLayout
							// stroke={'yellow'}
							// fill=""
							hide={true}
							areas={chartLayout.areas}
							width={CHART_WIDTH}
							height={CHART_HEIGHT}
						/>
					</div>
					<Sequence from={90 * 1}>
						{/* TODO this code has to be included in SparklineChart code */}
						{/* s.t.: */}
						{/* here: */}
						{/* <SparklineChart ... /> */}
						<LineChartAnimationContainer
							timeSeries={timeSeries}
							viewSpecs={[
								{
									area: chartLayout.areas.plot,
									visibleDomainIndices: [0.5, timeSeries.length - 0.5],
								},
								{
									area: chartLayout.areas.plot,
									visibleDomainIndices: [0.5, timeSeries.length - 0.5],
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
								currentTransitionInfo,
							}) => {
								return (
									<div>
										<SparklineChart
											timeSeries={timeSeries}
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
									</div>
								);
							}}
						</LineChartAnimationContainer>
					</Sequence>
				</div>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
