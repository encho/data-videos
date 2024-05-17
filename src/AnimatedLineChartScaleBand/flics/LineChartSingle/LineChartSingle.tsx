import {Sequence, useCurrentFrame, useVideoConfig} from 'remotion';

import {DisplayGridLayout, TGridLayoutArea} from '../../../acetti-viz';
import {useChartLayout} from './useChartLayout';
import {TTheme, myTheme} from '../../theme';
import {BasicLineChart} from './BasicLineChart';
import {LineChartTransitionContainer} from './LineChartTransitionContainer';
import {Position} from '../../components/Position';
import {useGlobalVideoContext} from '../../../acetti-components/GlobalVideoContext';
import {TPeriodsScale} from '../../periodsScale/periodsScale';
import {ScaleLinear} from 'd3-scale';

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
	const globalVideoContext = useGlobalVideoContext();
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const LAST_STILL_DURATION = 200;

	const sequence_1_startFrame = 0;
	const sequence_1_durationInFrames = durationInFrames - LAST_STILL_DURATION;

	const sequence_2_startFrame =
		sequence_1_startFrame + sequence_1_durationInFrames;
	const sequence_2_durationInFrames = LAST_STILL_DURATION;

	const sequence_1_startView = [0, 0] as [number, number];
	const sequence_1_endView = [0, timeSeries.length] as [number, number];

	const sequence_2_startView = [0, timeSeries.length] as [number, number];
	const sequence_2_endView = [0, timeSeries.length] as [number, number];

	return (
		// <GlobalVideoContextWrapper>
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
				<LineChartTransitionContainer
					timeSeries={timeSeries}
					fromVisibleDomainIndices={sequence_1_startView}
					toVisibleDomainIndices={sequence_1_endView}
					// TODO rename to plotArea
					area={chartLayout.areas.plot}
					// TODO pass yDomainType
					// yDomainType={"FULL"}
				>
					{/* TODO should return an array of axis specs to transition between...
					... for enter update exit pattern
					... togehter with info on when the pairs are active  */}
					{({periodsScale, yScale, easingPercentage}) => {
						return (
							<div>
								<BasicLineChart
									timeSeries={timeSeries}
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
							// <div style={{position: 'relative'}}>
							<div>
								<BasicLineChart
									timeSeries={timeSeries}
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
								<ThePercLine
									periodsScale={periodsScale}
									yScale={yScale}
									easingPercentage={easingPercentage}
									plotArea={chartLayout.areas.plot}
								/>
							</div>
						);
					}}
				</LineChartTransitionContainer>
			</Sequence>
		</div>
	);
};

export const ThePercLine: React.FC<{
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	easingPercentage: number;
	plotArea: TGridLayoutArea;
}> = ({
	// periodsScale,
	yScale,
	easingPercentage,
	plotArea,
}) => {
	const currentFrame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const lineColor = '#00aa99';
	const strokeWidth = 5;

	const aPerc = currentFrame / durationInFrames;

	const firstValue = 30000;
	const lastValue = 70000;

	const aLastValue = firstValue + aPerc * (lastValue - firstValue);

	const mappedFirstValue = yScale(firstValue);
	const mappedAnimatedLastValue = yScale(aLastValue);

	const aPercentageChange = aLastValue / firstValue - 1;

	return (
		<Position
			position={{
				left: plotArea.x1,
				top: plotArea.y1,
			}}
		>
			<svg
				style={{
					// backgroundColor: 'cyan',
					// opacity: easingPercentage,
					width: plotArea.width,
					height: plotArea.height,
				}}
			>
				<rect
					x={0}
					y={mappedAnimatedLastValue}
					width={plotArea.width}
					// height={mappedAnimatedLastValue - mappedFirstValue}
					height={mappedFirstValue - mappedAnimatedLastValue}
					// fill="orange"
					fill={lineColor}
					opacity={0.2}
				/>

				{/* <rect
					x1={0}
					x2={plotArea.width}
					y1={mappedAnimatedLastValue}
					y2={mappedAnimatedLastValue}
					fill="green"
				/> */}

				<line
					x1={0}
					x2={plotArea.width}
					y1={mappedFirstValue}
					y2={mappedFirstValue}
					strokeWidth={strokeWidth}
					stroke={lineColor}
				/>

				<line
					x1={0}
					x2={plotArea.width}
					y1={mappedAnimatedLastValue}
					y2={mappedAnimatedLastValue}
					strokeWidth={strokeWidth}
					stroke={lineColor}
				/>

				<g transform={`translate(100,${mappedAnimatedLastValue})`}>
					<text style={{fontSize: 50}} fill={lineColor} opacity={aPerc}>
						{formatPercentage(aPercentageChange)}
					</text>
				</g>
				{/* <g transform="translate(0,130)">
					<text>{durationInFrames}</text>
				</g> */}
			</svg>
		</Position>
	);
};

// TODO centralize
function formatPercentage(value: number): string {
	// Calculate the percentage by multiplying the value by 100
	let percentage = value * 100;
	// Round to the nearest integer and format with a sign
	// Directly use `toFixed(0)` which handles rounding
	return (percentage > 0 ? '+' : '') + percentage.toFixed(0) + '%';
}
// Usage examples:
// console.log(formatPercentage(1.23));  // Outputs: "+123%"
// console.log(formatPercentage(-0.5));  // Outputs: "-50%"
