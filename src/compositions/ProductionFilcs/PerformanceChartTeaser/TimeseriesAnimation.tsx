import {useVideoConfig, Easing, Sequence} from 'remotion';
import invariant from 'tiny-invariant';

import {usePeriodScaleAnimation} from '../../POCs/09-Timeseries/utils/usePeriodScaleAnimation';
import {useYScaleAnimation} from '../../POCs/09-Timeseries/utils/useYScaleAnimation';
import {usePage} from '../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {PageContext} from '../../../acetti-components/PageContext';
import {Page} from '../../../acetti-components/Page';
import {PerformanceChart} from './PerformanceChart';
import {DisplayGridLayout} from '../../../acetti-layout';
import {useXAxisAreaHeight} from '../../POCs/09-Timeseries/utils/Animated_XAxis';
import {Position} from '../../../acetti-layout/atoms/Position';
import {Animated_PercentageChangeArea} from '../../POCs/09-Timeseries/utils/Animated_PercentageChangeArea';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: TimeSeries;
	theme: ThemeType;
	lineColor: string;
};

export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
	lineColor,
}) => {
	const CHART_PAGE_MARGIN = 0;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height;

	return (
		<div style={{position: 'relative'}}>
			<div>
				<PageContext
					width={CHART_PAGE_WIDTH}
					height={CHART_PAGE_HEIGHT}
					margin={CHART_PAGE_MARGIN}
					nrBaselines={30}
					theme={theme}
				>
					<Page>
						<TimeseriesAnimationInside
							timeSeries={timeSeries}
							lineColor={lineColor}
						/>
					</Page>
				</PageContext>
			</div>
		</div>
	);
};

export const TimeseriesAnimationInside: React.FC<{
	timeSeries: TimeSeries;
	lineColor: string;
}> = ({timeSeries, lineColor}) => {
	const {durationInFrames} = useVideoConfig();

	const {contentWidth, contentHeight} = usePage();

	const td_buildup = Math.floor(durationInFrames * 0.1);

	const percentageChange_enter_start_keyframe = td_buildup;

	const tsDomainIndices = {
		full: [0, timeSeries.length] as [number, number],
	};

	const periodScaleAnimation = usePeriodScaleAnimation({
		timeSeries,
		periodScalesInitialWidth: 500,
		transitions: [
			{
				fromDomainIndices: tsDomainIndices.full, // if omitted & index===0, fill with [0,1]
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames,
					easingFunction: Easing.linear,
					transitionType: 'DEFAULT',
				},
			},
		],
	});

	const xAxisHeight = useXAxisAreaHeight();

	const yScaleAnimation = useYScaleAnimation({
		periodScaleAnimation,
		timeSeriesArray: [timeSeries],
		tickFormatter: (tick) => `${tick} $`,
		yScalesInitialHeight: 200,
		domainType: 'VISIBLE',
		paddingPerc: 0.1,
	});

	const yAxisWidth = yScaleAnimation.maxLabelComponentWidth;

	const chartLayout = useChartLayout({
		width: contentWidth,
		height: contentHeight,
		yAxisWidth,
		xAxisHeight,
	});

	const firstValue = timeSeries[0].value;
	const lastValue = timeSeries[timeSeries.length - 1].value;
	invariant(firstValue && lastValue);

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<PerformanceChart
				lineColor={lineColor}
				periodScaleAnimation={periodScaleAnimation}
				yScaleAnimation={yScaleAnimation}
				timeSeries={timeSeries}
				layoutAreas={{
					xAxis: chartLayout.areas.xAxis,
					plot: chartLayout.areas.plot,
					yAxis: chartLayout.areas.yAxis,
				}}
			/>

			<Sequence from={percentageChange_enter_start_keyframe}>
				<Position
					position={{
						left: chartLayout.areas.plot.x1,
						top: chartLayout.areas.plot.y1,
					}}
				>
					<Animated_PercentageChangeArea
						yScale={yScaleAnimation.yScale}
						//
						area={chartLayout.areas.plot}
						firstValue={firstValue}
						lastValue={lastValue}
						//
						lineColor={lineColor}
						gradientColor={lineColor}
						textColor={lineColor}
					/>
				</Position>
			</Sequence>

			<div style={{position: 'absolute', top: 0, left: 0}}>
				<DisplayGridLayout
					hide
					stroke="rgba(255,0,255,0.8)"
					fill="transparent"
					areas={chartLayout.areas}
					width={contentWidth}
					height={contentHeight}
				/>
			</div>
		</div>
	);
};
