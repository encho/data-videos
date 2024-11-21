import React from 'react';
import invariant from 'tiny-invariant';
import {interpolate} from 'remotion';

import {
	RoundedRightRect,
	RoundedLeftRect,
	TBarChartLabelComponent,
	TBarChartValueLabelComponent,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
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

export const BarsTransitionUpdate: React.FC<TBarsTransitionUpdateProps> = ({
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = listTransitionContext;

	const {xScale} = barChartTransitionContext;
	const {barArea, labelArea, valueLabelArea} =
		barChartTransitionContext.barChartItemLayout;

	const DISPLAY_GRID_RAILS = true;
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

export const BarsTransitionEnter: React.FC<TBarsTransitionEnterProps> = ({
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	// TODO remove this console.log
	console.log({LabelComponent, ValueLabelComponent, barChartTransitionContext});

	const {theme, baseline} = usePage();

	const visibleItemIds = listTransitionContext.to.visibleItems.map(
		(it) => it.id
	);

	const areasData = visibleItemIds.map((id) => {
		const areaFrom = listTransitionContext.to.getListItemArea(id);
		const currentOpacity = interpolate(
			listTransitionContext.easingPercentage,
			[0, 1],
			[0, 1]
		);
		const item = listTransitionContext.to.items.find((it) => it.id === id);
		invariant(item);
		return {id, area: areaFrom, item, opacity: currentOpacity};
	});

	return (
		<div>
			{areasData.map((area) => {
				const {opacity, id} = area;
				const color = getPredefinedColor(id);

				return (
					<HtmlArea area={area.area} fill={color} opacity={opacity}>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id} (ENTER)
						</TypographyStyle>
					</HtmlArea>
				);
			})}
		</div>
	);
};

export const BarsTransitionExit: React.FC<TBarsTransitionExitProps> = ({
	listTransitionContext,
	LabelComponent,
	ValueLabelComponent,
	barChartTransitionContext,
}) => {
	// TODO remove this console.log
	console.log({LabelComponent, ValueLabelComponent, barChartTransitionContext});

	const {theme, baseline} = usePage();

	const visibleItemIds = listTransitionContext.from.visibleItems.map(
		(it) => it.id
	);

	const areasData = visibleItemIds.map((id) => {
		const areaFrom = listTransitionContext.from.getListItemArea(id);
		const currentOpacity = interpolate(
			listTransitionContext.easingPercentage,
			[0, 1],
			[1, 0]
		);
		const item = listTransitionContext.from.items.find((it) => it.id === id);
		invariant(item);
		return {id, area: areaFrom, item, opacity: currentOpacity};
	});

	return (
		<div>
			{areasData.map((area) => {
				const {opacity, id} = area;
				const color = getPredefinedColor(id);

				return (
					<HtmlArea area={area.area} fill={color} opacity={opacity}>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id} (EXIT)
						</TypographyStyle>
					</HtmlArea>
				);
			})}
		</div>
	);
};

const idColorMap: {[key: string]: string} = {
	'Id-001': '#007bff', // Neon Blue
	'Id-002': '#ff4500', // Neon Orange
	'Id-003': '#39ff14', // Neon Green
	'Id-004': '#ff073a', // Neon Red
	'Id-005': '#9d00ff', // Neon Purple
	'Id-006': '#a0522d', // Neon Brown (Slightly brighter)
	'Id-007': '#ff00ff', // Neon Pink
	'Id-008': '#8c8c8c', // Neon Gray
	'Id-009': '#d4ff00', // Neon Yellow-Green
	'Id-010': '#00ffff', // Neon Teal
	'Id-011': '#5b9bff', // Neon Light Blue
	'Id-012': '#ff8300', // Neon Light Orange
	'Id-013': '#aaff66', // Neon Light Green
	'Id-014': '#ff5e5e', // Neon Light Red
	'Id-015': '#bf80ff', // Neon Light Purple
	'Id-016': '#e5b98e', // Neon Light Brown
	'Id-017': '#ff85c2', // Neon Light Pink
	'Id-018': '#d3d3d3', // Neon Light Gray
	'Id-019': '#eaff00', // Neon Light Yellow-Green
	'Id-020': '#6effff', // Neon Light Teal
};

/**
 * Returns a unique, predefined color for the given Id.
 * @param id - The string Id (e.g., "Id-001", "Id-002").
 * @returns The hex color as a string.
 */
function getPredefinedColor(id: string): string {
	return idColorMap[id] || 'magenta'; // Default to black if ID is not found
}
