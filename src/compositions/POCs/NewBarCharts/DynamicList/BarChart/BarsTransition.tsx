import React from 'react';
import invariant from 'tiny-invariant';
import {
	interpolate,
	interpolateColors,
	useVideoConfig,
	Sequence,
	Easing,
} from 'remotion';

import {
	getBarChartEnterKeyframes,
	getBarChartExitKeyframes,
} from './getEnterKeyframes';
import {
	RoundedRightRect,
	RoundedLeftRect,
} from '../../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TBarChartValueLabelComponent} from '../components/ValueLabelComponent';
import {TBarChartLabelComponent} from '../components/LabelComponent';
import {usePage} from '../../../../../acetti-components/PageContext';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
	getListItems_Enter,
	getListItems_Exit,
	getListItems_Update,
	getListItems_Appear,
	getListItems_Disappear,
} from '../useListTransition/useListTransition';
import {TBarChartTransitionContext} from '../useBarChartTransition';
import {HtmlArea, DisplayGridRails} from '../../../../../acetti-layout';
import {TBarChartItem} from '../useBarChartTransition';
import {
	getKeyFrame,
	getKeyFramesInterpolator,
	TKeyFramesGroup,
} from '../../../Keyframes/Keyframes/keyframes';

type TBarsTransitionCommonProps = {
	showLayout: boolean;
	barChartTransitionContext: TBarChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
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
};

export const BarsTransition: React.FC<TBarsTransitionProps> = ({
	showLayout = false,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
	enterKeyframes,
	exitKeyframes,
}) => {
	if (listTransitionContext.transitionType === 'update') {
		return (
			<BarsTransitionUpdate
				showLayout={showLayout}
				listTransitionContext={listTransitionContext}
				barChartTransitionContext={barChartTransitionContext}
				LabelComponent={LabelComponent}
				ValueLabelComponent={ValueLabelComponent}
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
		/>
	);
};

const BarsTransitionUpdate: React.FC<TBarsTransitionUpdateProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = listTransitionContext;

	const {xScale} = barChartTransitionContext;
	const {barArea, labelArea, valueLabelArea, negativeValueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const GRID_RAILS_COLOR = 'magenta';

	const enterItems = getListItems_Enter(listTransitionContext);
	const exitItems = getListItems_Exit(listTransitionContext);
	const appearItems = getListItems_Appear(listTransitionContext);
	const disappearItems = getListItems_Disappear(listTransitionContext);
	const updateItems = getListItems_Update(listTransitionContext);

	// TODO see how it was done in SimpleBarChart.tsx line 450 ff..
	const {plotArea} = barChartTransitionContext;
	const zeroLine_x1 = xScale(0);
	const zeroLine_x2 = zeroLine_x1;
	const zeroLine_y1 = 0;
	const zeroLine_y2 = plotArea.height;
	const zeroLine_color = 'cyan';

	return (
		<div>
			<div>
				{[...enterItems].map((enterItem) => {
					const {opacity, item, area} = enterItem;

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);

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

					const isPositiveBar = item.value >= 0;

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[0, item.value],
						{}
					);

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
							<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
								<LabelComponent
									id={item.id}
									animateExit={false}
									animateEnter={false}
									baseline={baseline}
									theme={theme}
									label={item.label}
								/>
							</HtmlArea>

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{item.value > 0 && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : item.value < 0 && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							{/* the negative value label */}
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									// fill={theme.global.backgroundColor}
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

							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									// fill={theme.global.backgroundColor}
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

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[item.value, 0],
						{}
					);

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);

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

					const isPositiveBar = item.value >= 0;

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

							<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
								<LabelComponent
									id={item.id}
									animateExit={false}
									animateEnter={false}
									baseline={baseline}
									theme={theme}
									label={item.label}
								/>
							</HtmlArea>

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{item.value > 0 && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : item.value < 0 && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							{/* the negative value label */}
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									fill={theme.global.backgroundColor}
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

							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									fill={theme.global.backgroundColor}
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
					// const color = getPredefinedColor(id);

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[itemFrom.value, itemTo.value],
						{}
					);

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

					const relativeBarPositions = {
						y: 0,
						x: currentValue >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					// TODO evtl. use this
					// const relativeBarArea_x1 =
					// 	currentValue >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth;
					// const relativeBarArea = {
					// 	y1: 0,
					// 	y2: barArea.height,
					// 	x1: relativeBarArea_x1,
					// 	x2: relativeBarArea_x1 + currentBarWidth,
					// 	height: barArea.height,
					// 	width: currentBarWidth,
					// };

					// the value label margins
					const positiveValueLabelMarginLeft =
						-1 * (barArea.width - (relativeBarPositions.x + currentBarWidth));

					const negativeValueLabelMarginLeft = relativeBarPositions.x;

					const isPositiveBar = currentValue >= 0;

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

							<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
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

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{/* // TODO
										// label={itemTo.label} // althogh not often used...
										// statusFrom={itemTo.status || "default"}
										// statusTo={itemTo.status || "default"}
										// upperValue={currentUpperValue}
										// lowerValue={currentLowerValue} */}

									{currentValue > 0 && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={currentBarColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : currentValue < 0 && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={currentBarColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							{/* the negative value label */}
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									fill={theme.global.backgroundColor}
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

							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									fill={theme.global.backgroundColor}
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

			{/* the plot area */}
			<HtmlArea area={plotArea}>
				<svg width={plotArea.width} height={plotArea.height}>
					<line
						x1={zeroLine_x1}
						x2={zeroLine_x2}
						y1={zeroLine_y1}
						y2={zeroLine_y2}
						stroke={zeroLine_color}
						strokeWidth={baseline * 0.2} // TODO from some ibcs setting
						// opacity={opacity}
					/>
				</svg>
			</HtmlArea>
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
}) => {
	const {theme, baseline} = usePage();
	const {fps} = useVideoConfig();

	// TODO evtl. have it called relativeFrame
	const {frame, durationInFrames, frameRange} = listTransitionContext;

	const {visibleItems} = listTransitionContext.to;

	const keyframes = getBarChartEnterKeyframes({
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

	const GRID_RAILS_COLOR = 'magenta';

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

				///
				const fullBarWidth = Math.abs(xScale(dataItem.value) - zeroLine_x1);

				const interpolateCurrentBarWidth = getKeyFramesInterpolator(
					keyframes,
					[`BAR_ENTER_START__${dataItem.id}`, `BAR_ENTER_END__${dataItem.id}`],
					[0, fullBarWidth],
					[Easing.ease]
				);

				const currentBarWidth = interpolateCurrentBarWidth(frame);
				///

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

				const isPositiveBar = dataItem.value >= 0;

				const barColor = dataItem.color;

				return (
					<>
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
								<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
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

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{isPositiveBar && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : !isPositiveBar && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											fill={barColor}
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							<Sequence from={keyframe_valueLabel_appear.frame}>
								{/* the negative value label */}
								{isPositiveBar ? null : (
									<HtmlArea
										area={negativeValueLabelArea}
										fill={theme.global.backgroundColor}
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
								{isPositiveBar ? (
									<HtmlArea
										area={valueLabelArea}
										fill={theme.global.backgroundColor}
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
					</>
				);
			})}

			{/* the zero line */}
			{(() => {
				const zeroLine_x2 = zeroLine_x1;
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

				const zeroLine_color = 'cyan';

				const zeroLine_y1 = interpolateZeroLine__y1(frame);
				const zeroLine_y2 = interpolateZeroLine__y2(frame);

				return (
					<HtmlArea area={plotArea}>
						<svg width={plotArea.width} height={plotArea.height}>
							<line
								x1={zeroLine_x1}
								x2={zeroLine_x2}
								y1={zeroLine_y1}
								y2={zeroLine_y2}
								stroke={zeroLine_color}
								strokeWidth={baseline * 0.2} // TODO from some ibcs setting
								// opacity={opacity}
							/>
						</svg>
					</HtmlArea>
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
}) => {
	const {theme, baseline} = usePage();

	const {fps} = useVideoConfig();

	const {frame, durationInFrames, frameRange} = listTransitionContext;

	const {visibleItems} = listTransitionContext.from;

	const keyframes = getBarChartExitKeyframes({
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

	const GRID_RAILS_COLOR = 'magenta';

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

				const fullBarWidth = Math.abs(xScale(dataItem.value) - zeroLine_x1);

				const interpolateCurrentBarWidth = getKeyFramesInterpolator(
					keyframes,
					[`BAR_EXIT_START__${dataItem.id}`, `BAR_EXIT_END__${dataItem.id}`],
					[fullBarWidth, 0],
					[Easing.ease]
				);

				const currentBarWidth = interpolateCurrentBarWidth(frame);

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

				const isPositiveBar = dataItem.value >= 0;

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
						<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
							<LabelComponent
								animateExit
								animateEnter={false}
								id={dataItem.id}
								baseline={baseline}
								theme={theme}
								label={dataItem.label}
							/>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{isPositiveBar && barArea.width ? (
									<RoundedRightRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										fill={barColor}
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : !isPositiveBar && barArea.width ? (
									<RoundedLeftRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										fill={barColor}
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						{/* the negative value label */}
						<Sequence
							durationInFrames={keyframe_valueLabel_disappear.frame}
							layout="none"
						>
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									fill={theme.global.backgroundColor}
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
							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									fill={theme.global.backgroundColor}
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
				const zeroLine_x2 = zeroLine_x1;
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

				const zeroLine_color = 'cyan';

				const zeroLine_y1 = interpolateZeroLine__y1(frame);
				const zeroLine_y2 = interpolateZeroLine__y2(frame);

				return (
					<HtmlArea area={plotArea}>
						<svg width={plotArea.width} height={plotArea.height}>
							<line
								x1={zeroLine_x1}
								x2={zeroLine_x2}
								y1={zeroLine_y1}
								y2={zeroLine_y2}
								stroke={zeroLine_color}
								strokeWidth={baseline * 0.2} // TODO from some ibcs setting
								// opacity={opacity}
							/>
						</svg>
					</HtmlArea>
				);
			})()}
		</Sequence>
	);
};
