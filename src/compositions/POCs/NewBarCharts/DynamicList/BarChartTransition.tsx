import React from 'react';
import {interpolate} from 'remotion';

import {usePage} from '../../../../acetti-components/PageContext';
import {
	// TDynamicListTransitionContext,
	ListTransitionContext_Update,
	useEnterAreas,
	useExitAreas,
	useUpdateAreas,
	useAppearAreas,
	useDisappearAreas,
} from './useListTransition/useListTransition';
import {HtmlArea, DisplayGridRails} from '../../../../acetti-layout';
import {TBarChartTransitionContext} from './useBarChartTransition';
import {
	TBarChartLabelComponent,
	TBarChartValueLabelComponent,
	RoundedLeftRect,
	RoundedRightRect,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TBarChartItem} from './useBarChartTransition';

export const BarChartTransitionUpdate: React.FC<{
	listTransitionContext: ListTransitionContext_Update<TBarChartItem>;
	barChartTransitionContext: TBarChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
}> = ({
	listTransitionContext,
	barChartTransitionContext,
	LabelComponent,
	ValueLabelComponent,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = listTransitionContext;

	const {xScale} = barChartTransitionContext;

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = useEnterAreas(listTransitionContext);
	const exitAreas = useExitAreas(listTransitionContext);

	const appearAreas = useAppearAreas(listTransitionContext);
	const disappearAreas = useDisappearAreas(listTransitionContext);
	const updateAreas = useUpdateAreas(listTransitionContext);

	const {barArea, labelArea, valueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const DISPLAY_GRID_RAILS = false;
	const GRID_RAILS_COLOR = 'magenta';

	return (
		<div>
			{[...enterAreas].map((enterArea) => {
				const {opacity, item} = enterArea;
				// const color = getPredefinedColor(id);

				const barWidth = xScale(item.value);

				return (
					// <HtmlArea area={currentArea.area} fill={color} opacity={opacity}>
					<HtmlArea
						area={enterArea.area}
						// fill={color}
						opacity={opacity}
					>
						{DISPLAY_GRID_RAILS ? (
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
						{DISPLAY_GRID_RAILS ? (
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
							{DISPLAY_GRID_RAILS ? (
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
