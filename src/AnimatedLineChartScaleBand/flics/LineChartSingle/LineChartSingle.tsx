import {Sequence, useVideoConfig} from 'remotion';

import {DisplayGridLayout} from '../../../acetti-viz';
import {useChartLayout} from './useChartLayout';
import {TTheme, myTheme} from '../../theme';
import {LineChartSingleSequence} from './LineChartSingleSequence';
import {LineChartSingleSequence2} from './LineChartSingleSequence2';

import {LineChartTransitionContainer} from './LineChartTransitionContainer';
import {periodsScale} from '../../periodsScale/periodsScale';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme?: TTheme;
};

export const LineChartSingle: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme = myTheme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const sequence_1_startFrame = 0;
	const sequence_1_durationInFrames = durationInFrames - 60;

	const sequence_2_startFrame =
		sequence_1_startFrame + sequence_1_durationInFrames;
	const sequence_2_durationInFrames = 60;

	const sequence_1_startView = [0, 0] as [number, number];
	const sequence_1_endView = [0, timeSeries.length] as [number, number];

	const sequence_2_startView = [0, timeSeries.length] as [number, number];
	const sequence_2_endView = [0, timeSeries.length] as [number, number];

	return (
		// <AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'#f05122'}
					fill="transparent"
					hide={true}
					// hide={false}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>
			<Sequence
				from={sequence_1_startFrame}
				durationInFrames={sequence_1_durationInFrames}
				layout="none"
			>
				{/* <LineChartSingleSequence
					timeSeries={timeSeries}
					fromVisibleDomainIndices={sequence_1_startView}
					toVisibleDomainIndices={sequence_1_endView}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					yDomainType={Y_DOMAIN_TYPE}
					theme={theme}
				/> */}

				<LineChartTransitionContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={sequence_1_startView}
					toVisibleDomainIndices={sequence_1_endView}
					// TODO rename to plotArea
					area={chartLayout.areas.plot}
					// TODO pass yDomainType
					// yDomainType={"FULL"}
				>
					{({periodsScale, yScale, easingPercentage}) => {
						return (
							<div>
								{/* <div style={{backgroundColor: 'yellow'}}>
									{easingPercentage}
								</div> */}
								<LineChartSingleSequence2
									timeSeries={timeSeries}
									// fromVisibleDomainIndices={sequence_2_startView}
									// toVisibleDomainIndices={sequence_2_endView}
									layoutAreas={{
										plot: chartLayout.areas.plot,
										xAxis: chartLayout.areas.xAxis,
										yAxis: chartLayout.areas.yAxis,
									}}
									yDomainType={Y_DOMAIN_TYPE}
									theme={theme}
									//
									yScale={yScale}
									periodScale={periodsScale}
								/>
							</div>
						);
					}}
				</LineChartTransitionContainer>
			</Sequence>
			{/* Sequence 2 */}
			<Sequence
				from={sequence_2_startFrame}
				durationInFrames={sequence_2_durationInFrames}
				layout="none"
			>
				{/* TODO: API idea - to add the percentageChangeHighligher, perhaps set up a
				container component like so:
				<LineChartTransitionContainer
				timeSeries={timeSeries}
				fromVisibleDomainIndices={...}
				toVisibleDomainIndices={...}
				area={}
				// TODO perspektivisch:
				// fromArea={}
				// toArea={}
				>
					{({periodsScale, yScale ...}) => {
						return <div>
							<LineChart timeSeries={timeSeries} scaleBand={scaleBand} {...}/>
							<PercantageChangeHighlighter timeSeries={timeSeries} scaleBand={scaleBand} startIndex={0} endIndex={timeSeries.length} {...} />
						</div>
					}}
				</AnimatedTimeseriesContainer> */}

				{/* <LineChartSingleSequence
					timeSeries={timeSeries}
					fromVisibleDomainIndices={sequence_2_startView}
					toVisibleDomainIndices={sequence_2_endView}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
					yDomainType={Y_DOMAIN_TYPE}
					theme={theme}
				/> */}

				<LineChartTransitionContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={sequence_2_startView}
					toVisibleDomainIndices={sequence_2_endView}
					// TODO rename to plotArea
					area={chartLayout.areas.plot}
					// TODO pass yDomainType
					// yDomainType={"FULL"}
				>
					{({periodsScale, yScale, easingPercentage}) => {
						return (
							<div>
								{/* <div style={{backgroundColor: 'yellow'}}>
									{easingPercentage}
								</div> */}
								<LineChartSingleSequence2
									timeSeries={timeSeries}
									// fromVisibleDomainIndices={sequence_2_startView}
									// toVisibleDomainIndices={sequence_2_endView}
									layoutAreas={{
										plot: chartLayout.areas.plot,
										xAxis: chartLayout.areas.xAxis,
										yAxis: chartLayout.areas.yAxis,
									}}
									yDomainType={Y_DOMAIN_TYPE}
									theme={theme}
									//
									yScale={yScale}
									periodScale={periodsScale}
								/>
							</div>
						);
					}}
				</LineChartTransitionContainer>
			</Sequence>
		</div>
	);
};
