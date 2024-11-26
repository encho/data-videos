import React from 'react';
import invariant from 'tiny-invariant';
import {
	interpolate,
	interpolateColors,
	useVideoConfig,
	Sequence,
	Easing,
} from 'remotion';

import {HorizontalBar} from './HorizontalBar';
import {ZeroLine} from './ZeroLine';
import {getEnterKeyframes, getExitKeyframes} from './getKeyframes';
import {TBarChartValueLabelComponent} from './ValueLabelComponent';
import {TBarChartLabelComponent} from './LabelComponent';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
	getListItems_Enter,
	getListItems_Exit,
	getListItems_Update,
	getListItems_Appear,
	getListItems_Disappear,
} from '../../ListAnimation/useListTransition/useListTransition';
import {TBarChartTransitionContext} from '../useBarChartTransition/useBarChartTransition';
import {HtmlArea, DisplayGridRails} from '../../../../../../../acetti-layout';
import {TBarChartItem} from '../useBarChartTransition/useBarChartTransition';
import {
	getKeyFrame,
	getKeyFramesInterpolator,
	TKeyFramesGroup,
} from '../../../../../Keyframes/Keyframes/keyframes';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

type TBarsTransitionCommonProps = {
	showLayout: boolean;
	barChartTransitionContext: TBarChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
	theme: ThemeType;
	baseline: number;
};

type TBarsTransitionUpdateProps = TBarsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Update<TBarChartItem>;
};

type TBarsTransitionEnterProps = TBarsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Enter<TBarChartItem>;
	keyframes?: TKeyFramesGroup;
};

type TBarsTransitionExitProps = TBarsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Exit<TBarChartItem>;
	keyframes?: TKeyFramesGroup;
};

type TBarsTransitionProps = {
	showLayout?: boolean;
	barChartTransitionContext: TBarChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
	listTransitionContext:
		| ListTransitionContext_Enter<TBarChartItem>
		| ListTransitionContext_Update<TBarChartItem>
		| ListTransitionContext_Exit<TBarChartItem>;
	enterKeyframes?: TKeyFramesGroup;
	exitKeyframes?: TKeyFramesGroup;
	theme: ThemeType;
	baseline: number;
};

export const BarsTransition: React.FC<TBarsTransitionProps> = ({
	showLayout = false,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
	enterKeyframes,
	exitKeyframes,
	theme,
	baseline,
}) => {
	if (listTransitionContext.transitionType === 'update') {
		return (
			<BarsTransitionUpdate
				showLayout={showLayout}
				listTransitionContext={listTransitionContext}
				barChartTransitionContext={barChartTransitionContext}
				LabelComponent={LabelComponent}
				ValueLabelComponent={ValueLabelComponent}
				theme={theme}
				baseline={baseline}
			/>
		);
	}

	if (listTransitionContext.transitionType === 'enter') {
		return (
			<BarsTransitionEnter
				showLayout={showLayout}
				listTransitionContext={listTransitionContext}
				barChartTransitionContext={barChartTransitionContext}
				LabelComponent={LabelComponent}
				ValueLabelComponent={ValueLabelComponent}
				keyframes={enterKeyframes}
				theme={theme}
				baseline={baseline}
			/>
		);
	}

	invariant(listTransitionContext.transitionType === 'exit');

	return (
		<BarsTransitionExit
			showLayout={showLayout}
			listTransitionContext={listTransitionContext}
			barChartTransitionContext={barChartTransitionContext}
			LabelComponent={LabelComponent}
			ValueLabelComponent={ValueLabelComponent}
			keyframes={exitKeyframes}
			theme={theme}
			baseline={baseline}
		/>
	);
};

const BarsTransitionUpdate: React.FC<TBarsTransitionUpdateProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
	theme,
	baseline,
}) => {
	const {frame, durationInFrames} = listTransitionContext;

	const {xScale} = barChartTransitionContext;
	const {barArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	// const GRID_RAILS_COLOR = 'magenta';
	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

	const enterItems = getListItems_Enter(listTransitionContext);
	const exitItems = getListItems_Exit(listTransitionContext);
	const appearItems = getListItems_Appear(listTransitionContext);
	const disappearItems = getListItems_Disappear(listTransitionContext);
	const updateItems = getListItems_Update(listTransitionContext);

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = barChartTransitionContext;
	const zeroLine_x1 = xScale(0);
	const zeroLine_y1 = 0;
	const zeroLine_y2 = plotArea.height;

	return (
		<div>
			<div>
				{[...enterItems].map((enterItem) => {
					const {opacity, item, area} = enterItem;

					const valueAnimationPercentage = interpolate(
						frame,
						[0, durationInFrames - 1],
						[0, 1]
					);

					// TODO this may have to happen quicker than the whole durationInFrames
					const currentValue = interpolate(
						valueAnimationPercentage,
						[0, 1],
						[0, item.value],
						{}
					);

					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

					const relativeBarPositions = {
						y: 0,
						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					// the value label margins
					const positiveValueLabelMarginLeft =
						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

					const negativeValueLabelMarginLeft = relativeBarPositions.x;

					const isPositiveBarOrZero = item.value >= 0;

					const barColor = item.color;

					return (
						<HtmlArea key={item.id} area={area} opacity={opacity}>
							{showLayout ? (
								<div style={{position: 'absolute'}}>
									<DisplayGridRails
										{...barChartTransitionContext.barChartItemLayout.gridLayout}
										stroke={GRID_RAILS_COLOR}
									/>
								</div>
							) : null}
							<HtmlArea area={labelArea}>
								<LabelComponent
									id={item.id}
									animateExit={false}
									animateEnter={false}
									baseline={baseline}
									theme={theme}
									label={item.label}
								/>
							</HtmlArea>

							<HorizontalBar
								baseline={baseline}
								theme={theme}
								area={barArea}
								currentValue={currentValue}
								currentColor={barColor}
								xScale={xScale}
							/>

							{/* the negative value label */}
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginLeft: negativeValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										id={item.id}
										value={currentValue}
										animateExit={false}
										animateEnter={false}
										baseline={baseline}
										theme={theme}
									/>
								</HtmlArea>
							)}

							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginLeft: positiveValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										id={item.id}
										value={currentValue}
										animateExit={false}
										animateEnter={false}
										baseline={baseline}
										theme={theme}
									/>
								</HtmlArea>
							) : null}
						</HtmlArea>
					);
				})}
				{[...exitItems].map((exitItem) => {
					const {opacity, item, area} = exitItem;

					const valueAnimationPercentage = interpolate(
						frame,
						[0, durationInFrames - 1],
						[0, 1]
					);

					const currentValue = interpolate(
						valueAnimationPercentage,
						[0, 1],
						[item.value, 0],
						{}
					);

					// see also useAnimatedBarChartLayout line 100 ff.
					// const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);
					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

					// TODO rather as Area format with x1 x2 y1 y2 height width
					const relativeBarPositions = {
						y: 0,
						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					// the value label margins
					const positiveValueLabelMarginLeft =
						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

					const negativeValueLabelMarginLeft = relativeBarPositions.x;

					const barColor = item.color;

					const isPositiveBarOrZero = item.value >= 0;

					return (
						<HtmlArea key={item.id} area={area} opacity={opacity}>
							{showLayout ? (
								<div style={{position: 'absolute'}}>
									<DisplayGridRails
										{...barChartTransitionContext.barChartItemLayout.gridLayout}
										stroke={GRID_RAILS_COLOR}
									/>
								</div>
							) : null}

							<HtmlArea area={labelArea}>
								<LabelComponent
									id={item.id}
									animateExit={false}
									animateEnter={false}
									baseline={baseline}
									theme={theme}
									label={item.label}
								/>
							</HtmlArea>

							<HorizontalBar
								baseline={baseline}
								theme={theme}
								area={barArea}
								currentValue={currentValue}
								currentColor={barColor}
								xScale={xScale}
							/>

							{/* the negative value label */}
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginLeft: negativeValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={item.id}
										value={currentValue}
										baseline={baseline}
										theme={theme}
									/>
								</HtmlArea>
							)}

							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginLeft: positiveValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										id={item.id}
										value={currentValue}
										animateExit={false}
										animateEnter={false}
										baseline={baseline}
										theme={theme}
									/>
								</HtmlArea>
							) : null}
						</HtmlArea>
					);
				})}
				{[...appearItems, ...disappearItems, ...updateItems].map((listItem) => {
					const {opacity, itemFrom, itemTo, area} = listItem;

					// TODO this could be brought into the context
					const valueAnimationPercentage = interpolate(
						frame,
						[0, durationInFrames - 1],
						[0, 1],
						{}
					);

					// TODO this could be brought into the context
					const currentValue = interpolate(
						valueAnimationPercentage,
						[0, 1],
						[itemFrom.value, itemTo.value]
					);

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

					const relativeBarPositions = {
						y: 0,
						x: currentValue >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					// the value label margins
					const positiveValueLabelMarginLeft =
						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

					const negativeValueLabelMarginLeft = relativeBarPositions.x;

					const isPositiveBarOrZero = currentValue >= 0;

					const currentBarColor = interpolateColors(
						frame,
						[0, durationInFrames - 1],
						[itemFrom.color, itemTo.color]
					);

					return (
						<HtmlArea key={itemTo.id} area={area} opacity={opacity}>
							{showLayout ? (
								<div style={{position: 'absolute'}}>
									<DisplayGridRails
										{...barChartTransitionContext.barChartItemLayout.gridLayout}
										stroke={GRID_RAILS_COLOR}
									/>
								</div>
							) : null}

							<HtmlArea area={labelArea}>
								<LabelComponent
									id={itemTo.id}
									animateExit={false}
									animateEnter={false}
									baseline={baseline}
									theme={theme}
									label={itemTo.label} // TODO deprecate
									// TODO
									// statusFrom={itemTo.status || "default"}
									// statusTo={itemTo.status || "default"}
									// upperValue={currentUpperValue} // although not really used mostly
									// lowerValue={currentLowerValue} // ...
									// value={currentValue} // ...
								/>
							</HtmlArea>

							<HorizontalBar
								baseline={baseline}
								theme={theme}
								area={barArea}
								currentValue={currentValue}
								currentColor={currentBarColor}
								xScale={xScale}
							/>

							{/* the negative value label */}
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginLeft: negativeValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={itemTo.id}
										value={currentValue}
										baseline={baseline}
										theme={theme}
										// TODO
										// label={itemTo.label} // althogh not often used...
										// statusFrom={itemTo.status || "default"}
										// statusTo={itemTo.status || "default"}
										// upperValue={currentUpperValue}
										// lowerValue={currentLowerValue}
									/>
								</HtmlArea>
							)}

							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginLeft: positiveValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										id={itemTo.id}
										animateExit={false}
										animateEnter={false}
										baseline={baseline}
										theme={theme}
										value={currentValue}
									/>
								</HtmlArea>
							) : null}
						</HtmlArea>
					);
				})}
			</div>

			<ZeroLine
				area={plotArea}
				x={zeroLine_x1}
				y1={zeroLine_y1}
				y2={zeroLine_y2}
				theme={theme}
				baseline={baseline}
			/>
		</div>
	);
};

// TODO think about if we here do not need getListItems_Enter
// also: these are not really hooks but just memoized functions of TListTransitionContext
const BarsTransitionEnter: React.FC<TBarsTransitionEnterProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
	keyframes: keyframesProp,
	theme,
	baseline,
}) => {
	const {fps} = useVideoConfig();

	// TODO evtl. have it called relativeFrame
	const {frame, durationInFrames, frameRange} = listTransitionContext;

	const {visibleItems} = listTransitionContext.to;

	const keyframes = getEnterKeyframes({
		fps,
		durationInFrames,
		data: visibleItems,
		keyframes: keyframesProp,
	});

	const {xScale} = barChartTransitionContext;

	const {barArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const rowsInfo = visibleItems.map((dataItem) => {
		const area = listTransitionContext.to.getListItemArea(dataItem.id);
		return {area, dataItem};
	});

	// const GRID_RAILS_COLOR = 'magenta';
	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = barChartTransitionContext;
	const zeroLine_x1 = xScale(0);

	return (
		<Sequence
			from={frameRange.startFrame}
			durationInFrames={durationInFrames}
			layout="none"
		>
			{rowsInfo.map(({dataItem, area}) => {
				const keyframe_label_appear = getKeyFrame(
					keyframes,
					'LABEL_APPEAR__' + dataItem.id
				);

				const keyframe_valueLabel_appear = getKeyFrame(
					keyframes,
					'VALUE_LABEL_APPEAR__' + dataItem.id
				);

				const currentValueEasingPercentage = getKeyFramesInterpolator(
					keyframes,
					[`BAR_ENTER_START__${dataItem.id}`, `BAR_ENTER_END__${dataItem.id}`],
					[0, 1],
					[Easing.ease]
				);

				const currentValue = interpolate(
					currentValueEasingPercentage(frame),
					[0, 1],
					[0, dataItem.value]
				);

				const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

				const relativeBarPositions = {
					y: 0,
					x: dataItem.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
					height: barArea.height,
					width: currentBarWidth,
				};

				// the value label margins
				const positiveValueLabelMarginLeft =
					-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

				const negativeValueLabelMarginLeft = relativeBarPositions.x;

				const isPositiveBarOrZero = dataItem.value >= 0;

				const barColor = dataItem.color;

				return (
					<HtmlArea key={dataItem.id} area={area}>
						{showLayout ? (
							<div style={{position: 'absolute'}}>
								<DisplayGridRails
									{...barChartTransitionContext.barChartItemLayout.gridLayout}
									stroke={GRID_RAILS_COLOR}
								/>
							</div>
						) : null}

						{/* the label */}

						<Sequence from={keyframe_label_appear.frame}>
							<HtmlArea area={labelArea}>
								<LabelComponent
									animateEnter
									animateExit={false}
									id={dataItem.id}
									baseline={baseline}
									theme={theme}
									label={dataItem.label}
								/>
							</HtmlArea>
						</Sequence>

						<HorizontalBar
							baseline={baseline}
							theme={theme}
							currentValue={currentValue}
							currentColor={barColor}
							xScale={xScale}
							area={barArea}
						/>

						<Sequence from={keyframe_valueLabel_appear.frame}>
							{/* the negative value label */}
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginLeft: negativeValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
									/>
								</HtmlArea>
							)}

							{/* the value label */}
							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginLeft: positiveValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
									/>
								</HtmlArea>
							) : null}
						</Sequence>
					</HtmlArea>
				);
			})}

			{/* the zero line */}
			{(() => {
				const zeroLine_y1_full = 0;
				const zeroLine_y2_full = plotArea.height;

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y1 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_ENTER_START', 'ZEROLINE_ENTER_END'],
					[zeroLine_y1_full, zeroLine_y1_full],
					[Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y2 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_ENTER_START', 'ZEROLINE_ENTER_END'],
					[0, zeroLine_y2_full],
					[Easing.ease]
				);

				const zeroLine_y1 = interpolateZeroLine__y1(frame);
				const zeroLine_y2 = interpolateZeroLine__y2(frame);

				return (
					<ZeroLine
						area={plotArea}
						x={zeroLine_x1}
						y1={zeroLine_y1}
						y2={zeroLine_y2}
						theme={theme}
						baseline={baseline}
					/>
				);
			})()}
		</Sequence>
	);
};

const BarsTransitionExit: React.FC<TBarsTransitionExitProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
	keyframes: keyframesProp,
	theme,
	baseline,
}) => {
	const {fps} = useVideoConfig();

	const {frame, durationInFrames, frameRange} = listTransitionContext;

	const {visibleItems} = listTransitionContext.from;

	const keyframes = getExitKeyframes({
		fps,
		durationInFrames,
		data: visibleItems,
		keyframes: keyframesProp,
	});

	const {xScale} = barChartTransitionContext;

	const {barArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const rowsInfo = visibleItems.map((dataItem) => {
		const area = listTransitionContext.from.getListItemArea(dataItem.id);
		return {area, dataItem};
	});

	// const GRID_RAILS_COLOR = 'magenta';
	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = barChartTransitionContext;
	const zeroLine_x1 = xScale(0);

	return (
		<Sequence
			from={frameRange.startFrame}
			durationInFrames={durationInFrames}
			layout="none"
		>
			{rowsInfo.map(({dataItem, area}) => {
				const keyframe_valueLabel_disappear = getKeyFrame(
					keyframes,
					'VALUE_LABEL_DISAPPEAR__' + dataItem.id
				);

				const currentValueEasingPercentage = getKeyFramesInterpolator(
					keyframes,
					[`BAR_EXIT_START__${dataItem.id}`, `BAR_EXIT_END__${dataItem.id}`],
					[0, 1],
					[Easing.ease]
				);

				const currentValue = interpolate(
					currentValueEasingPercentage(frame),
					[0, 1],
					[dataItem.value, 0]
				);

				const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

				const relativeBarPositions = {
					y: 0,
					x: dataItem.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
					height: barArea.height,
					width: currentBarWidth,
				};

				// the value label margins
				const positiveValueLabelMarginLeft =
					-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

				const negativeValueLabelMarginLeft = relativeBarPositions.x;

				const barColor = dataItem.color;

				const isPositiveBarOrZero = dataItem.value >= 0;

				return (
					<HtmlArea key={dataItem.id} area={area}>
						{showLayout ? (
							<div style={{position: 'absolute'}}>
								<DisplayGridRails
									{...barChartTransitionContext.barChartItemLayout.gridLayout}
									stroke={GRID_RAILS_COLOR}
								/>
							</div>
						) : null}

						{/* the label */}
						<HtmlArea area={labelArea}>
							<LabelComponent
								animateExit
								animateEnter={false}
								id={dataItem.id}
								baseline={baseline}
								theme={theme}
								label={dataItem.label}
							/>
						</HtmlArea>

						<HorizontalBar
							baseline={baseline}
							theme={theme}
							currentValue={currentValue}
							currentColor={barColor}
							xScale={xScale}
							area={barArea}
						/>

						{/* the negative value label */}
						<Sequence
							durationInFrames={keyframe_valueLabel_disappear.frame}
							layout="none"
						>
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginLeft: negativeValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateExit
										animateEnter={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
									/>
								</HtmlArea>
							)}

							{/* the value label */}
							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginLeft: positiveValueLabelMarginLeft}}
								>
									<ValueLabelComponent
										animateExit
										animateEnter={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
									/>
								</HtmlArea>
							) : null}
						</Sequence>
					</HtmlArea>
				);
			})}

			{/* the zero line */}
			{(() => {
				const zeroLine_y1_full = 0;
				const zeroLine_y2_full = plotArea.height;

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y1 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_EXIT_START', 'ZEROLINE_EXIT_END'],
					[zeroLine_y1_full, zeroLine_y2_full],
					[Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__y2 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_EXIT_START', 'ZEROLINE_EXIT_END'],
					[zeroLine_y2_full, zeroLine_y2_full],
					[Easing.ease]
				);

				const zeroLine_y1 = interpolateZeroLine__y1(frame);
				const zeroLine_y2 = interpolateZeroLine__y2(frame);

				return (
					<ZeroLine
						area={plotArea}
						x={zeroLine_x1}
						y1={zeroLine_y1}
						y2={zeroLine_y2}
						theme={theme}
						baseline={baseline}
					/>
				);
			})()}
		</Sequence>
	);
};
