import {useVideoConfig, Easing} from 'remotion';
import {useMemo} from 'react';

import {usePeriodScaleAnimation} from './usePeriodScaleAnimation';
import {useYScaleAnimation} from './useYScaleAnimation';
import {usePage} from '../../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {LineChart_YAxisShowcase} from './LineChart_YAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PeriodScaleAnimationContainer} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {PeriodScaleAnimationContextDebugger} from './PeriodScaleAnimationContextDebugger';
import {DisplayGridLayout} from '../../../../acetti-layout';

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
	const CHART_PAGE_HEIGHT = height * 0.4;

	const DEBUG_PAGE_HEIGHT = height - CHART_PAGE_HEIGHT;

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
		],
	});

	return (
		<div style={{position: 'relative'}}>
			<PeriodScaleAnimationContainer
				timeSeries={timeSeries}
				periodScalesInitialWidth={500} // TODO in this case leave empty
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
				{(periodScaleAnimationContext22222j) => {
					return (
						<div>
							<PageContext
								width={CHART_PAGE_WIDTH}
								height={CHART_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={48}
								theme={theme}
							>
								<Page show>
									{() => {
										const {contentWidth, contentHeight} = usePage();

										const yScaleAnimationUpper = useYScaleAnimation({
											periodScaleAnimationContext: periodScaleAnimation,
											timeSeriesArray: [timeSeries, timeSeries2, timeSeries3],
											tickFormatter: (tick) => `${tick} EUR`,
											yScalesInitialHeight: 200,
											domainType: 'ZERO',
											paddingPerc: 0.3,
										});

										const yScaleAnimationLower = useYScaleAnimation({
											// TODO rename to periodScaleAnimation
											periodScaleAnimationContext: periodScaleAnimation,
											timeSeriesArray: [timeSeries, timeSeries2],
											tickFormatter: (tick) => `${tick} EUR`,
											yScalesInitialHeight: 200,
											domainType: 'VISIBLE',
											paddingPerc: 0,
											nrTicks: 2,
										});

										const yAxisWidth = Math.max(
											yScaleAnimationUpper.maxLabelComponentWidth,
											yScaleAnimationLower.maxLabelComponentWidth
										);

										const chartLayout = useChartLayout({
											width: contentWidth,
											height: contentHeight,
											yAxisWidth,
										});

										return (
											<div
												style={{
													position: 'relative',
												}}
											>
												<div style={{position: 'absolute'}}>
													<DisplayGridLayout
														stroke={'rgba(255,0,255,0.5)'}
														fill="transparent"
														// hide={true}
														areas={chartLayout.areas}
														width={contentWidth}
														height={contentHeight}
													/>
												</div>

												<LineChart_YAxisShowcase
													// TODO rename to periodScaleAnimation
													periodScaleAnimationContext={periodScaleAnimation}
													// TODO rename to yScaleAnimation
													yScaleAnimationContext={yScaleAnimationUpper}
													timeSeries={timeSeries}
													timeSeries2={timeSeries2}
													timeSeries3={timeSeries3}
													layoutAreas={{
														xAxis: chartLayout.areas.xAxis,
														plot: chartLayout.areas.plot,
														yAxis: chartLayout.areas.yAxis,
													}}
												/>
												<LineChart_YAxisShowcase
													periodScaleAnimationContext={periodScaleAnimation}
													yScaleAnimationContext={yScaleAnimationLower}
													timeSeries={timeSeries}
													timeSeries2={timeSeries2}
													timeSeries3={timeSeries2}
													layoutAreas={{
														xAxis: chartLayout.areas.xAxis2,
														plot: chartLayout.areas.plot2,
														yAxis: chartLayout.areas.yAxis2,
													}}
												/>
											</div>
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
										{...periodScaleAnimation}
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
