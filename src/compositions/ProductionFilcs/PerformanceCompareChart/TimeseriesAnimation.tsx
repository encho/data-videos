import {useVideoConfig, Easing, Sequence} from 'remotion';
import invariant from 'tiny-invariant';

import {usePeriodScaleAnimation} from '../../POCs/09-Timeseries/utils/usePeriodScaleAnimation';
import {useYScaleAnimation} from '../../POCs/09-Timeseries/utils/useYScaleAnimation';
import {usePage} from '../../../acetti-components/PageContext';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {PageContext} from '../../../acetti-components/PageContext';
import {Page} from '../../../acetti-components/Page';
import {PerformanceCompareChart} from './PerformanceCompareChart';
import {DisplayGridLayout} from '../../../acetti-layout';
import {useXAxisAreaHeight} from '../../POCs/09-Timeseries/utils/Animated_XAxis';
import {HighlightPeriodsMulti} from '../../../acetti-ts-components/HighlightPeriodsMulti';
import {SlideOut, SlideIn} from '../../../SlideIn';
import {ObliquePlatte} from '../../../acetti-components/ObliquePlatte';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {Platte3D_SlideInAndOut} from '../../POCs/3D-Experiments/ShearedWrappers/Platte3D_SlideInAndOut';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries1: TimeSeries;
	timeSeries2: TimeSeries;
	theme: ThemeType;
};

export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries1,
	timeSeries2,
	theme,
}) => {
	const CHART_PAGE_MARGIN = 40;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height;

	return (
		<div style={{position: 'relative'}}>
			<Platte3D_SlideInAndOut
				width={CHART_PAGE_WIDTH}
				height={CHART_PAGE_HEIGHT}
			>
				<PageContext
					width={CHART_PAGE_WIDTH}
					height={CHART_PAGE_HEIGHT}
					margin={CHART_PAGE_MARGIN}
					nrBaselines={30}
					theme={theme}
				>
					<Page boxShadow borderRadius={5}>
						<TimeseriesAnimationInside
							timeSeries1={timeSeries1}
							timeSeries2={timeSeries2}
						/>
					</Page>
				</PageContext>
			</Platte3D_SlideInAndOut>
		</div>
	);
};

export const TimeseriesAnimationInside: React.FC<{
	timeSeries1: TimeSeries;
	timeSeries2: TimeSeries;
}> = ({timeSeries1, timeSeries2}) => {
	const {durationInFrames} = useVideoConfig();

	const {contentWidth, contentHeight, theme} = usePage();

	// TODO use keyframes perhaps
	const td_buildup = Math.floor(durationInFrames * 0.5);
	const td_freeze = durationInFrames - td_buildup;

	const percentageChange_enter_start_keyframe = td_buildup;

	invariant(timeSeries1.length === timeSeries2.length);

	// TODO also allow for dates as indices eventually
	// TODO fix with [0,0] ??? really
	const tsDomainIndices = {
		start: [0, 1] as [number, number],
		full: [0, timeSeries1.length] as [number, number],
	};

	const periodScaleAnimation = usePeriodScaleAnimation({
		timeSeries: timeSeries1,
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

	const xAxisHeight = useXAxisAreaHeight();

	const yScaleAnimationUpper = useYScaleAnimation({
		periodScaleAnimation,
		timeSeriesArray: [timeSeries1, timeSeries2],
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
			<PerformanceCompareChart
				periodScaleAnimation={periodScaleAnimation}
				yScaleAnimation={yScaleAnimationUpper}
				timeSeries1={timeSeries1}
				timeSeries2={timeSeries2}
				layoutAreas={{
					xAxis: chartLayout.areas.xAxis,
					plot: chartLayout.areas.plot,
					yAxis: chartLayout.areas.yAxis,
				}}
			/>

			<Sequence from={percentageChange_enter_start_keyframe}>
				<HighlightPeriodsMulti
					timeSeries={timeSeries1}
					timeSeries2={timeSeries2}
					area={chartLayout.areas.plot}
					periodsScale={periodScaleAnimation.periodsScale}
					domainIndices={[220, 420] as [number, number]}
					currentFrame={22}
					durationInFrames={200}
					fadeInDurationInFrames={90}
					yScaleCurrent={yScaleAnimationUpper.yScale}
					label="Interesting Period"
					theme={theme.timeseriesComponents.HighlightPeriodsArea}
				/>
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
