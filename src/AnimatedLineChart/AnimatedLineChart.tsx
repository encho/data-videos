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

	const TITLE_DURATION_IN_FRAMES = 45;

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

			<Sequence from={0} durationInFrames={TITLE_DURATION_IN_FRAMES}>
				<h1 style={{color: 'blue', fontSize: 100}}>hello</h1>
			</Sequence>

			<Sequence
				from={TITLE_DURATION_IN_FRAMES}
				durationInFrames={durationInFrames - TITLE_DURATION_IN_FRAMES}
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
					toDomainIndices={{start: 500, end: 1000}}
					textColor={textColor}
					axisSpecType={axisSpecType}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
