import React from 'react';
import invariant from 'tiny-invariant';
import {interpolate} from 'remotion';

import {
	RoundedRightRect,
	RoundedLeftRect,
	TBarChartLabelComponent,
	TBarChartValueLabelComponent,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
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

	return (
		<div>
			{[...enterAreas].map((enterArea) => {
				const {opacity, item} = enterArea;

				const barWidth = xScale(item.value);

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
						<HtmlArea area={negativeValueLabelArea} fill="magenta">
							<></>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{item.value > 0 && barArea.width ? (
									<RoundedRightRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : item.value < 0 && barArea.width ? (
									<RoundedLeftRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>
						<HtmlArea area={valueLabelArea} fill={theme.global.backgroundColor}>
							<ValueLabelComponent
								id={item.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
								value={item.value}
							>
								{item.valueLabel}
							</ValueLabelComponent>
						</HtmlArea>
					</HtmlArea>
				);
			})}
			{[...exitAreas].map((enterArea) => {
				const {opacity, item} = enterArea;
				// const color = getPredefinedColor(id);

				const barWidth = xScale(item.value);

				return (
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
						<HtmlArea area={negativeValueLabelArea} fill="magenta">
							<></>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{item.value > 0 && barArea.width ? (
									<RoundedRightRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : item.value < 0 && barArea.width ? (
									<RoundedLeftRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						<HtmlArea area={valueLabelArea} fill={theme.global.backgroundColor}>
							<ValueLabelComponent
								id={item.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
								value={item.value}
							>
								{item.valueLabel}
							</ValueLabelComponent>
						</HtmlArea>
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

					const barWidth = xScale(currentValue);

					return (
						<HtmlArea
							area={currentArea.area}
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
							<HtmlArea area={negativeValueLabelArea} fill="magenta">
								<></>
							</HtmlArea>

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<svg width={barArea.width} height={barArea.height}>
									{currentValue > 0 && barArea.width ? (
										<RoundedRightRect
											y={0}
											x={0}
											height={barArea.height}
											width={barWidth}
											// fill={it.barColor || 'magenta'}
											fill="white"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : currentValue < 0 && barArea.width ? (
										<RoundedLeftRect
											y={0}
											x={0}
											height={barArea.height}
											width={barWidth}
											// fill={it.barColor || 'magenta'}
											fill="white"
											// TODO: get radius from baseline?
											radius={5}
										/>
									) : null}
								</svg>
							</HtmlArea>

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
									value={itemTo.value}
								>
									{itemTo.valueLabel}
								</ValueLabelComponent>
							</HtmlArea>
						</HtmlArea>
					);
				}
			)}
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

	return (
		<div>
			{rowsInfo.map(({dataItem, area}) => {
				const currentValue = interpolate(
					frame,
					[0, durationInFrames - 1],
					[0, dataItem.value],
					{}
				);

				const barWidth = xScale(currentValue);

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
								id={dataItem.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
							>
								{dataItem.label}
							</LabelComponent>
						</HtmlArea>

						{/* the negative value label */}
						<HtmlArea area={negativeValueLabelArea} fill="magenta">
							<></>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{currentValue > 0 && barArea.width ? (
									<RoundedRightRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : currentValue < 0 && barArea.width ? (
									<RoundedLeftRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						{/* the value label */}
						<HtmlArea area={valueLabelArea} fill={theme.global.backgroundColor}>
							<ValueLabelComponent
								id={dataItem.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
								value={dataItem.value}
							>
								{dataItem.valueLabel}
							</ValueLabelComponent>
						</HtmlArea>
					</HtmlArea>
				);
			})}
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

	return (
		<div>
			{rowsInfo.map(({dataItem, area}) => {
				const currentValue = interpolate(
					frame,
					[0, durationInFrames - 1],
					[dataItem.value, 0],
					{}
				);

				const barWidth = xScale(currentValue);

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
								id={dataItem.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
							>
								{dataItem.label}
							</LabelComponent>
						</HtmlArea>

						{/* the negative value label */}
						<HtmlArea area={negativeValueLabelArea} fill="magenta">
							<></>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<svg width={barArea.width} height={barArea.height}>
								{currentValue > 0 && barArea.width ? (
									<RoundedRightRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : currentValue < 0 && barArea.width ? (
									<RoundedLeftRect
										y={0}
										x={0}
										height={barArea.height}
										width={barWidth}
										// fill={it.barColor || 'magenta'}
										fill="white"
										// TODO: get radius from baseline?
										radius={5}
									/>
								) : null}
							</svg>
						</HtmlArea>

						{/* the value label */}
						<HtmlArea area={valueLabelArea} fill={theme.global.backgroundColor}>
							<ValueLabelComponent
								id={dataItem.id}
								animateExit={false}
								animateEnter={false}
								baseline={baseline}
								theme={theme}
								value={dataItem.value}
							>
								{dataItem.valueLabel}
							</ValueLabelComponent>
						</HtmlArea>
					</HtmlArea>
				);
			})}
		</div>
	);
};
