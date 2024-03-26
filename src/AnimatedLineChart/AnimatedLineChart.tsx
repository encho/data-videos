import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
import {useChartLayout} from './useChartLayout';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2030, 0, 20)
);

export const AnimatedLineChartSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
	axisSpecType: z.enum(['STANDARD', 'INTER_MONTHS']),
});

export const AnimatedLineChart: React.FC<
	z.infer<typeof AnimatedLineChartSchema>
> = ({backgroundColor, textColor, axisSpecType}) => {
	// const currentFrame = useCurrentFrame();
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
	// durationInFrames - TITLE_DURATION_IN_FRAMES - FIRST_TS_TRANSITION_IN_FRAMES;

	const THIRD_TS_START_FRAME =
		SECOND_TS_START_FRAME + SECOND_TS_TRANSITION_IN_FRAMES;
	const THIRD_TS_TRANSITION_IN_FRAMES =
		durationInFrames -
		TITLE_DURATION_IN_FRAMES -
		FIRST_TS_TRANSITION_IN_FRAMES -
		SECOND_TS_TRANSITION_IN_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<DisplayGridLayout
				stroke={textColor}
				fill="transparent"
				// hide={true}
				hide={false}
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
				{/* IN THIS COMPONENT ALL THE ANIMATION IS CONCERTED (SHARED STATE) */}
				<AnimatedLineChartContainer
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					timeSeries={timeSeries}
					fromDomainIndices={{start: 0, end: 500}}
					toDomainIndices={{start: 0, end: 1000}}
					textColor={textColor}
					axisSpecType={axisSpecType}
				/>
			</Sequence>

			<Sequence
				from={SECOND_TS_START_FRAME}
				durationInFrames={SECOND_TS_TRANSITION_IN_FRAMES}
			>
				{/* IN THIS COMPONENT ALL THE ANIMATION IS CONCERTED (SHARED STATE) */}
				<AnimatedLineChartContainer
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					timeSeries={timeSeries}
					// fromDomainIndices={{start: 500, end: 1000}}
					fromDomainIndices={{start: 0, end: 1000}}
					toDomainIndices={{start: 0, end: 500}}
					textColor={textColor}
					// textColor={'#f05122'}
					axisSpecType={axisSpecType}
				/>
			</Sequence>

			<Sequence
				from={THIRD_TS_START_FRAME}
				durationInFrames={THIRD_TS_TRANSITION_IN_FRAMES}
			>
				{/* IN THIS COMPONENT ALL THE ANIMATION IS CONCERTED (SHARED STATE) */}
				<AnimatedLineChartContainer
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					timeSeries={timeSeries}
					// fromDomainIndices={{start: 500, end: 1000}}
					fromDomainIndices={{start: 0, end: 500}}
					toDomainIndices={{start: 0, end: timeSeries.length - 1}}
					textColor={textColor}
					// textColor={'#f05122'}
					axisSpecType={axisSpecType}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
