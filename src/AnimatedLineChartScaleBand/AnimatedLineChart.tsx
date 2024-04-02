import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {makeFakeOHLCSeries} from './utils/timeSeries/makeFakeOHLCSeries';
import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
import {useChartLayout} from './useChartLayout';
import {MinimapContainer} from './MinimapContainer';
// import {HighlightPeriods} from './components/HighlightPeriods';
import {HighlightPeriods2} from './components/HighlightPeriods2';
import {Position} from './components/Position';
import {TTheme, myTheme} from './theme';

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2022, 0, 1)
);

// const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'ZERO_FULL';
// const Y_DOMAIN_TYPE = 'ZERO_VISIBLE';
const Y_DOMAIN_TYPE = 'VISIBLE';

const Y_LABELS_FONTSIZE = 16;

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
	theme?: TTheme;
} & z.infer<typeof AnimatedLineChartSchema>;

export const AnimatedLineChart2: React.FC<TAnimatedLineChart2Props> = ({
	// backgroundColor,
	// textColor,
	width,
	height,
	timeSeries,
	theme = myTheme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const ohlcSeries = makeFakeOHLCSeries(timeSeries);

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
	const indicesView_3 = [0, 60] as [number, number];
	const indicesView_4 = [0, 100] as [number, number];
	// const indicesView_3 = [50 + 100, Math.floor(timeSeries.length / 2) + 100] as [
	// 	number,
	// 	number
	// ];
	// const indicesView_4 = [0, timeSeries.length - 1] as [number, number];

	return (
		<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
			<DisplayGridLayout
				stroke={'cyan'}
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
				<h1 style={{color: 'cyan', fontSize: 300}}>Start</h1>
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
					ohlcSeries={ohlcSeries}
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
					lineColor={'cyan'}
					textColor={'cyan'}
					yDomainType={Y_DOMAIN_TYPE}
					// TODO deprecate
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={theme}
				/>

				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_1}
					toVisibleDomainIndices={indicesView_2}
					lineColor={'cyan'}
					textColor={'cyan'}
				/>
			</Sequence>
			<Sequence
				from={SECOND_TS_START_FRAME}
				durationInFrames={SECOND_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					ohlcSeries={ohlcSeries}
					fromVisibleDomainIndices={indicesView_2}
					toVisibleDomainIndices={indicesView_3}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
						subPlot: chartLayout.areas.subPlot,
					}}
					lineColor={'cyan'}
					textColor={'cyan'}
					yDomainType={Y_DOMAIN_TYPE}
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={theme}
				/>
				<MinimapContainer
					area={chartLayout.areas.minimapPlot}
					timeSeries={timeSeries}
					fromVisibleDomainIndices={indicesView_2}
					toVisibleDomainIndices={indicesView_3}
					lineColor={'cyan'}
					textColor={'cyan'}
				/>
			</Sequence>
			<Sequence
				from={THIRD_TS_START_FRAME}
				durationInFrames={THIRD_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					ohlcSeries={ohlcSeries}
					fromVisibleDomainIndices={indicesView_3}
					toVisibleDomainIndices={indicesView_4}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
						subPlot: chartLayout.areas.subPlot,
					}}
					lineColor={'cyan'}
					textColor={'cyan'}
					yDomainType={Y_DOMAIN_TYPE}
					yLabelsFontSize={Y_LABELS_FONTSIZE}
					theme={theme}
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
					lineColor={'cyan'}
					textColor={'cyan'}
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
