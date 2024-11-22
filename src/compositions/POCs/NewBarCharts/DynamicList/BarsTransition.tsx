import React from 'react';
import invariant from 'tiny-invariant';
import {interpolate} from 'remotion';

import {
	RoundedRightRect,
	RoundedLeftRect,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {
	TBarChartValueLabelComponent,
	TBarChartLabelComponent,
} from './LabelComponents';
import {usePage} from '../../../../acetti-components/PageContext';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
	useEnterAreas,
	useExitAreas,
	useUpdateAreas,
	useAppearAreas,
	useDisappearAreas,
} from './useListTransition/useListTransition';
import {TBarChartTransitionContext} from './useBarChartTransition';
import {HtmlArea, DisplayGridRails} from '../../../../acetti-layout';
import {TBarChartItem} from './useBarChartTransition';

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
};

type TBarsTransitionExitProps = TBarsTransitionCommonProps & {
	listTransitionContext: ListTransitionContext_Exit<TBarChartItem>;
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
};

export const BarsTransition: React.FC<TBarsTransitionProps> = ({
	showLayout = false,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
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

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = useEnterAreas(listTransitionContext);
	const exitAreas = useExitAreas(listTransitionContext);
	const appearAreas = useAppearAreas(listTransitionContext);
	const disappearAreas = useDisappearAreas(listTransitionContext);
	const updateAreas = useUpdateAreas(listTransitionContext);

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
				{[...enterAreas].map((enterArea) => {
					const {opacity, item} = enterArea;

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);

					const relativeBarPositions = {
						y: 0,
						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					const isPositiveBar = item.value >= 0;

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[0, item.value],
						{}
					);

					return (
						// <HtmlArea area={currentArea.area} fill={color} opacity={opacity}>
						<HtmlArea
							area={enterArea.area}
							// fill={color}
							opacity={opacity}
						>
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
								>
									{item.label}
								</LabelComponent>
							</HtmlArea>

							{/* the negative value label */}
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									fill={theme.global.backgroundColor}
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

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{item.value > 0 && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											// fill={it.barColor || 'magenta'}
											fill="magenta"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : item.value < 0 && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											// fill={it.barColor || 'magenta'}
											fill="magenta"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									fill={theme.global.backgroundColor}
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
				{[...exitAreas].map((enterArea) => {
					const {opacity, item} = enterArea;

					// see also useAnimatedBarChartLayout line 100 ff.
					const currentBarWidth = Math.abs(xScale(item.value) - zeroLine_x1);

					const relativeBarPositions = {
						y: 0,
						x: item.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
						height: barArea.height,
						width: currentBarWidth,
					};

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[item.value, 0],
						{}
					);

					const isPositiveBar = item.value >= 0;

					return (
						<HtmlArea area={enterArea.area} opacity={opacity}>
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
								>
									{item.label}
								</LabelComponent>
							</HtmlArea>

							{/* the negative value label */}
							{isPositiveBar ? null : (
								<HtmlArea
									area={negativeValueLabelArea}
									fill={theme.global.backgroundColor}
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

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{item.value > 0 && barArea.width ? (
										<RoundedRightRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											// fill={it.barColor || 'magenta'}
											fill="magenta"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : item.value < 0 && barArea.width ? (
										<RoundedLeftRect
											y={relativeBarPositions.y}
											x={relativeBarPositions.x}
											height={relativeBarPositions.height}
											width={relativeBarPositions.width}
											// fill={it.barColor || 'magenta'}
											fill="magenta"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

							{isPositiveBar ? (
								<HtmlArea
									area={valueLabelArea}
									fill={theme.global.backgroundColor}
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
				{[...appearAreas, ...disappearAreas, ...updateAreas].map(
					(currentArea) => {
						const {opacity, itemFrom, itemTo} = currentArea;
						// const color = getPredefinedColor(id);

						const currentValue = interpolate(
							frame,
							[0, durationInFrames - 1],
							[itemFrom.value, itemTo.value],
							{}
						);

						// see also useAnimatedBarChartLayout line 100 ff.
						const currentBarWidth = Math.abs(
							xScale(currentValue) - zeroLine_x1
						);

						const relativeBarPositions = {
							y: 0,
							x:
								currentValue >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
							height: barArea.height,
							width: currentBarWidth,
						};

						const isPositiveBar = currentValue >= 0;

						return (
							<HtmlArea
								area={currentArea.area}
								// fill={color}
								opacity={opacity}
							>
								{showLayout ? (
									<div style={{position: 'absolute'}}>
										<DisplayGridRails
											{...barChartTransitionContext.barChartItemLayout
												.gridLayout}
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
									>
										{itemTo.label}
									</LabelComponent>
								</HtmlArea>

								{/* the negative value label */}
								{isPositiveBar ? null : (
									<HtmlArea
										area={negativeValueLabelArea}
										fill={theme.global.backgroundColor}
									>
										<ValueLabelComponent
											animateEnter
											animateExit={false}
											id={itemTo.id}
											value={currentValue}
											baseline={baseline}
											theme={theme}
										/>
									</HtmlArea>
								)}

								<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
									<svg width={barArea.width} height={barArea.height}>
										{currentValue > 0 && barArea.width ? (
											<RoundedRightRect
												y={relativeBarPositions.y}
												x={relativeBarPositions.x}
												height={relativeBarPositions.height}
												width={relativeBarPositions.width}
												// fill={it.barColor || 'magenta'}
												fill="magenta"
												// TODO: get radius from baseline?
												radius={5}
											/>
										) : currentValue < 0 && barArea.width ? (
											<RoundedLeftRect
												y={relativeBarPositions.y}
												x={relativeBarPositions.x}
												height={relativeBarPositions.height}
												width={relativeBarPositions.width}
												// fill={it.barColor || 'magenta'}
												fill="magenta"
												// TODO: get radius from baseline?
												radius={5}
											/>
										) : null}
									</svg>
								</HtmlArea>

								{isPositiveBar ? (
									<HtmlArea
										area={valueLabelArea}
										fill={theme.global.backgroundColor}
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
					}
				)}
			</div>

			{/* the plot area */}
			<HtmlArea area={plotArea} fill="rgba(255,0,255,0.2)">
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

const BarsTransitionEnter: React.FC<TBarsTransitionEnterProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = listTransitionContext;

	const {visibleItems} = listTransitionContext.to;

	const backgroundColorOpacity = interpolate(
		listTransitionContext.easingPercentage,
		[0, 0.2, 1],
		[0, 1, 0]
	);

	const backgroundColor = `rgba(0,255,0,${backgroundColorOpacity})`;

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
	const zeroLine_x2 = zeroLine_x1;
	const zeroLine_y1 = 0;
	const zeroLine_y2 = plotArea.height;
	const zeroLine_color = 'cyan';

	return (
		<div>
			{rowsInfo.map(({dataItem, area}) => {
				const currentValue = interpolate(
					frame,
					[0, durationInFrames - 1],
					[0, dataItem.value],
					{}
				);

				// see also useAnimatedBarChartLayout line 100 ff.
				const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

				const relativeBarPositions = {
					y: 0,
					x: dataItem.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
					height: barArea.height,
					width: currentBarWidth,
				};

				const isPositiveBar = currentValue >= 0;

				return (
					<HtmlArea key={dataItem.id} area={area} fill={backgroundColor}>
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
								animateEnter
								animateExit={false}
								id={dataItem.id}
								baseline={baseline}
								theme={theme}
							>
								{dataItem.label}
							</LabelComponent>
						</HtmlArea>

						{/* the negative value label */}
						{isPositiveBar ? null : (
							<HtmlArea
								area={negativeValueLabelArea}
								fill={theme.global.backgroundColor}
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

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{currentValue > 0 && barArea.width ? (
									<RoundedRightRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										// fill={it.barColor || 'magenta'}
										fill="magenta"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : currentValue < 0 && barArea.width ? (
									<RoundedLeftRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										// fill={it.barColor || 'magenta'}
										fill="magenta"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						{/* the value label */}
						{isPositiveBar ? (
							<HtmlArea
								area={valueLabelArea}
								fill={theme.global.backgroundColor}
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
					</HtmlArea>
				);
			})}

			{/* the plot area */}
			<HtmlArea area={plotArea} fill="rgba(255,0,255,0.2)">
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

const BarsTransitionExit: React.FC<TBarsTransitionExitProps> = ({
	showLayout,
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = listTransitionContext;

	const {visibleItems} = listTransitionContext.from;

	const backgroundColorOpacity = interpolate(
		listTransitionContext.easingPercentage,
		[0, 0.2, 1],
		[0, 1, 0]
	);

	const backgroundColor = `rgba(255,0,0,${backgroundColorOpacity})`;

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
	const zeroLine_x2 = zeroLine_x1;
	const zeroLine_y1 = 0;
	const zeroLine_y2 = plotArea.height;
	const zeroLine_color = 'cyan';

	return (
		<div>
			{rowsInfo.map(({dataItem, area}) => {
				const currentValue = interpolate(
					frame,
					[0, durationInFrames - 1],
					[dataItem.value, 0],
					{}
				);

				// see also useAnimatedBarChartLayout line 100 ff.
				const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x1);

				const relativeBarPositions = {
					y: 0,
					x: dataItem.value >= 0 ? zeroLine_x1 : zeroLine_x1 - currentBarWidth,
					height: barArea.height,
					width: currentBarWidth,
				};

				const isPositiveBar = currentValue >= 0;

				return (
					<HtmlArea key={dataItem.id} area={area} fill={backgroundColor}>
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
							>
								{dataItem.label}
							</LabelComponent>
						</HtmlArea>

						{/* the negative value label */}
						{isPositiveBar ? null : (
							<HtmlArea
								area={negativeValueLabelArea}
								fill={theme.global.backgroundColor}
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

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{currentValue > 0 && barArea.width ? (
									<RoundedRightRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										// fill={it.barColor || 'magenta'}
										fill="magenta"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : currentValue < 0 && barArea.width ? (
									<RoundedLeftRect
										y={relativeBarPositions.y}
										x={relativeBarPositions.x}
										height={relativeBarPositions.height}
										width={relativeBarPositions.width}
										// fill={it.barColor || 'magenta'}
										fill="magenta"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						{/* the value label */}

						{isPositiveBar ? (
							<HtmlArea
								area={valueLabelArea}
								fill={theme.global.backgroundColor}
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
					</HtmlArea>
				);
			})}
			{/* the plot area */}
			<HtmlArea area={plotArea} fill="rgba(255,0,255,0.2)">
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
