import {useVideoConfig, Easing} from 'remotion';
import {useMemo} from 'react';

import {usePeriodScaleAnimation} from '../utils/usePeriodScaleAnimation';
import {useYScaleAnimation} from '../utils/useYScaleAnimation';
import {usePage} from '../../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {LineChart_YAxisShowcase} from './LineChart_YAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PeriodScaleAnimationInspector} from '../utils/PeriodScaleAnimationInspector';
import {DisplayGridLayout} from '../../../../acetti-layout';
import {useXAxisAreaHeight} from '../utils/Animated_XAxis';

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
	const CHART_PAGE_WIDTH = width;

	return (
		<div style={{position: 'relative'}}>
			<div>
				<PageContext
					width={CHART_PAGE_WIDTH}
					// height={CHART_PAGE_HEIGHT}
					height={height}
					// margin={CHART_PAGE_MARGIN}
					margin={100}
					nrBaselines={60}
					// theme={theme}
					theme={theme}
				>
					<Page show>
						<TimeseriesAnimationInside timeSeries={timeSeries} />
					</Page>
				</PageContext>
			</div>
		</div>
	);
};

export const TimeseriesAnimationInside: React.FC<{
	timeSeries: {date: Date; value: number}[];
}> = ({
	// width,
	// height,
	timeSeries,
	// theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const debugTheme = useThemeFromEnum('LORENZOBERTOLINI');

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
	}, [timeSeries]);

	const timeSeries3 = useMemo(() => {
		return timeSeries.map((it) => ({...it, value: it.value * 4}));
	}, [timeSeries]);

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

	const {contentWidth, contentHeight} = usePage();

	const CHART_HEIGHT = contentHeight * 0.5;

	const xAxisHeight = useXAxisAreaHeight();

	const yScaleAnimationUpper = useYScaleAnimation({
		periodScaleAnimation,
		timeSeriesArray: [timeSeries, timeSeries2, timeSeries3],
		tickFormatter: (tick) => `${tick} $`,
		yScalesInitialHeight: 200,
		domainType: 'ZERO',
		paddingPerc: 0.3,
	});

	const yScaleAnimationLower = useYScaleAnimation({
		periodScaleAnimation,
		timeSeriesArray: [timeSeries, timeSeries2],
		tickFormatter: (tick) => `${tick} $$$`,
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
		height: CHART_HEIGHT,
		yAxisWidth,
		xAxisHeight,
	});

	return (
		<div style={{}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					// hide
					stroke="rgba(255,0,255,1)"
					fill="transparent"
					// hide={true}
					areas={chartLayout.areas}
					width={contentWidth}
					height={contentHeight}
				/>
			</div>
			<div
				style={{
					height: chartLayout.height,
				}}
			>
				<LineChart_YAxisShowcase
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimationUpper}
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
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimationLower}
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

			<PageContext
				width={contentWidth}
				height={contentHeight - CHART_HEIGHT}
				margin={0}
				nrBaselines={40}
				theme={debugTheme}
			>
				<Page show>
					<PeriodScaleAnimationInspector {...periodScaleAnimation} />
				</Page>
			</PageContext>
		</div>
	);
};
