import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
import {useChartLayout} from './useChartLayout';
import {MinimapContainer} from './MinimapContainer';
// import {HighlightPeriods} from './components/HighlightPeriods';
import {HighlightPeriods2} from './components/HighlightPeriods2';
import {Position} from './components/Position';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2022, 0, 1)
);

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'ZERO_FULL';
// const Y_DOMAIN_TYPE = 'ZERO_VISIBLE';
// const Y_DOMAIN_TYPE = 'VISIBLE';

const Y_LABELS_FONTSIZE = 16;
// const Y_LABELS_FORMATTER = (x: number) => `${x} hehe`;

function Y_LABELS_FORMATTER(num: number): string {
	return num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

const THEME = {
	yAxis: {
		fontSize: Y_LABELS_FONTSIZE,
		formatter: Y_LABELS_FORMATTER,
		strokeWidth: 3,
		color: '#fff',
		tickColor: '#fff',
	},
	xAxis: {
		fontSize: Y_LABELS_FONTSIZE,
		strokeWidth: 3,
		color: '#fff',
		tickColor: '#fff',
	},
};

export const AnimatedLineChartSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
	axisSpecType: z.enum(['STANDARD', 'INTER_MONTHS']),
});

export const AnimatedLineChart: React.FC<
	z.infer<typeof AnimatedLineChartSchema>
> = ({backgroundColor, textColor, axisSpecType}) => {
	const {height, width} = useVideoConfig();

	const lineChartWidth = width;
	const lineChartHeight = height * 0.9;

	return (
		<Position position={{left: 0, top: (height - lineChartHeight) / 2}}>
			<AnimatedLineChart2
				timeSeries={timeSeries}
				backgroundColor={backgroundColor}
				textColor={textColor}
				axisSpecType={axisSpecType}
				width={lineChartWidth}
				height={lineChartHeight}
			/>
		</Position>
	);
};

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
} & z.infer<typeof AnimatedLineChartSchema>;

export const AnimatedLineChart2: React.FC<TAnimatedLineChart2Props> = ({
	backgroundColor,
	textColor,
	width,
	height,
	timeSeries,
}) => {
	const {durationInFrames} = useVideoConfig();

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
	const indicesView_2 = [0, 40] as [number, number];
	// const indicesView_2 = [50, Math.floor(timeSeries.length / 2)] as [
	// 	number,
	// 	number
	// ];
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

			{/* TODO: from here wrap into
		
		<SpecificTitleAnimations

		
		<SpecificTitlesAnimation transitions={[
				{id: "entering", durationInFrames: 50, from: null, to: [0,10]},
				{id: "expand-a-bit", durationInFrames: 50, from: [0,10], to: [0,20]},
			]} 
			area={titleArea}
			/> 

		<SpecificLineChartAnimation transitions={[
				{id: "entering", durationInFrames: 50, from: null, to: [0,10]},
				{id: "expand-a-bit", durationInFrames: 50, from: [0,10], to: [0,20]},
			]}
			area={lineChartArea}	
			// TODO even more color/styling props
			// e.g. theme={{xAxis: {ticksColor: blue,...}}}
			lineColor={textColor}
			textColor={textColor}
			/> 
	
				in this component, we can execute the below code for example:
			*/}

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
						subPlot: chartLayout.areas.subPlot,
					}}
					lineColor={textColor}
					textColor={textColor}
					yDomainType={Y_DOMAIN_TYPE}
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={THEME}
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
						subPlot: chartLayout.areas.subPlot,
					}}
					lineColor={textColor}
					textColor={textColor}
					yDomainType={Y_DOMAIN_TYPE}
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={THEME}
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
						subPlot: chartLayout.areas.subPlot,
					}}
					lineColor={textColor}
					textColor={textColor}
					yDomainType={Y_DOMAIN_TYPE}
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={THEME}
				>
					{({
						periodsScale,
						currentFrame,
						durationInFrames,
						yScale,
						// TODO add more global info to the sequence, and "build" the line chart here!
						// ==> more flexibility/extensibility
						// e.g. yScale,...
					}) => {
						return (
							<Position
								position={{
									left: chartLayout.areas.plot.x1,
									top: chartLayout.areas.plot.y1,
								}}
							>
								<HighlightPeriods2
									label="Dot-Com Bubble"
									timeSeries={timeSeries}
									area={chartLayout.areas.plot}
									// domainIndices={indicesView_3}
									// domainIndices={[90, 150]}
									domainIndices={[50, 150]}
									periodsScale={periodsScale}
									currentFrame={currentFrame}
									durationInFrames={durationInFrames}
									fadeInDurationInFrames={100}
									yScaleCurrent={yScale}
								/>
							</Position>
						);
					}}
				</AnimatedLineChartContainer>
				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_3}
					toVisibleDomainIndices={indicesView_4}
					lineColor={textColor}
					textColor={textColor}
				/>

				{/* TODO pass periodsScale from here already! */}
				{/* <HighlightPeriods
					area={chartLayout.areas.plot}
					domainIndices={indicesView_2}
				/> */}
			</Sequence>
		</AbsoluteFill>
	);
};
