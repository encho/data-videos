import {useVideoConfig, Easing, interpolate} from 'remotion';
import {ReactNode, useMemo} from 'react';

import {DisplayGridLayout} from '../../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {LineChart_YAxisShowcase} from './LineChart_YAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {
	PeriodScaleAnimationContainer,
	TPeriodScaleAnimationContext,
} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {PeriodScaleAnimationContextDebugger} from './PeriodScaleAnimationContextDebugger';

import {YScaleAnimationContainer} from './YScaleAnimationContainer';

// type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';
// const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

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

	const debugTheme = useThemeFromEnum('LORENZOBERTOLINI' as any);

	const CHART_PAGE_MARGIN = 60;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height * 0.5;
	const CHART_CONTENT_WIDTH = CHART_PAGE_WIDTH - 2 * CHART_PAGE_MARGIN;
	const CHART_CONTENT_HEIGHT = (CHART_PAGE_HEIGHT - 2 * CHART_PAGE_MARGIN) / 2;

	const DEBUG_PAGE_HEIGHT = height - CHART_PAGE_HEIGHT;

	const chartLayout = useChartLayout({
		width: CHART_CONTENT_WIDTH,
		height: CHART_CONTENT_HEIGHT,
	});

	// TODO use keyframes perhaps
	const td_buildup = Math.floor(durationInFrames * 0.2);
	const td_wait_1 = Math.floor(durationInFrames * 0.1);
	const td_zoom = Math.floor(durationInFrames * 0.2);
	const td_wait_2 = Math.floor(durationInFrames * 0.1);
	const td_buildup_again = Math.floor(durationInFrames * 0.2);
	const td_tear_down =
		durationInFrames -
		td_buildup -
		td_wait_1 -
		td_zoom -
		td_wait_2 -
		td_buildup_again;

	// TODO also allow for dates as indices eventually
	// TODO fix with [0,0] ??? really
	const tsDomainIndices = {
		start: [0, 10] as [number, number],
		full: [0, timeSeries.length] as [number, number],
		zoom: [
			Math.floor(timeSeries.length * 0.25),
			Math.floor(timeSeries.length * 0.75),
		] as [number, number],
	};

	const timeSeries2 = useMemo(() => {
		return timeSeries.map((it) => ({...it, value: it.value * 2}));
	}, []);

	const timeSeries3 = useMemo(() => {
		return timeSeries.map((it) => ({...it, value: it.value * 4}));
	}, []);

	return (
		<div style={{position: 'relative'}}>
			<PeriodScaleAnimationContainer
				timeSeries={timeSeries}
				area={chartLayout.areas.xAxis}
				transitions={[
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
							durationInFrames: td_wait_1,
							easingFunction: Easing.linear,
							transitionType: 'DEFAULT',
						},
					},
					{
						fromDomainIndices: tsDomainIndices.full, // if omitted, fill with previous fromDomainIndices
						toDomainIndices: tsDomainIndices.zoom,
						transitionSpec: {
							durationInFrames: td_zoom,
							easingFunction: Easing.linear,
							transitionType: 'ZOOM',
						},
					},
					{
						fromDomainIndices: tsDomainIndices.zoom, // if omitted, fill with previous fromDomainIndices
						toDomainIndices: tsDomainIndices.zoom,
						transitionSpec: {
							durationInFrames: td_wait_2,
							easingFunction: Easing.linear,
							transitionType: 'ZOOM',
						},
					},
					{
						fromDomainIndices: tsDomainIndices.zoom, // TODO if omitted, fill with previous fromDomainIndices
						toDomainIndices: tsDomainIndices.full,
						transitionSpec: {
							durationInFrames: td_buildup_again,
							easingFunction: Easing.linear,
							transitionType: 'ZOOM',
						},
					},
					{
						fromDomainIndices: tsDomainIndices.full, // TODO if omitted, fill with previous fromDomainIndices
						toDomainIndices: tsDomainIndices.start,
						transitionSpec: {
							durationInFrames: td_tear_down,
							easingFunction: Easing.linear,
							transitionType: 'DEFAULT',
						},
					},
				]}
			>
				{(periodScaleAnimationContext) => {
					return (
						<div>
							<PageContext
								width={CHART_PAGE_WIDTH}
								height={CHART_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={48}
								theme={theme}
							>
								<Page
								// show
								>
									{() => {
										return (
											<>
												<div style={{position: 'absolute'}}>
													<DisplayGridLayout
														stroke={'rgba(255,0,255,0.5)'}
														fill="transparent"
														// hide={true}
														areas={chartLayout.areas}
														width={width}
														height={height}
													/>
												</div>
												<YScaleAnimationContainer
													periodScaleAnimationContext={
														periodScaleAnimationContext
													}
													timeSeriesArray={[
														timeSeries,
														timeSeries2,
														timeSeries3,
													]}
													area={chartLayout.areas.yAxis}
													// domainType="VISIBLE"
													domainType="ZERO"
													paddingPerc={0.2}
												>
													{(yScaleAnimationContext) => {
														return (
															<div>
																<LineChart_YAxisShowcase
																	periodScaleAnimationContext={
																		periodScaleAnimationContext
																	}
																	yScaleAnimationContext={
																		yScaleAnimationContext
																	}
																	timeSeries={timeSeries}
																	timeSeries2={timeSeries2}
																	timeSeries3={timeSeries3}
																	layoutAreas={{
																		chart: chartLayout.areas.chart,
																		xAxis: chartLayout.areas.xAxis,
																		plot: chartLayout.areas.plot,
																		yAxis: chartLayout.areas.yAxis,
																	}}
																/>
																<LineChart_YAxisShowcase
																	periodScaleAnimationContext={
																		periodScaleAnimationContext
																	}
																	yScaleAnimationContext={
																		yScaleAnimationContext
																	}
																	timeSeries={timeSeries}
																	timeSeries2={timeSeries2}
																	timeSeries3={timeSeries2}
																	layoutAreas={{
																		chart: chartLayout.areas.chart,
																		xAxis: chartLayout.areas.xAxis,
																		plot: chartLayout.areas.plot,
																		yAxis: chartLayout.areas.yAxis,
																	}}
																/>
																<div
																	style={{
																		backgroundColor: 'cyan',
																		fontSize: 50,
																	}}
																>
																	{JSON.stringify(
																		yScaleAnimationContext,
																		undefined,
																		2
																	)}
																</div>
															</div>
														);
													}}
												</YScaleAnimationContainer>
											</>
										);
									}}
								</Page>
							</PageContext>
							<PageContext
								width={CHART_PAGE_WIDTH}
								height={DEBUG_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={40}
								theme={debugTheme}
							>
								<Page show>
									<PeriodScaleAnimationContextDebugger
										{...periodScaleAnimationContext}
									/>
								</Page>
							</PageContext>
						</div>
					);
				}}
			</PeriodScaleAnimationContainer>
		</div>
	);
};
