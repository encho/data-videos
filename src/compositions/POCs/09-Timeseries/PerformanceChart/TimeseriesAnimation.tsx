import {useVideoConfig, Easing, Sequence} from 'remotion';

import {usePeriodScaleAnimation} from '../utils/usePeriodScaleAnimation';
import {useYScaleAnimation} from '../utils/useYScaleAnimation';
import {usePage} from '../../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {PerformanceChart} from './PerformanceChart';
import {DisplayGridLayout} from '../../../../acetti-layout';
import {useXAxisAreaHeight} from '../utils/Animated_XAxis';
import {Position} from '../../../../acetti-ts-base/Position';
import {Animated_PercentageChangeArea} from '../utils/Animated_PercentageChangeArea';
import {OpacifyInAndOut} from '../../../../SlideIn';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme: ThemeType;
};

export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_PAGE_MARGIN = 40;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height;

	// TODO use keyframes perhaps
	const td_buildup = Math.floor(durationInFrames * 0.5);
	const td_freeze = durationInFrames - td_buildup;

	const percentageChange_enter_start_keyframe = td_buildup;

	// TODO also allow for dates as indices eventually
	// TODO fix with [0,0] ??? really
	const tsDomainIndices = {
		start: [0, 1] as [number, number],
		full: [0, timeSeries.length] as [number, number],
	};

	const periodScaleAnimation = usePeriodScaleAnimation({
		timeSeries,
		periodScalesInitialWidth: 500,
		transitions: [
			{
				fromDomainIndices: tsDomainIndices.start, // if omitted & index===0, fill with [0,1]
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames: td_buildup,
					easingFunction: Easing.linear,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.full, // if omitted & index===0, fill with [0,1]
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames: td_freeze,
					easingFunction: Easing.linear,
					transitionType: 'DEFAULT',
				},
			},
		],
	});

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
					<OpacifyInAndOut>
						<Page boxShadow borderRadius={5}>
							{() => {
								const {contentWidth, contentHeight} = usePage();

								const xAxisHeight = useXAxisAreaHeight();

								const yScaleAnimationUpper = useYScaleAnimation({
									periodScaleAnimation,
									timeSeriesArray: [timeSeries],
									tickFormatter: (tick) => `${tick} $`,
									yScalesInitialHeight: 200,
									domainType: 'VISIBLE',
									paddingPerc: 0.1,
								});

								const yAxisWidth = yScaleAnimationUpper.maxLabelComponentWidth;

								const chartLayout = useChartLayout({
									width: contentWidth,
									height: contentHeight,
									yAxisWidth,
									xAxisHeight,
								});

								return (
									<div
										style={{
											position: 'relative',
										}}
									>
										<PerformanceChart
											periodScaleAnimation={periodScaleAnimation}
											yScaleAnimation={yScaleAnimationUpper}
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
												{/* TODO port to Animated_Line */}
												<Animated_PercentageChangeArea
													// periodsScale={periodScaleAnimation.periodsScale}
													yScale={yScaleAnimationUpper.yScale}
													//
													area={chartLayout.areas.plot}
													firstValue={timeSeries[0].value}
													lastValue={timeSeries[timeSeries.length - 1].value}
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
							}}
						</Page>
					</OpacifyInAndOut>
				</PageContext>
			</div>
		</div>
	);
};
