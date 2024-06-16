import {Sequence, useVideoConfig, Easing} from 'remotion';

// TODO deprecate! check if other components need this!
// import {TTheme, myTheme} from '../../theme';
import {PercentageChangeArea} from './components/PercentageChangeArea';
import {DisplayGridLayout} from '../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {BasicLineChart} from './BasicLineChart';
import {LineChartAnimationContainer} from './LineChartAnimationContainer';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme: ThemeType;
};

export const SinglePriceChartComponent: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	// const LAST_STILL_DURATION = 2.5 * 90;

	// const transitionDurationInFrames_0_1 = durationInFrames - LAST_STILL_DURATION;
	const transitionDurationInFrames_0_1 = durationInFrames;

	const visibleDomainIndices_0 = [0, 0] as [number, number];
	const visibleDomainIndices_1 = [0, timeSeries.length] as [number, number];
	// const visibleDomainIndices_2 = [0, timeSeries.length] as [number, number];

	return (
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'#f05122'}
					fill="transparent"
					hide={true}
					// hide={false}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>

			<LineChartAnimationContainer
				timeSeries={timeSeries}
				viewSpecs={[
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_0,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_1,
					},
				]}
				transitionSpecs={[
					{
						durationInFrames: transitionDurationInFrames_0_1,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
					},
				]}
			>
				{({periodsScale, yScale, easingPercentage}) => {
					return (
						<div>
							<BasicLineChart
								timeSeries={timeSeries}
								layoutAreas={{
									plot: chartLayout.areas.plot,
									xAxis: chartLayout.areas.xAxis,
									yAxis: chartLayout.areas.yAxis,
								}}
								yDomainType={Y_DOMAIN_TYPE}
								theme={theme}
								//
								yScale={yScale}
								periodScale={periodsScale}
							/>

							<Sequence from={transitionDurationInFrames_0_1}>
								<PercentageChangeArea
									firstValue={timeSeries[0].value}
									lastValue={timeSeries[timeSeries.length - 1].value}
									enterDurationInFrames={60}
									periodsScale={periodsScale}
									yScale={yScale}
									easingPercentage={easingPercentage}
									plotArea={chartLayout.areas.plot}
									theme={theme.timeseriesComponents.percentageChangeArea}
								/>
							</Sequence>
						</div>
					);
				}}
			</LineChartAnimationContainer>
		</div>
	);
};
