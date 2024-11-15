import {useVideoConfig, Easing} from 'remotion';

import {usePeriodScaleAnimation} from '../utils/usePeriodScaleAnimation';
import {useYScaleAnimation} from '../utils/useYScaleAnimation';
import {usePage} from '../../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {LineChart_YAxisShowcase} from './LineChart_YAxisShowcase';
import {DisplayGridLayout} from '../../../../acetti-layout';
import {useXAxisAreaHeight} from '../utils/Animated_XAxis';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';

type TAnimatedLineChart2Props = {
	timeSeries: {value: number; date: Date}[];
};

export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	timeSeries,
}) => {
	return (
		<div style={{position: 'relative'}}>
			<TimeseriesAnimationInside timeSeries={timeSeries} />
		</div>
	);
};

export const TimeseriesAnimationInside: React.FC<{
	timeSeries: TimeSeries;
}> = ({timeSeries}) => {
	const {durationInFrames} = useVideoConfig();

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
		timeSeriesArray: [timeSeries],
		tickFormatter: (tick) => `${tick} $`,
		yScalesInitialHeight: 200,
		domainType: 'VISIBLE',
		paddingPerc: 0.3,
	});

	const yAxisWidth = yScaleAnimationUpper.maxLabelComponentWidth;

	const chartLayout = useChartLayout({
		width: contentWidth,
		height: CHART_HEIGHT,
		yAxisWidth,
		xAxisHeight,
	});

	return (
		<div>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					// hide
					stroke="rgba(255,0,255,1)"
					fill="transparent"
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
					layoutAreas={{
						xAxis: chartLayout.areas.xAxis,
						plot: chartLayout.areas.plot,
						yAxis: chartLayout.areas.yAxis,
					}}
				/>
			</div>
		</div>
	);
};
