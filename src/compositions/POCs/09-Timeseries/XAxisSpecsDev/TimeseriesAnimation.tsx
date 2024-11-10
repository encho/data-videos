import {useVideoConfig, Easing} from 'remotion';
import {ReactNode} from 'react';

import {DisplayGridLayout} from '../../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {
	LineChartAnimationContainer,
	TLineChartAnimationContext,
} from '../../../../acetti-ts-base/LineChartAnimationContainer';
import {LineChart_XAxisShowcase} from './LineChart_XAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme: ThemeType;
};

// TODO this shoud be in acetti-ts-scenes or so
export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
}) => {
	const {
		durationInFrames,
		// fps
		// width,
		// height
	} = useVideoConfig();

	const debugTheme = useThemeFromEnum('LORENZOBERTOLINI' as any);

	const CHART_PAGE_MARGIN = 60;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height * 0.5;
	const CHART_CONTENT_WIDTH = CHART_PAGE_WIDTH - 2 * CHART_PAGE_MARGIN;
	const CHART_CONTENT_HEIGHT = CHART_PAGE_HEIGHT - 2 * CHART_PAGE_MARGIN;

	const chartLayout = useChartLayout({
		width: CHART_CONTENT_WIDTH,
		height: CHART_CONTENT_HEIGHT,
	});

	// TODO use keyframes
	const td_buildup = Math.floor(durationInFrames * 0.25);
	const td_periodsAreaEnter = Math.floor(durationInFrames * 0.1);
	const td_periodsAreaZoomIn = Math.floor(durationInFrames * 0.1);
	const td_periodsAreaZoomed = Math.floor(durationInFrames * 0.1);
	const td_periodsAreaZoomOut = Math.floor(durationInFrames * 0.1);
	const td_periodsAreaExit =
		durationInFrames -
		td_buildup -
		td_periodsAreaEnter -
		td_periodsAreaZoomIn -
		td_periodsAreaZoomed -
		td_periodsAreaZoomOut;

	// TODO also allow for dates as indices eventually
	// TODO fix with [0,0] ??? really
	const view_start = [0, 1] as [number, number];
	const view_buildup = [0, timeSeries.length] as [number, number];
	const view_periodsAreaEnter = [0, timeSeries.length] as [number, number];
	const view_periodsAreaZoomIn = [220, 420] as [number, number];
	const view_periodsAreaZoomed = [220, 420] as [number, number];
	const view_periodsAreaZoomOut = [0, timeSeries.length] as [number, number];
	const view_periodsAreaExit = [0, timeSeries.length] as [number, number];

	return (
		<div style={{position: 'relative'}}>
			<LineChartAnimationContainer
				timeSeries={timeSeries}
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
						// durationInFrames: getDurationInFrames(keyframes, "START_BUILDUP", "END_BUILDUP"),
						durationInFrames: td_buildup,
						// easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						// easingFunction: Easing.bezier(0.16, 1, 0.3, 1),
						easingFunction: Easing.linear, // TODO why linear is broken??
						// TODO:
						// numberOfSlices: getDurationInSeconds(keyframes, "START_BUILDUP", "END_BUILDUP") / 2
						numberOfSlices: 5,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: td_periodsAreaEnter,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 1,
						transitionType: 'DEFAULT',
					},
					{
						durationInFrames: td_periodsAreaZoomIn,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 1,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaZoomed,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 1,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaZoomOut,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 1,
						transitionType: 'ZOOM',
					},
					{
						durationInFrames: td_periodsAreaExit,
						easingFunction: Easing.bezier(0.33, 1, 0.68, 1),
						numberOfSlices: 1,
						transitionType: 'ZOOM',
					},
				]}
			>
				{({
					periodsScale,
					yScale,
					frame,
					currentSliceInfo,
					currentTransitionInfo,
					...rest
				}) => {
					return (
						<div>
							<PageContext
								width={CHART_PAGE_WIDTH}
								height={CHART_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={40}
								theme={theme}
							>
								<Page show>
									{() => {
										return (
											<>
												<div style={{position: 'absolute'}}>
													<DisplayGridLayout
														stroke={'rgba(255,0,255,0.4)'}
														fill="transparent"
														// hide={true}
														areas={chartLayout.areas}
														width={width}
														height={height}
													/>
												</div>
												<LineChart_XAxisShowcase
													timeSeries={timeSeries}
													layoutAreas={{
														plot: chartLayout.areas.plot,
														xAxis: chartLayout.areas.xAxis,
														yAxis: chartLayout.areas.yAxis,
														xAxis_days: chartLayout.areas.xAxis_days,
														xAxis_monthStarts:
															chartLayout.areas.xAxis_monthStarts,
														xAxis_quarterStarts:
															chartLayout.areas.xAxis_quarterStarts,
													}}
													yDomainType={Y_DOMAIN_TYPE}
													theme={theme}
													yScale={yScale}
													periodScale={periodsScale}
													// TODO deprecate as we are passing the whole sliceInfo
													fromPeriodScale={currentSliceInfo.periodsScaleFrom}
													toPeriodScale={currentSliceInfo.periodsScaleTo}
													//
													currentSliceInfo={currentSliceInfo}
												/>
											</>
										);
									}}
								</Page>
							</PageContext>
							<PageContext
								width={CHART_PAGE_WIDTH}
								height={CHART_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={40}
								theme={debugTheme}
							>
								<Page show>
									<LineChartAnimationContextDebugger
										frame={frame}
										periodsScale={periodsScale}
										yScale={yScale}
										currentSliceInfo={currentSliceInfo}
										currentTransitionInfo={currentTransitionInfo}
										{...rest}
									/>
								</Page>
							</PageContext>
						</div>
					);
				}}
			</LineChartAnimationContainer>
		</div>
	);
};

// type TLineChartAnimationContextDebugger = TLineChartAnimationContext & {
// theme: ThemeType;
// };

// function roundToTwoDecimals(num: number): number {
// 	return parseFloat(num.toFixed(2));
// }
// // Example usage:
// const input: number = 123.456789;
// const output: number = roundToTwoDecimals(input);
// console.log(output); // Output: 123.46

const LineChartAnimationContextDebugger: React.FC<
	TLineChartAnimationContext
> = ({frame, currentSliceInfo, currentTransitionInfo}) => {
	const {theme} = usePage();

	const Row = ({children}: {children: ReactNode}) => {
		return (
			<div
				style={{
					display: 'flex',
					gap: 5,
					backgroundColor: 'rgba(0,0,0,0.3)',
					color: '#00aa99',
					padding: 5,
					fontWeight: 800,
				}}
			>
				{children}
			</div>
		);
	};

	const Value = ({children}: {children: ReactNode}) => {
		return <div style={{color: '#00ffaa'}}>{children}</div>;
	};

	const currentTransitionInfoListItems = [
		{
			key: 'Object.keys():',
			value: JSON.stringify(Object.keys(currentTransitionInfo), undefined, 2),
		},
		{
			key: 'index',
			value: JSON.stringify(currentTransitionInfo.index),
		},
		{
			key: 'frameRange',
			value: JSON.stringify(currentTransitionInfo.frameRange),
		},
		{
			key: 'durationInFrames',
			value: JSON.stringify(currentTransitionInfo.durationInFrames),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentTransitionInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(currentTransitionInfo.framesPercentage),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(currentTransitionInfo.easingPercentage),
		},
	];
	const currentSliceInfoListItems = [
		{
			key: 'Object.keys():',
			value: JSON.stringify(Object.keys(currentSliceInfo), undefined, 2),
		},
		{key: 'index', value: JSON.stringify(currentSliceInfo.index)},
		{
			key: 'frameRange',
			value: JSON.stringify(currentSliceInfo.frameRange),
		},
		{
			key: 'durationInFrames',
			value: JSON.stringify(currentSliceInfo.durationInFrames),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentSliceInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(currentSliceInfo.framesPercentage),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(currentSliceInfo.easingPercentage),
		},
		{
			key: 'frameRangeLinearPercentage',
			value: JSON.stringify(currentSliceInfo.frameRangeLinearPercentage),
		},
		{
			key: 'frameRangeEasingPercentage',
			value: JSON.stringify(currentSliceInfo.frameRangeEasingPercentage),
		},
		{
			key: 'visibleDomainIndicesFrom',
			value: JSON.stringify(currentSliceInfo.visibleDomainIndicesFrom),
		},
		{
			key: 'visibleDomainIndicesTo',
			value: JSON.stringify(currentSliceInfo.visibleDomainIndicesTo),
		},
	];

	return (
		<div style={{position: 'absolute', zIndex: 500}}>
			<div style={{fontSize: 40, color: theme.typography.textStyles.h1.color}}>
				frame: {frame}
			</div>
			<div
				style={{
					// position: 'absolute',
					// zIndex: 500,
					backgroundColor: 'rgba(0,0,0,0.5)',
					padding: 20,
					fontSize: 20,
				}}
			>
				<div style={{fontSize: 50}}>
					<div
						style={{
							fontWeight: 700,
							color: theme.typography.textStyles.h1.color,
						}}
					>
						currentTransitionInfo
					</div>
				</div>
				<div
					style={{
						backgroundColor: 'rgba(0,0,0,0.2)',
						padding: 20,
						fontSize: 20,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 5,
						}}
					>
						{currentTransitionInfoListItems.map((it) => {
							return (
								<Row>
									<div>{it.key}</div>
									<Value>{it.value}</Value>
								</Row>
							);
						})}
					</div>
				</div>
			</div>

			<div
				style={{
					// position: 'absolute',
					// zIndex: 500,
					backgroundColor: 'rgba(0,0,0,0.5)',
					padding: 20,
					fontSize: 20,
				}}
			>
				<div style={{fontSize: 50}}>
					<div
						style={{
							fontWeight: 700,
							color: theme.typography.textStyles.h1.color,
						}}
					>
						currentSliceInfo
					</div>
				</div>
				<div
					style={{
						backgroundColor: 'rgba(0,0,0,0.2)',
						padding: 20,
						fontSize: 20,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 5,
						}}
					>
						{currentSliceInfoListItems.map((it) => {
							return (
								<Row>
									<div>{it.key}</div>
									<Value>{it.value}</Value>
								</Row>
							);
						})}
						{/* &&&&&&&& */}
						<Row>
							<div style={{}}>
								OWN DomainIndices Change Distance (amount, left + right):
							</div>
							<div style={{color: 'red'}}>TODO implement calculation</div>
						</Row>
						{/* ********* */}
						<Row>
							<div style={{}}>
								OWN DomainIndices Change Velocity (???, left + right):
							</div>
							<div style={{color: 'red'}}>TODO implement calculation</div>
						</Row>
					</div>
				</div>
			</div>
		</div>
	);
};
