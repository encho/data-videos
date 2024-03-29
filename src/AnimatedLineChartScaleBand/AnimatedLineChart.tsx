import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
import {useChartLayout} from './useChartLayout';
import {MinimapContainer} from './MinimapContainer';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2022, 0, 1)
);

export const AnimatedLineChartSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
	axisSpecType: z.enum(['STANDARD', 'INTER_MONTHS']),
});

export const AnimatedLineChart: React.FC<
	z.infer<typeof AnimatedLineChartSchema>
> = ({backgroundColor, textColor, axisSpecType}) => {
	const {durationInFrames, height, width} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const TITLE_START_FRAME = 0;
	const TITLE_DURATION_IN_FRAMES = 30;

	const FIRST_TS_START_FRAME = TITLE_START_FRAME + TITLE_DURATION_IN_FRAMES;
	const FIRST_TS_TRANSITION_IN_FRAMES = 3.5 * 30;

	const SECOND_TS_START_FRAME =
		FIRST_TS_START_FRAME + FIRST_TS_TRANSITION_IN_FRAMES;
	const SECOND_TS_TRANSITION_IN_FRAMES = 3.5 * 30;

	const THIRD_TS_START_FRAME =
		SECOND_TS_START_FRAME + SECOND_TS_TRANSITION_IN_FRAMES;
	const THIRD_TS_TRANSITION_IN_FRAMES =
		durationInFrames -
		TITLE_DURATION_IN_FRAMES -
		FIRST_TS_TRANSITION_IN_FRAMES -
		SECOND_TS_TRANSITION_IN_FRAMES;

	const indicesView_1 = [0, 10] as [number, number];
	const indicesView_2 = [50, Math.floor(timeSeries.length / 2)] as [
		number,
		number
	];
	// const indicesView_2 = [timeSeries.length - 3, timeSeries.length - 1] as [
	// 	number,
	// 	number
	// ];
	const indicesView_3 = [50 + 100, Math.floor(timeSeries.length / 2) + 100] as [
		number,
		number
	];
	// const indicesView_3 = [10, 20] as [number, number];
	const indicesView_4 = [0, timeSeries.length - 1] as [number, number];

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<DisplayGridLayout
				stroke={textColor}
				fill="transparent"
				hide={true}
				// hide={false}
				areas={chartLayout.areas}
				width={width}
				height={height}
			/>

			<Sequence
				from={TITLE_START_FRAME}
				durationInFrames={TITLE_DURATION_IN_FRAMES}
			>
				<h1 style={{color: textColor, fontSize: 300}}>Start</h1>
			</Sequence>

			<Sequence
				from={FIRST_TS_START_FRAME}
				durationInFrames={FIRST_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_1}
					toVisibleDomainIndices={indicesView_2}
					// TODO the layout should be within the chartcontainer
					// only pass width and height!!
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					lineColor={textColor}
					textColor={textColor}
				/>

				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_1}
					toVisibleDomainIndices={indicesView_2}
					lineColor={textColor}
					textColor={textColor}
				/>
			</Sequence>
			<Sequence
				from={SECOND_TS_START_FRAME}
				durationInFrames={SECOND_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_2}
					toVisibleDomainIndices={indicesView_3}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					lineColor={textColor}
					textColor={textColor}
				/>
				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_2}
					toVisibleDomainIndices={indicesView_3}
					lineColor={textColor}
					textColor={textColor}
				/>
			</Sequence>
			<Sequence
				from={THIRD_TS_START_FRAME}
				durationInFrames={THIRD_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_3}
					toVisibleDomainIndices={indicesView_4}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					lineColor={textColor}
					textColor={textColor}
				/>
				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_3}
					toVisibleDomainIndices={indicesView_4}
					lineColor={textColor}
					textColor={textColor}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
