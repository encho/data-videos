import React from 'react';
import invariant from 'tiny-invariant';
import {
	interpolate,
	interpolateColors,
	useVideoConfig,
	Sequence,
	Easing,
} from 'remotion';

import {VerticalBar, TVerticalBarComponent, getColumnRect} from './VerticalBar';
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
import {TColumnChartTransitionContext} from '../useColumnChartTransition/useColumnChartTransition';
import {HtmlArea, DisplayGridRails} from '../../../../../../../acetti-layout';
import {TColumnChartItem} from '../useColumnChartTransition/useColumnChartTransition';
import {
	getKeyFrame,
	getKeyFramesInterpolator,
	TKeyFramesGroup,
} from '../../../../../Keyframes/Keyframes/keyframes';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

type TColumnsTransitionCommonProps = {
	showLayout: boolean;
	columnChartTransitionContext: TColumnChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
	VerticalBarComponent: TVerticalBarComponent;
	theme: ThemeType;
	baseline: number;
	hideLabel?: boolean;
};

type TColumnsTransitionUpdateProps = TColumnsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Update<TColumnChartItem>;
};

type TColumnsTransitionEnterProps = TColumnsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Enter<TColumnChartItem>;
	keyframes?: TKeyFramesGroup;
};

type TColumnsTransitionExitProps = TColumnsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Exit<TColumnChartItem>;
	keyframes?: TKeyFramesGroup;
};

type TColumnsTransitionProps = {
	showLayout?: boolean;
	columnChartTransitionContext: TColumnChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
	VerticalBarComponent?: TVerticalBarComponent;
	listTransitionContext:
		| ListTransitionContext_Enter<TColumnChartItem>
		| ListTransitionContext_Update<TColumnChartItem>
		| ListTransitionContext_Exit<TColumnChartItem>;
	enterKeyframes?: TKeyFramesGroup;
	exitKeyframes?: TKeyFramesGroup;
	theme: ThemeType;
	baseline: number;
};

export const ColumnsTransition: React.FC<TColumnsTransitionProps> = ({
	showLayout = false,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	VerticalBarComponent = VerticalBar,
	columnChartTransitionContext,
	enterKeyframes,
	exitKeyframes,
	theme,
	baseline,
}) => {
	if (listTransitionContext.transitionType === 'update') {
		return (
			<div
				style={{
					color: 'yellow',
					padding: 50,
					fontSize: 50,
					backgroundColor: 'red',
				}}
			>
				UPDATE
			</div>
		);
		// TODO implement:
		// return (
		// 	<BarsTransitionUpdate
		// 		showLayout={showLayout}
		// 		listTransitionContext={listTransitionContext}
		// 		barChartTransitionContext={barChartTransitionContext}
		// 		LabelComponent={LabelComponent}
		// 		ValueLabelComponent={ValueLabelComponent}
		// 		HorizontalBarComponent={HorizontalBarComponent}
		// 		theme={theme}
		// 		baseline={baseline}
		// 	/>
		// );
	}

	if (listTransitionContext.transitionType === 'enter') {
		return (
			<ColumnsTransitionEnter
				showLayout={showLayout}
				listTransitionContext={listTransitionContext}
				columnChartTransitionContext={columnChartTransitionContext}
				LabelComponent={LabelComponent}
				ValueLabelComponent={ValueLabelComponent}
				VerticalBarComponent={VerticalBarComponent}
				keyframes={enterKeyframes}
				theme={theme}
				baseline={baseline}
			/>
		);
	}

	invariant(listTransitionContext.transitionType === 'exit');

	// return (
	// 	<div
	// 		style={{
	// 			color: 'yellow',
	// 			padding: 50,
	// 			fontSize: 50,
	// 			backgroundColor: 'red',
	// 		}}
	// 	>
	// 		EXIT
	// 	</div>
	// );
	return (
		<ColumnsTransitionExit
			showLayout={showLayout}
			listTransitionContext={listTransitionContext}
			columnChartTransitionContext={columnChartTransitionContext}
			LabelComponent={LabelComponent}
			ValueLabelComponent={ValueLabelComponent}
			VerticalBarComponent={VerticalBarComponent}
			keyframes={exitKeyframes}
			theme={theme}
			baseline={baseline}
		/>
	);
};

const ColumnsTransitionEnter: React.FC<TColumnsTransitionEnterProps> = ({
	showLayout,
	listTransitionContext,
	columnChartTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	VerticalBarComponent,
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

	const {yScale} = columnChartTransitionContext;

	const {columnArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		columnChartTransitionContext.columnChartItemLayout;

	const columnsInfo = visibleItems.map((dataItem) => {
		const area = listTransitionContext.to.getListItemArea(dataItem.id);
		return {area, dataItem};
	});

	// const GRID_RAILS_COLOR = 'magenta';
	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = columnChartTransitionContext;
	const zeroLine_y1 = yScale(0);

	return (
		<Sequence
			from={frameRange.startFrame}
			durationInFrames={durationInFrames}
			layout="none"
		>
			{columnsInfo.map(({dataItem, area}) => {
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

				const columnRect = getColumnRect({
					area: columnArea,
					value: currentValue,
					yScale,
				});

				// the value label margins
				const positiveValueLabelMarginTop = columnRect.y;

				const negativeValueLabelMarginTop =
					-1 * (columnArea.height - columnRect.y - columnRect.height);

				const isPositiveBarOrZero = dataItem.value >= 0;

				const barColor = dataItem.color;

				return (
					<HtmlArea key={dataItem.id} area={area}>
						{showLayout ? (
							<div style={{position: 'absolute'}}>
								<DisplayGridRails
									{...columnChartTransitionContext.columnChartItemLayout
										.gridLayout}
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

						{/* TODO check validity */}
						<VerticalBarComponent
							animateEnter
							animateExit={false}
							id={dataItem.id}
							label={dataItem.label}
							baseline={baseline}
							theme={theme}
							valueTo={dataItem.value}
							currentValue={currentValue}
							currentColor={barColor}
							yScale={yScale}
							area={columnArea}
						/>

						<Sequence from={keyframe_valueLabel_appear.frame}>
							{/* the negative value label */}
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginTop: negativeValueLabelMarginTop}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
										label={dataItem.label}
									/>
								</HtmlArea>
							)}

							{/* the value label */}
							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginTop: positiveValueLabelMarginTop}}
								>
									<ValueLabelComponent
										animateEnter
										animateExit={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
										label={dataItem.label}
									/>
								</HtmlArea>
							) : null}
						</Sequence>
					</HtmlArea>
				);
			})}

			{/* the zero line */}
			{(() => {
				const zeroLine_x1_full = 0;
				const zeroLine_x2_full = plotArea.width;

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__x1 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_ENTER_START', 'ZEROLINE_ENTER_END'],
					[zeroLine_x1_full, zeroLine_x1_full],
					[Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__x2 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_ENTER_START', 'ZEROLINE_ENTER_END'],
					[0, zeroLine_x2_full],
					[Easing.ease]
				);

				const zeroLine_x1 = interpolateZeroLine__x1(frame);
				const zeroLine_x2 = interpolateZeroLine__x2(frame);

				return (
					<ZeroLine
						area={plotArea}
						x1={zeroLine_x1}
						x2={zeroLine_x2}
						y1={zeroLine_y1}
						y2={zeroLine_y1}
						theme={theme}
						baseline={baseline}
					/>
				);
			})()}
		</Sequence>
	);
};

// const BarsTransitionUpdate: React.FC<TBarsTransitionUpdateProps> = ({
// 	showLayout,
// 	listTransitionContext,
// 	LabelComponent,
// 	ValueLabelComponent,
// 	HorizontalBarComponent,
// 	barChartTransitionContext,
// 	theme,
// 	baseline,
// }) => {
// 	const {frame, durationInFrames} = listTransitionContext;

// 	const {xScale} = barChartTransitionContext;
// 	const {barArea, labelArea, valueLabelArea, negativeValueLabelArea} =
// 		barChartTransitionContext.barChartItemLayout;

// 	// const GRID_RAILS_COLOR = 'magenta';
// 	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

// 	const enterItems = getListItems_Enter(listTransitionContext);
// 	const exitItems = getListItems_Exit(listTransitionContext);
// 	const appearItems = getListItems_Appear(listTransitionContext);
// 	const disappearItems = getListItems_Disappear(listTransitionContext);
// 	const updateItems = getListItems_Update(listTransitionContext);

// 	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
// 	const {plotArea} = barChartTransitionContext;
// 	const zeroLine_x1 = xScale(0);
// 	const zeroLine_y1 = 0;
// 	const zeroLine_y2 = plotArea.height;

// 	return (
// 		<div>
// 			<div>
// 				{[...enterItems].map((enterItem) => {
// 					const {opacity, item, area} = enterItem;

// 					const valueAnimationPercentage = interpolate(
// 						frame,
// 						[0, durationInFrames - 1],
// 						[0, 1]
// 					);

// 					// TODO this may have to happen quicker than the whole durationInFrames
// 					const currentValue = interpolate(
// 						valueAnimationPercentage,
// 						[0, 1],
// 						[0, item.value],
// 						{}
// 					);

// 					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

// 					const relativeBarPositions = {
// 						y: 0,
// 						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
// 						height: barArea.height,
// 						width: currentBarWidth,
// 					};

// 					// the value label margins
// 					const positiveValueLabelMarginLeft =
// 						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

// 					const negativeValueLabelMarginLeft = relativeBarPositions.x;

// 					const isPositiveBarOrZero = item.value >= 0;

// 					const barColor = item.color;

// 					return (
// 						<HtmlArea key={item.id} area={area} opacity={opacity}>
// 							{showLayout ? (
// 								<div style={{position: 'absolute'}}>
// 									<DisplayGridRails
// 										{...barChartTransitionContext.barChartItemLayout.gridLayout}
// 										stroke={GRID_RAILS_COLOR}
// 									/>
// 								</div>
// 							) : null}
// 							<HtmlArea area={labelArea}>
// 								<LabelComponent
// 									id={item.id}
// 									animateExit={false}
// 									animateEnter={false}
// 									baseline={baseline}
// 									theme={theme}
// 									label={item.label}
// 								/>
// 							</HtmlArea>

// 							<HorizontalBarComponent
// 								id={item.id}
// 								label={item.label}
// 								baseline={baseline}
// 								theme={theme}
// 								area={barArea}
// 								currentValue={currentValue}
// 								valueTo={item.value}
// 								currentColor={barColor}
// 								xScale={xScale}
// 								animateExit={false}
// 								animateEnter={false}
// 							/>

// 							{/* the negative value label */}
// 							{isPositiveBarOrZero ? null : (
// 								<HtmlArea
// 									area={negativeValueLabelArea}
// 									style={{marginLeft: negativeValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										id={item.id}
// 										label={item.label}
// 										value={currentValue}
// 										animateExit={false}
// 										animateEnter={false}
// 										baseline={baseline}
// 										theme={theme}
// 									/>
// 								</HtmlArea>
// 							)}

// 							{isPositiveBarOrZero ? (
// 								<HtmlArea
// 									area={valueLabelArea}
// 									style={{marginLeft: positiveValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										id={item.id}
// 										label={item.label}
// 										value={currentValue}
// 										animateExit={false}
// 										animateEnter={false}
// 										baseline={baseline}
// 										theme={theme}
// 									/>
// 								</HtmlArea>
// 							) : null}
// 						</HtmlArea>
// 					);
// 				})}
// 				{[...exitItems].map((exitItem) => {
// 					const {opacity, item, area} = exitItem;

// 					const valueAnimationPercentage = interpolate(
// 						frame,
// 						[0, durationInFrames - 1],
// 						[0, 1]
// 					);

// 					const currentValue = interpolate(
// 						valueAnimationPercentage,
// 						[0, 1],
// 						[item.value, 0],
// 						{}
// 					);

// 					// see also useAnimatedBarChartLayout line 100 ff.
// 					// const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);
// 					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

// 					// TODO rather as Area format with x1 x2 y1 y2 height width
// 					const relativeBarPositions = {
// 						y: 0,
// 						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
// 						height: barArea.height,
// 						width: currentBarWidth,
// 					};

// 					// the value label margins
// 					const positiveValueLabelMarginLeft =
// 						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

// 					const negativeValueLabelMarginLeft = relativeBarPositions.x;

// 					const barColor = item.color;

// 					const isPositiveBarOrZero = item.value >= 0;

// 					return (
// 						<HtmlArea key={item.id} area={area} opacity={opacity}>
// 							{showLayout ? (
// 								<div style={{position: 'absolute'}}>
// 									<DisplayGridRails
// 										{...barChartTransitionContext.barChartItemLayout.gridLayout}
// 										stroke={GRID_RAILS_COLOR}
// 									/>
// 								</div>
// 							) : null}

// 							<HtmlArea area={labelArea}>
// 								<LabelComponent
// 									id={item.id}
// 									animateExit={false}
// 									animateEnter={false}
// 									baseline={baseline}
// 									theme={theme}
// 									label={item.label}
// 								/>
// 							</HtmlArea>

// 							<HorizontalBarComponent
// 								id={item.id}
// 								label={item.label}
// 								baseline={baseline}
// 								theme={theme}
// 								area={barArea}
// 								valueFrom={item.value}
// 								currentValue={currentValue}
// 								currentColor={barColor}
// 								xScale={xScale}
// 								animateExit={false}
// 								animateEnter={false}
// 							/>

// 							{/* the negative value label */}
// 							{isPositiveBarOrZero ? null : (
// 								<HtmlArea
// 									area={negativeValueLabelArea}
// 									style={{marginLeft: negativeValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										animateEnter
// 										animateExit={false}
// 										id={item.id}
// 										value={currentValue}
// 										label={item.label}
// 										baseline={baseline}
// 										theme={theme}
// 									/>
// 								</HtmlArea>
// 							)}

// 							{isPositiveBarOrZero ? (
// 								<HtmlArea
// 									area={valueLabelArea}
// 									style={{marginLeft: positiveValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										id={item.id}
// 										value={currentValue}
// 										label={item.label}
// 										animateExit={false}
// 										animateEnter={false}
// 										baseline={baseline}
// 										theme={theme}
// 									/>
// 								</HtmlArea>
// 							) : null}
// 						</HtmlArea>
// 					);
// 				})}
// 				{[...appearItems, ...disappearItems, ...updateItems].map((listItem) => {
// 					const {opacity, itemFrom, itemTo, area} = listItem;

// 					// TODO this could be brought into the context
// 					const valueAnimationPercentage = interpolate(
// 						frame,
// 						[0, durationInFrames - 1],
// 						[0, 1],
// 						{}
// 					);

// 					// TODO this could be brought into the context
// 					const currentValue = interpolate(
// 						valueAnimationPercentage,
// 						[0, 1],
// 						[itemFrom.value, itemTo.value]
// 					);

// 					// see also useAnimatedBarChartLayout line 100 ff.
// 					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

// 					const relativeBarPositions = {
// 						y: 0,
// 						x: currentValue >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
// 						height: barArea.height,
// 						width: currentBarWidth,
// 					};

// 					// the value label margins
// 					const positiveValueLabelMarginLeft =
// 						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

// 					const negativeValueLabelMarginLeft = relativeBarPositions.x;

// 					const isPositiveBarOrZero = currentValue >= 0;

// 					const currentBarColor = interpolateColors(
// 						frame,
// 						[0, durationInFrames - 1],
// 						[itemFrom.color, itemTo.color]
// 					);

// 					return (
// 						<HtmlArea key={itemTo.id} area={area} opacity={opacity}>
// 							{showLayout ? (
// 								<div style={{position: 'absolute'}}>
// 									<DisplayGridRails
// 										{...barChartTransitionContext.barChartItemLayout.gridLayout}
// 										stroke={GRID_RAILS_COLOR}
// 									/>
// 								</div>
// 							) : null}

// 							<HtmlArea area={labelArea}>
// 								<LabelComponent
// 									id={itemTo.id}
// 									animateExit={false}
// 									animateEnter={false}
// 									baseline={baseline}
// 									theme={theme}
// 									label={itemTo.label} // TODO deprecate
// 									// TODO
// 									// statusFrom={itemTo.status || "default"}
// 									// statusTo={itemTo.status || "default"}
// 									// upperValue={currentUpperValue} // although not really used mostly
// 									// lowerValue={currentLowerValue} // ...
// 									// value={currentValue} // ...
// 								/>
// 							</HtmlArea>

// 							<HorizontalBarComponent
// 								id={itemTo.id}
// 								label={itemTo.label}
// 								baseline={baseline}
// 								theme={theme}
// 								area={barArea}
// 								valueFrom={itemFrom.value}
// 								valueTo={itemTo.value}
// 								currentValue={currentValue}
// 								currentColor={currentBarColor}
// 								xScale={xScale}
// 								animateExit={false}
// 								animateEnter={false}
// 							/>

// 							{/* the negative value label */}
// 							{isPositiveBarOrZero ? null : (
// 								<HtmlArea
// 									area={negativeValueLabelArea}
// 									style={{marginLeft: negativeValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										animateEnter
// 										animateExit={false}
// 										id={itemTo.id}
// 										value={currentValue}
// 										label={itemTo.label}
// 										baseline={baseline}
// 										theme={theme}
// 										// TODO
// 										// label={itemTo.label} // althogh not often used...
// 										// statusFrom={itemTo.status || "default"}
// 										// statusTo={itemTo.status || "default"}
// 										// upperValue={currentUpperValue}
// 										// lowerValue={currentLowerValue}
// 									/>
// 								</HtmlArea>
// 							)}

// 							{isPositiveBarOrZero ? (
// 								<HtmlArea
// 									area={valueLabelArea}
// 									style={{marginLeft: positiveValueLabelMarginLeft}}
// 								>
// 									<ValueLabelComponent
// 										id={itemTo.id}
// 										label={itemTo.label}
// 										animateExit={false}
// 										animateEnter={false}
// 										baseline={baseline}
// 										theme={theme}
// 										value={currentValue}
// 									/>
// 								</HtmlArea>
// 							) : null}
// 						</HtmlArea>
// 					);
// 				})}
// 			</div>

// 			<ZeroLine
// 				area={plotArea}
// 				x={zeroLine_x1}
// 				y1={zeroLine_y1}
// 				y2={zeroLine_y2}
// 				theme={theme}
// 				baseline={baseline}
// 			/>
// 		</div>
// 	);
// };

// TODO think about if we here do not need getListItems_Enter
// also: these are not really hooks but just memoized functions of TListTransitionContext

const ColumnsTransitionExit: React.FC<TColumnsTransitionExitProps> = ({
	showLayout,
	listTransitionContext,
	columnChartTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	VerticalBarComponent,
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

	const {yScale} = columnChartTransitionContext;

	const {columnArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		columnChartTransitionContext.columnChartItemLayout;

	const columnsInfo = visibleItems.map((dataItem) => {
		const area = listTransitionContext.from.getListItemArea(dataItem.id);
		return {area, dataItem};
	});

	// const GRID_RAILS_COLOR = 'magenta';
	const GRID_RAILS_COLOR = 'rgba(255,0,255,0.2)';

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = columnChartTransitionContext;
	const zeroLine_y1 = yScale(0);

	return (
		<Sequence
			from={frameRange.startFrame}
			durationInFrames={durationInFrames}
			layout="none"
		>
			{columnsInfo.map(({dataItem, area}) => {
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

				const columnRect = getColumnRect({
					area: columnArea,
					value: currentValue,
					yScale,
				});

				// the value label margins
				const positiveValueLabelMarginTop = columnRect.y;

				const negativeValueLabelMarginTop =
					-1 * (columnArea.height - columnRect.y - columnRect.height);

				const barColor = dataItem.color;

				const isPositiveBarOrZero = dataItem.value >= 0;

				return (
					<HtmlArea key={dataItem.id} area={area}>
						{showLayout ? (
							<div style={{position: 'absolute'}}>
								<DisplayGridRails
									{...columnChartTransitionContext.columnChartItemLayout
										.gridLayout}
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

						<VerticalBarComponent
							animateExit
							animateEnter={false}
							id={dataItem.id}
							label={dataItem.label}
							baseline={baseline}
							theme={theme}
							valueFrom={dataItem.value}
							currentValue={currentValue}
							currentColor={barColor}
							yScale={yScale}
							area={columnArea}
						/>

						{/* the negative value label */}
						<Sequence
							durationInFrames={keyframe_valueLabel_disappear.frame}
							layout="none"
						>
							{isPositiveBarOrZero ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									style={{marginTop: negativeValueLabelMarginTop}}
								>
									<ValueLabelComponent
										animateExit
										animateEnter={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
										label={dataItem.label}
									/>
								</HtmlArea>
							)}

							{/* the value label */}
							{isPositiveBarOrZero ? (
								<HtmlArea
									area={valueLabelArea}
									style={{marginTop: positiveValueLabelMarginTop}}
								>
									<ValueLabelComponent
										animateExit
										animateEnter={false}
										id={dataItem.id}
										baseline={baseline}
										theme={theme}
										value={dataItem.value}
										label={dataItem.label}
									/>
								</HtmlArea>
							) : null}
						</Sequence>
					</HtmlArea>
				);
			})}

			{/* the zero line */}
			{(() => {
				const zeroLine_x1_full = 0;
				const zeroLine_x2_full = plotArea.width;

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__x1 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_EXIT_START', 'ZEROLINE_EXIT_END'],
					[zeroLine_x1_full, zeroLine_x2_full],
					[Easing.ease]
				);

				// TODO eventually useCallback at start of the component to have more efficiency
				const interpolateZeroLine__x2 = getKeyFramesInterpolator(
					keyframes,
					['ZEROLINE_EXIT_START', 'ZEROLINE_EXIT_END'],
					[zeroLine_x2_full, zeroLine_x2_full],
					[Easing.ease]
				);

				const zeroLine_x1 = interpolateZeroLine__x1(frame);
				const zeroLine_x2 = interpolateZeroLine__x2(frame);

				return (
					<ZeroLine
						area={plotArea}
						x1={zeroLine_x1}
						x2={zeroLine_x2}
						y1={zeroLine_y1}
						y2={zeroLine_y1}
						theme={theme}
						baseline={baseline}
					/>
				);
			})()}
		</Sequence>
	);
};
