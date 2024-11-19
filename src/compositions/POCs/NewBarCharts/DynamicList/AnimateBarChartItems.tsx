import React from 'react';
import {interpolate} from 'remotion';

import {usePage} from '../../../../acetti-components/PageContext';
import {
	TDynamicListTransitionContext,
	useEnterAreas,
	useExitAreas,
	useUpdateAreas,
	useAppearAreas,
	useDisappearAreas,
} from './useDynamicListTransition';
import {HtmlArea, DisplayGridRails} from '../../../../acetti-layout';
import {TDynamicBarChartTransitionContext} from './useDynamicBarChartTransition';
import {
	TBarChartLabelComponent,
	TBarChartValueLabelComponent,
	RoundedLeftRect,
	RoundedRightRect,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TBarChartItem} from './useDynamicBarChartTransition';

export const AnimateBarChartItems: React.FC<{
	context: TDynamicListTransitionContext<TBarChartItem>;
	barChartTransitionContext: TDynamicBarChartTransitionContext;
	LabelComponent: TBarChartLabelComponent;
	ValueLabelComponent: TBarChartValueLabelComponent;
}> = ({
	context,
	barChartTransitionContext,
	LabelComponent,
	ValueLabelComponent,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = context;

	const {xScale} = barChartTransitionContext;

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = useEnterAreas(context);
	const exitAreas = useExitAreas(context);

	const appearAreas = useAppearAreas(context);
	const disappearAreas = useDisappearAreas(context);
	const updateAreas = useUpdateAreas(context);

	const {barArea, labelArea, valueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const DISPLAY_GRID_RAILS = true;
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
								{item.label}
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
								{item.label}
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
									{itemTo.label}
								</ValueLabelComponent>
							</HtmlArea>
						</HtmlArea>
					);
				}
			)}
		</div>
	);
};
