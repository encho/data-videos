import {useVideoConfig, Easing} from 'remotion';

import {usePeriodScaleAnimation} from '../utils/usePeriodScaleAnimation';
import {DisplayGridLayout} from '../../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {LineChart_XAxisShowcase} from './LineChart_XAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PeriodScaleAnimationInspector} from '../utils/PeriodScaleAnimationInspector';

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
	const CHART_PAGE_HEIGHT = height * 0.25;
	const CHART_CONTENT_WIDTH = CHART_PAGE_WIDTH - 2 * CHART_PAGE_MARGIN;
	const CHART_CONTENT_HEIGHT = CHART_PAGE_HEIGHT - 2 * CHART_PAGE_MARGIN;

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

	const periodScaleAnimation = usePeriodScaleAnimation({
		timeSeries,
		periodScalesInitialWidth: chartLayout.areas.xAxis.width,
		transitions: [
			{
				fromDomainIndices: tsDomainIndices.start, // if omitted & index===0, fill with [0,1]
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames: td_buildup,
					easingFunction: Easing.linear,
					// numberOfSlices: 5,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.full, // if omitted & index===0, fill with [0,1]
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames: td_wait_1,
					easingFunction: Easing.linear,
					// numberOfSlices: 5,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.full, // if omitted, fill with previous fromDomainIndices
				toDomainIndices: tsDomainIndices.zoom,
				transitionSpec: {
					durationInFrames: td_zoom,
					easingFunction: Easing.linear,
					// numberOfSlices: 5, why does the year behave so weidly with 5 and not with 1 here?
					// numberOfSlices: 1,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.zoom, // if omitted, fill with previous fromDomainIndices
				toDomainIndices: tsDomainIndices.zoom,
				transitionSpec: {
					durationInFrames: td_wait_2,
					easingFunction: Easing.linear,
					// numberOfSlices: 5, why does the year behave so weidly with 5 and not with 1 here?
					// numberOfSlices: 1,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.zoom, // TODO if omitted, fill with previous fromDomainIndices
				toDomainIndices: tsDomainIndices.full,
				transitionSpec: {
					durationInFrames: td_buildup_again,
					easingFunction: Easing.ease,
					// numberOfSlices: 5,
					numberOfSlices: 1,
					transitionType: 'DEFAULT',
				},
			},
			{
				fromDomainIndices: tsDomainIndices.full, // TODO if omitted, fill with previous fromDomainIndices
				toDomainIndices: tsDomainIndices.start,
				transitionSpec: {
					durationInFrames: td_tear_down,
					easingFunction: Easing.ease,
					transitionType: 'DEFAULT',
				},
			},
		],
	});

	return (
		<div>
			<PageContext
				width={CHART_PAGE_WIDTH}
				height={CHART_PAGE_HEIGHT}
				margin={CHART_PAGE_MARGIN}
				nrBaselines={20}
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
										stroke={'rgba(255,0,255,0.4)'}
										fill="transparent"
										hide={true}
										areas={chartLayout.areas}
										width={width}
										height={height}
									/>
								</div>
								<LineChart_XAxisShowcase
									periodScaleAnimation={periodScaleAnimation}
									layoutAreas={{
										xAxis: chartLayout.areas.xAxis,
										xAxis_days: chartLayout.areas.xAxis_days,
										xAxis_monthStarts: chartLayout.areas.xAxis_monthStarts,
										xAxis_quarterStarts: chartLayout.areas.xAxis_quarterStarts,
									}}
								/>
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
					<PeriodScaleAnimationInspector {...periodScaleAnimation} />
				</Page>
			</PageContext>
		</div>
	);
};
