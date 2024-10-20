import {Sequence, useVideoConfig, Easing} from 'remotion';

// import {PercentageChangeArea} from '../../../acetti-ts-components/PercentageChangeArea';
// import {HighlightPeriods3} from '../../../acetti-ts-components/HighlightPeriods3';
import {HighlightPeriodsMulti} from '../../../acetti-ts-components/HighlightPeriodsMulti';
import {DisplayGridLayout} from '../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../acetti-themes/themeTypes';
// import {BasicLineChart} from '../../../acetti-ts-components/BasicLineChart';
import {
	// LineChartAnimationContainer,
	TLineChartAnimationContext,
} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {MultiBasicLineChart} from './MultiBasicLineChart';
import {MultiLineChartAnimationContainer} from '../../../acetti-ts-base/MultiLineChartAnimationContainer';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	timeSeries2: {value: number; date: Date}[];
	theme: ThemeType;
};

// TODO this shoud be in acetti-ts-scenes or so
export const PerformanceCompare_01: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	timeSeries2,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const td_buildup = 90 * 4;
	const td_periodsAreaEnter = 90 * 3;
	const td_periodsAreaZoomIn = 90 * 1;
	const td_periodsAreaZoomed = 90 * 2;
	const td_periodsAreaZoomOut = 90 * 1;
	const td_periodsAreaExit =
		durationInFrames -
		td_buildup -
		td_periodsAreaEnter -
		td_periodsAreaZoomIn -
		td_periodsAreaZoomed -
		td_periodsAreaZoomOut;

	// const transitionDurationInFrames_0_1 = durationInFrames - 90 * 3 - 90 * 3;
	// const transitionDurationInFrames_1_2 = 90 * 3;
	// const transitionDurationInFrames_2_3 = 90 * 3;

	// // TODO fix with [0,0] !!!!!!!!!
	// const visibleDomainIndices_0 = [0, 1] as [number, number];
	// const visibleDomainIndices_1 = [0, timeSeries.length] as [number, number];
	// const visibleDomainIndices_2 = [0, timeSeries.length] as [number, number];
	// const visibleDomainIndices_3 = [220, 420] as [number, number];

	const view_start = [0, 1] as [number, number];
	const view_buildup = [0, timeSeries.length] as [number, number];
	const view_periodsAreaEnter = [0, timeSeries.length] as [number, number];
	const view_periodsAreaZoomIn = [220, 420] as [number, number];
	const view_periodsAreaZoomed = [220, 420] as [number, number];
	const view_periodsAreaZoomOut = [0, timeSeries.length] as [number, number];
	const view_periodsAreaExit = [0, timeSeries.length] as [number, number];

	return (
		<div style={{position: 'relative'}}>
			<div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'magenta'}
					fill="transparent"
					hide={true}
					// hide={false}
					areas={chartLayout.areas}
					width={width}
					height={height}
				/>
			</div>

			<MultiLineChartAnimationContainer
				timeSeries={timeSeries}
				timeSeries2={timeSeries2}
				// TODO more generic, like so e.g.:
				// multiSeriesObject={multiSeriesObject}
				// relevantSeriesTickers={["AAPL", "QQQ"]}
				viewSpecs={[
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_start,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_buildup,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_periodsAreaEnter,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_periodsAreaZoomIn,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_periodsAreaZoomed,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_periodsAreaZoomOut,
					},
					{
						area: chartLayout.areas.plot,
						visibleDomainIndices: view_periodsAreaExit,
					},
				]}
				transitionSpecs={[
					{
						durationInFrames: td_buildup,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						// easingFunction: Easing.linear, // TODO why linear is broken??
						numberOfSlices: 20,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: td_periodsAreaEnter,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 40,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: td_periodsAreaZoomIn,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 5,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaZoomed,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 5,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaZoomOut,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 20,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaExit,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 40,
						transitionType: 'ZOOM',
					},
				]}
			>
				{({periodsScale, yScale, currentSliceInfo, currentTransitionInfo}) => {
					return (
						<div>
							<Sequence from={td_buildup}>
								<HighlightPeriodsMulti
									timeSeries={timeSeries}
									timeSeries2={timeSeries2}
									area={chartLayout.areas.plot}
									periodsScale={periodsScale}
									domainIndices={[220, 420] as [number, number]}
									currentFrame={22}
									durationInFrames={200}
									fadeInDurationInFrames={90}
									yScaleCurrent={yScale}
									label="Interesting Period"
									theme={theme.timeseriesComponents.HighlightPeriodsArea}
								/>
							</Sequence>

							{/* <BasicLineChart */}
							<MultiBasicLineChart
								timeSeries={timeSeries}
								timeSeries2={timeSeries2}
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
			</MultiLineChartAnimationContainer>
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
