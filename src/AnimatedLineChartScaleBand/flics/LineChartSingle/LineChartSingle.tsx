import {Sequence, useVideoConfig} from 'remotion';

import {DisplayGridLayout} from '../../../acetti-viz';
import {useChartLayout} from './useChartLayout';
import {TTheme, myTheme} from '../../theme';
import {BasicLineChart} from './BasicLineChart';
import {LineChartTransitionContainer} from './LineChartTransitionContainer';
import {Position} from '../../components/Position';
// import {periodsScale} from '../../periodsScale/periodsScale';

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
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'#f05122'}
					fill="transparent"
					// hide={true}
					hide={false}
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
							<div style={{position: 'relative'}}>
								{/* <div style={{position: 'absolute', width: '100%'}}>
									<div
										style={{backgroundColor: 'cyan', opacity: easingPercentage}}
									>
										{easingPercentage}
									</div>
									<div
										style={{backgroundColor: 'cyan', opacity: easingPercentage}}
									>
										{easingPercentage}
									</div>
									<div
										style={{backgroundColor: 'cyan', opacity: easingPercentage}}
									>
										{easingPercentage}
									</div>
								</div> */}
								{/* THIS IS TO BE FACTORED OUT AS NEW COMPONENT! */}
								<Position
									position={{
										left: chartLayout.areas.plot.x1,
										top: chartLayout.areas.plot.y1,
									}}
								>
									<svg
										style={{
											backgroundColor: 'orange',
											opacity: easingPercentage,
											width: chartLayout.areas.plot.width,
											height: chartLayout.areas.plot.height,
										}}
									>
										<g transform="translate(0,100)">
											<text>{easingPercentage}</text>
										</g>
									</svg>
								</Position>
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
		</div>
	);
};
