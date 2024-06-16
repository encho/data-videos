import {Sequence, useVideoConfig, Easing} from 'remotion';

// import {PercentageChangeArea} from '../../../acetti-ts-components/PercentageChangeArea';
import {HighlightPeriods3} from '../../../acetti-ts-components/HighlightPeriods3';
import {DisplayGridLayout} from '../../../acetti-viz';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {BasicLineChart} from './BasicLineChart';
import {
	LineChartAnimationContainer,
	TLineChartAnimationContext,
} from '../../../acetti-ts-base/LineChartAnimationContainer';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme: ThemeType;
};

// TODO this shoud be in acetti-ts-scenes or so
export const HighlightPeriods_01: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const transitionDurationInFrames_0_1 = durationInFrames - 90 * 3 - 90 * 3;
	const transitionDurationInFrames_1_2 = 90 * 3;
	const transitionDurationInFrames_2_3 = 90 * 3;

	// TODO fix with [0,0] !!!!!!!!!
	const visibleDomainIndices_0 = [0, 1] as [number, number];
	const visibleDomainIndices_1 = [0, timeSeries.length] as [number, number];
	const visibleDomainIndices_2 = [0, timeSeries.length] as [number, number];
	const visibleDomainIndices_3 = [220, 420] as [number, number];

	return (
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'magenta'}
					fill="transparent"
					hide={true}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>

			<LineChartAnimationContainer
				timeSeries={timeSeries}
				viewSpecs={[
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_0,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_1,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_2,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: visibleDomainIndices_3,
					},
				]}
				transitionSpecs={[
					{
						durationInFrames: transitionDurationInFrames_0_1,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						// easingFunction: Easing.bounce,
						// easingFunction: Easing.linear, // TODO why linear is broken??
						numberOfSlices: 20,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: transitionDurationInFrames_1_2,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 40,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: transitionDurationInFrames_2_3,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 40,
						transitionType: 'ZOOM',
					},
				]}
			>
				{({periodsScale, yScale, currentSliceInfo, currentTransitionInfo}) => {
					return (
						<div>
							<Sequence from={transitionDurationInFrames_0_1}>
								<HighlightPeriods3
									timeSeries={timeSeries}
									area={chartLayout.areas.plot}
									periodsScale={periodsScale}
									domainIndices={[220, 420] as [number, number]}
									currentFrame={22}
									durationInFrames={200}
									fadeInDurationInFrames={90}
									yScaleCurrent={yScale}
									label="Interesting Period"
								/>
							</Sequence>

							<BasicLineChart
								timeSeries={timeSeries}
								layoutAreas={{
									plot: chartLayout.areas.plot,
									xAxis: chartLayout.areas.xAxis,
									yAxis: chartLayout.areas.yAxis,
								}}
								yDomainType={Y_DOMAIN_TYPE}
								theme={theme}
								yScale={yScale}
								periodScale={periodsScale}
								fromPeriodScale={currentSliceInfo.periodsScaleFrom}
								toPeriodScale={currentSliceInfo.periodsScaleTo}
								//
								currentSliceInfo={currentSliceInfo}
							/>

							{/* TODO 1 pass forward lineChartAnimationContext */}
							{/* TODO 2 useLineChartAnimationContext inside! */}
							{/* <Sequence from={transitionDurationInFrames_0_1}>
								<PercentageChangeArea
									firstValue={timeSeries[0].value}
									lastValue={timeSeries[timeSeries.length - 1].value}
									enterDurationInFrames={60}
									periodsScale={periodsScale}
									yScale={yScale}
									easingPercentage={currentTransitionInfo.easingPercentage}
									plotArea={chartLayout.areas.plot}
									theme={theme.timeseriesComponents.percentageChangeArea}
								/>
							</Sequence> */}

							{/* <AbsoluteFill>
								<LineChartAnimationContextDebugger
									theme={theme}
									periodsScale={periodsScale}
									yScale={yScale}
									currentSliceInfo={currentSliceInfo}
									currentTransitionInfo={currentTransitionInfo}
								/>
							</AbsoluteFill> */}
						</div>
					);
				}}
			</LineChartAnimationContainer>
		</div>
	);
};

type TLineChartAnimationContextDebugger = TLineChartAnimationContext & {
	theme: ThemeType;
};

function roundToTwoDecimals(num: number): number {
	return parseFloat(num.toFixed(2));
}
// // Example usage:
// const input: number = 123.456789;
// const output: number = roundToTwoDecimals(input);
// console.log(output); // Output: 123.46

export const LineChartAnimationContextDebugger: React.FC<
	TLineChartAnimationContextDebugger
> = ({
	currentSliceInfo,
	currentTransitionInfo,
	periodsScale,
	yScale,
	theme,
}) => {
	return (
		<div style={{marginTop: -200}}>
			<div style={{color: theme.dataColors[2].BASE, fontSize: 20}}>
				<h1 style={{fontWeight: 'bold'}}>Current Transition Info</h1>
				<h1>frameRange: {JSON.stringify(currentTransitionInfo.frameRange)}</h1>
				<h1>durationInFrames: {currentTransitionInfo.durationInFrames}</h1>
				<h1>
					framesPercentage:{' '}
					{roundToTwoDecimals(currentTransitionInfo.framesPercentage)}
				</h1>
				<h1>
					easingPercentage:{' '}
					{roundToTwoDecimals(currentTransitionInfo.easingPercentage)}
				</h1>
			</div>
			<div
				style={{color: theme.dataColors[3].BASE, fontSize: 20, marginTop: 10}}
			>
				<h1 style={{fontWeight: 'bold'}}>Current Transition Slice Info</h1>
				<h1>index: {currentSliceInfo.index}</h1>
				<h1>frameRange: {JSON.stringify(currentSliceInfo.frameRange)}</h1>
				<h1>
					frameRangeLinearPercentage:{' '}
					{JSON.stringify(
						(() => {
							const obj = currentSliceInfo.frameRangeLinearPercentage;
							return {
								startFrame: roundToTwoDecimals(obj.startFrame),
								endFrame: roundToTwoDecimals(obj.endFrame),
							};
						})()
					)}
				</h1>
				<h1>
					frameRangeEasingPercentage:{' '}
					{JSON.stringify(
						(() => {
							const obj = currentSliceInfo.frameRangeEasingPercentage;
							return {
								startFrame: roundToTwoDecimals(obj.startFrame),
								endFrame: roundToTwoDecimals(obj.endFrame),
							};
						})()
					)}
				</h1>
				<h1>durationInFrames: {currentSliceInfo.durationInFrames}</h1>
				<h1>relativeFrame: {currentSliceInfo.relativeFrame}</h1>
				<h1>
					framesPercentage:{' '}
					{roundToTwoDecimals(currentSliceInfo.framesPercentage)}
				</h1>
				<h1>
					visibleDomainIndicesFrom:{' '}
					{JSON.stringify(
						(() => {
							const arr = currentSliceInfo.visibleDomainIndicesFrom;
							return arr.map((it) => roundToTwoDecimals(it));
						})()
					)}
				</h1>
				<h1>
					visibleDomainIndicesTo:{' '}
					{JSON.stringify(
						(() => {
							const arr = currentSliceInfo.visibleDomainIndicesTo;
							return arr.map((it) => roundToTwoDecimals(it));
						})()
					)}
				</h1>
				<h1>periodsScaleFrom: {'<obj>'}</h1>
				<h1>periodsScaleTo: {'<obj>'}</h1>
				{/* <h1>
		currentSliceInfo.periodsScaleFrom:{' '}
		{JSON.stringify(currentSliceInfo.periodsScaleFrom)}
	</h1> */}
				{/* <h1>
		currentSliceInfo.periodsScaleTo:{' '}
		{JSON.stringify(currentSliceInfo.periodsScaleTo)}
	</h1> */}
			</div>
		</div>
	);
};
