import {useVideoConfig, Easing, interpolate} from 'remotion';
import {ReactNode} from 'react';

import {DisplayGridLayout} from '../../../../acetti-layout';
import {useChartLayout} from './useChartLayout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {LineChart_XAxisShowcase} from './LineChart_XAxisShowcase';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {
	PeriodScaleAnimationContainer,
	TPeriodScaleAnimationContext,
} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

const Y_DOMAIN_TYPE = 'FULL';
// const Y_DOMAIN_TYPE = 'VISIBLE';

type TAnimatedLineChart2Props = {
	width: number;
	height: number;
	timeSeries: {value: number; date: Date}[];
	theme: ThemeType;
};

export const TimeseriesAnimation: React.FC<TAnimatedLineChart2Props> = ({
	width,
	height,
	timeSeries,
	theme,
}) => {
	const {durationInFrames} = useVideoConfig();

	const debugTheme = useThemeFromEnum('LORENZOBERTOLINI' as any);

	const CHART_PAGE_MARGIN = 60;
	const CHART_PAGE_WIDTH = width;
	const CHART_PAGE_HEIGHT = height * 0.25;
	const CHART_CONTENT_WIDTH = CHART_PAGE_WIDTH - 2 * CHART_PAGE_MARGIN;
	const CHART_CONTENT_HEIGHT = CHART_PAGE_HEIGHT - 2 * CHART_PAGE_MARGIN;

	const DEBUG_PAGE_HEIGHT = height - CHART_PAGE_HEIGHT;

	const chartLayout = useChartLayout({
		width: CHART_CONTENT_WIDTH,
		height: CHART_CONTENT_HEIGHT,
	});

	// TODO use keyframes perhaps
	const td_buildup = Math.floor(durationInFrames * 0.33);
	const td_zoom = Math.floor(durationInFrames * 0.33);
	const td_buildup_again = durationInFrames - td_buildup - td_zoom;

	// TODO also allow for dates as indices eventually
	// TODO fix with [0,0] ??? really
	const view_series_start = [0, 1] as [number, number];
	const view_series_full = [0, timeSeries.length] as [number, number];
	const view_series_zoom_1 = [220, 420] as [number, number];

	return (
		<div style={{position: 'relative'}}>
			<PeriodScaleAnimationContainer
				timeSeries={timeSeries}
				area={chartLayout.areas.xAxis}
				transitions={[
					{
						fromDomainIndices: view_series_start, // if omitted & index===0, fill with [0,1]
						toDomainIndices: view_series_full,
						transitionSpec: {
							durationInFrames: td_buildup,
							easingFunction: Easing.linear,
							numberOfSlices: 5,
							transitionType: 'DEFAULT',
						},
					},
					{
						fromDomainIndices: view_series_full, // if omitted, fill with previous fromDomainIndices
						toDomainIndices: view_series_zoom_1,
						transitionSpec: {
							durationInFrames: td_zoom,
							easingFunction: Easing.linear,
							// numberOfSlices: 5, why does the year behave so weidly with 5 and not with 1 here?
							numberOfSlices: 1,
							transitionType: 'DEFAULT',
						},
					},
					{
						fromDomainIndices: view_series_zoom_1, // TODO if omitted, fill with previous fromDomainIndices
						toDomainIndices: view_series_full,
						transitionSpec: {
							durationInFrames: td_buildup_again,
							easingFunction: Easing.linear,
							// numberOfSlices: 5,
							numberOfSlices: 1,
							transitionType: 'DEFAULT',
						},
					},
				]}
			>
				{({
					periodsScale,
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
								<Page
								// show
								>
									{() => {
										return (
											<>
												<div style={{position: 'absolute'}}>
													<DisplayGridLayout
														stroke={'rgba(255,0,255,0.4)'}
														fill="transparent"
														hide={true}
														areas={chartLayout.areas}
														width={width}
														height={height}
													/>
												</div>
												<LineChart_XAxisShowcase
													timeSeries={timeSeries}
													layoutAreas={{
														xAxis: chartLayout.areas.xAxis,
														xAxis_days: chartLayout.areas.xAxis_days,
														xAxis_monthStarts:
															chartLayout.areas.xAxis_monthStarts,
														xAxis_quarterStarts:
															chartLayout.areas.xAxis_quarterStarts,
													}}
													yDomainType={Y_DOMAIN_TYPE}
													theme={theme}
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
								height={DEBUG_PAGE_HEIGHT}
								margin={CHART_PAGE_MARGIN}
								nrBaselines={40}
								theme={debugTheme}
							>
								<Page show>
									<LineChartAnimationContextDebugger
										frame={frame}
										periodsScale={periodsScale}
										currentSliceInfo={currentSliceInfo}
										currentTransitionInfo={currentTransitionInfo}
										{...rest}
									/>
								</Page>
							</PageContext>
						</div>
					);
				}}
			</PeriodScaleAnimationContainer>
		</div>
	);
};

function roundToTwoDecimals(num: number): number {
	return parseFloat(num.toFixed(2));
}
// // Example usage:
// const input: number = 123.456789;
// const output: number = roundToTwoDecimals(input);
// console.log(output); // Output: 123.46

const LineChartAnimationContextDebugger: React.FC<
	TPeriodScaleAnimationContext
> = ({frame, currentSliceInfo, currentTransitionInfo, periodsScale}) => {
	const {theme, contentWidth} = usePage();

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
			key: 'fromDomainIndices',
			value: JSON.stringify(currentTransitionInfo.fromDomainIndices),
		},
		{
			key: 'toDomainIndices',
			value: JSON.stringify(currentTransitionInfo.toDomainIndices),
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
			key: 'durationInSeconds',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.durationInSeconds)
			),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentTransitionInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.framesPercentage)
			),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentTransitionInfo.easingPercentage)
			),
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
			key: 'durationInSeconds',
			value: JSON.stringify(currentSliceInfo.durationInSeconds),
		},
		{
			key: 'relativeFrame',
			value: JSON.stringify(currentSliceInfo.relativeFrame),
		},
		{
			key: 'framesPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentSliceInfo.framesPercentage)
			),
		},
		{
			key: 'easingPercentage',
			value: JSON.stringify(
				roundToTwoDecimals(currentSliceInfo.easingPercentage)
			),
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
			<div style={{fontSize: 32, color: theme.typography.textStyles.h1.color}}>
				frame: {frame}
			</div>
			<div style={{fontSize: 32, color: theme.typography.textStyles.h1.color}}>
				periodsScale.visibleDomainIndices:{' '}
				{JSON.stringify(periodsScale.visibleDomainIndices)}
			</div>
			<div style={{fontSize: 32, color: theme.typography.textStyles.h1.color}}>
				periodsScale.fullPeriodDomainIndices:{' '}
				{JSON.stringify(periodsScale.fullPeriodDomainIndices)}
			</div>
			<PeriodScaleZoomVisualizer
				visibleDomainIndices={periodsScale.visibleDomainIndices}
				fullDomainIndices={periodsScale.fullPeriodDomainIndices}
				fromDomainIndices={
					currentSliceInfo.periodsScaleFrom.visibleDomainIndices
				}
				toDomainIndices={currentSliceInfo.periodsScaleTo.visibleDomainIndices}
				width={contentWidth}
			/>
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

const PeriodScaleZoomVisualizer: React.FC<{
	visibleDomainIndices: [number, number];
	fullDomainIndices: [number, number];
	fromDomainIndices: [number, number];
	toDomainIndices: [number, number];
	width: number;
}> = ({
	visibleDomainIndices,
	fullDomainIndices,
	fromDomainIndices,
	toDomainIndices,
	width,
}) => {
	const {theme} = usePage();

	const mapToX = (x: number) => {
		return interpolate(x, fullDomainIndices, [0, width]);
	};

	return (
		<div style={{color: theme.typography.colors.title.main, fontSize: 30}}>
			<div>{JSON.stringify(visibleDomainIndices)}</div>
			<div>{JSON.stringify(fullDomainIndices)}</div>
			<div
				style={{
					backgroundColor: 'gray',
					width: mapToX(fullDomainIndices[1] - fullDomainIndices[0]),
					height: 50,
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						height: 30,
						width: mapToX(visibleDomainIndices[1] - visibleDomainIndices[0]),
						top: 10,
						left: mapToX(visibleDomainIndices[0]),
						backgroundColor: 'white',
					}}
				></div>
				{/* from: red */}
				<div
					style={{
						position: 'absolute',
						height: 10,
						width: mapToX(fromDomainIndices[1] - fromDomainIndices[0]),
						top: 0,
						left: mapToX(fromDomainIndices[0]),
						backgroundColor: 'red',
					}}
				></div>
				{/* to: green */}
				<div
					style={{
						position: 'absolute',
						height: 10,
						width: mapToX(toDomainIndices[1] - toDomainIndices[0]),
						top: 40,
						left: mapToX(toDomainIndices[0]),
						backgroundColor: 'green',
					}}
				></div>
			</div>
		</div>
	);
};
