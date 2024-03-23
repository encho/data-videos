import {
	Sequence,
	useVideoConfig,
	AbsoluteFill,
	// useCurrentFrame,
	// spring
} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {
	DisplayGridLayout,
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './generateBrownianMotionTimeSeries';
import {Transition_HorizontalDateAxis} from './Transition_HorizontalDateAxis';
import {getFirstNItems, generateRange, getAdjacentPairs} from './utils';
import {LineChart} from './LineChart';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2030, 0, 20)
);

export const AxisTransitionSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
	axisSpecType: z.enum(['STANDARD', 'INTER_MONTHS']),
});

export const AxisTransition: React.FC<z.infer<typeof AxisTransitionSchema>> = ({
	backgroundColor,
	textColor,
	axisSpecType,
}) => {
	// const currentFrame = useCurrentFrame();
	const {durationInFrames, height, width} = useVideoConfig();

	// TODO consider adding major and minor ticks
	const TICK_SIZE = 16;
	const TICK_LABEL_MARGIN = 6;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: 60, name: 'space'},
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 20, name: 'space'},
		{type: 'pixel', value: 100, name: 'xAxis'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: 200, name: 'space'},
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 20, name: 'space'},
		{type: 'pixel', value: 200, name: 'yAxis'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			xAxis: [
				{name: 'xAxis'},
				{name: 'plot'},
				{name: 'xAxis'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			yAxis: [
				{name: 'plot'},
				{name: 'yAxis'},
				{name: 'plot'},
				{name: 'yAxis'},
			] as TGridLayoutAreaSpec,
			plot: [
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
		},
	};

	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: chartGridLayoutSpec,
	});

	const xAxisArea = chartLayout.areas['xAxis'];

	const tsLengths = generateRange(100, 2000, 200);
	const tsLengthPairs = getAdjacentPairs(tsLengths);
	const numberOfTransitions = tsLengthPairs.length;
	const transitionDuration = Math.floor(durationInFrames / numberOfTransitions);

	console.log({
		tsLengths,
		tsLengthPairs,
		numberOfTransitions,
		transitionDuration,
	});

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<DisplayGridLayout
				hide={true}
				areas={chartLayout.areas}
				width={width}
				height={height}
			/>

			{/* the chart line */}
			<LineChart
				area={chartLayout.areas.plot}
				timeSeries={timeSeries}
				// startTimeSeries={tsStart}
				// endTimeSeries={tsEnd}
				// axisSpecStart={axisSpecStart}
				// axisSpecEnd={axisSpecEnd}
			/>

			<div>
				{tsLengthPairs.map((lengthPair, i) => {
					const durationInFrames = transitionDuration;
					const from = 0 + i * durationInFrames;
					const tsStart = getFirstNItems(timeSeries, lengthPair[0]);
					const tsEnd = getFirstNItems(timeSeries, lengthPair[1]);
					// TODO: check if this is actually improving performance
					// if (currentFrame >= from && currentFrame < from + durationInFrames) {
					if (true) {
						return (
							<Sequence
								from={from}
								durationInFrames={durationInFrames}
								layout="none"
							>
								<Transition_HorizontalDateAxis
									axisSpecType={axisSpecType}
									backgroundColor={backgroundColor}
									textColor={textColor}
									startTimeSeries={tsStart}
									endTimeSeries={tsEnd}
									area={xAxisArea}
									tickSize={TICK_SIZE}
									tickLabelMargin={TICK_LABEL_MARGIN}
								/>
							</Sequence>
						);
					}
					return <div />;
				})}
			</div>
		</AbsoluteFill>
	);
};
