import React from 'react';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
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
import {interpolate} from 'remotion';

export const AnimateBarChartItems: React.FC<{
	context: TDynamicListTransitionContext<{
		id: string;
		value: number;
		label: string;
		valueLabel: string;
	}>;
	barChartTransitionContext: TDynamicBarChartTransitionContext;
}> = ({context, barChartTransitionContext}) => {
	const {theme, baseline} = usePage();

	const {frame, durationInFrames} = context;

	const {xScaleFrom, xScaleTo, xScale} = barChartTransitionContext;

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = useEnterAreas(context);
	const exitAreas = useExitAreas(context);

	const appearAreas = useAppearAreas(context);
	const disappearAreas = useDisappearAreas(context);
	const updateAreas = useUpdateAreas(context);

	const {barArea, labelArea} = barChartTransitionContext.barChartItemLayout;

	return (
		<div>
			{[...enterAreas].map((enterArea) => {
				const {opacity, id, item} = enterArea;
				const color = getPredefinedColor(id);

				const barWidth = xScale(item.value);

				return (
					// <HtmlArea area={currentArea.area} fill={color} opacity={opacity}>
					<HtmlArea area={enterArea.area} fill={color} opacity={opacity}>
						<div style={{position: 'absolute'}}>
							<DisplayGridRails
								{...barChartTransitionContext.barChartItemLayout.gridLayout}
								stroke="blue"
							/>
						</div>

						<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.body}
								baseline={baseline}
							>
								{item.label}
							</TypographyStyle>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<div
								style={{
									height: barArea.height,
									backgroundColor: 'cyan',
									width: barWidth,
								}}
							/>
							{/* <TypographyStyle
								typographyStyle={theme.typography.textStyles.body}
								baseline={baseline}
							>
								{item.value}
							</TypographyStyle> */}
						</HtmlArea>
					</HtmlArea>
				);
			})}
			{[...exitAreas].map((enterArea) => {
				const {opacity, id, item} = enterArea;
				const color = getPredefinedColor(id);

				const barWidth = xScale(item.value);

				return (
					// <HtmlArea area={currentArea.area} fill={color} opacity={opacity}>
					<HtmlArea area={enterArea.area} fill={color} opacity={opacity}>
						<div style={{position: 'absolute'}}>
							<DisplayGridRails
								{...barChartTransitionContext.barChartItemLayout.gridLayout}
								stroke="blue"
							/>
						</div>

						<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.body}
								baseline={baseline}
							>
								{item.label}
							</TypographyStyle>
						</HtmlArea>

						<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
							<div
								style={{
									height: barArea.height,
									backgroundColor: 'cyan',
									width: barWidth,
								}}
							/>
							{/* <TypographyStyle
								typographyStyle={theme.typography.textStyles.body}
								baseline={baseline}
							>
								{item.value}
							</TypographyStyle> */}
						</HtmlArea>
					</HtmlArea>
				);
			})}
			{[...appearAreas, ...disappearAreas, ...updateAreas].map(
				(currentArea) => {
					const {opacity, id, itemFrom, itemTo} = currentArea;
					const color = getPredefinedColor(id);

					const currentValue = interpolate(
						frame,
						[0, durationInFrames - 1],
						[itemFrom.value, itemTo.value],
						{}
					);

					const barWidth = xScale(currentValue);

					return (
						<HtmlArea area={currentArea.area} fill={color} opacity={opacity}>
							<div style={{position: 'absolute'}}>
								<DisplayGridRails
									{...barChartTransitionContext.barChartItemLayout.gridLayout}
									stroke="yellow"
								/>
							</div>

							<HtmlArea area={labelArea} fill={theme.global.backgroundColor}>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.body}
									baseline={baseline}
								>
									{itemTo.label}
								</TypographyStyle>
							</HtmlArea>

							<HtmlArea area={barArea} fill={theme.global.backgroundColor}>
								<div
									style={{
										height: barArea.height,
										backgroundColor: 'cyan',
										width: barWidth,
									}}
								/>
								<div style={{position: 'absolute', top: 0}}>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.body}
										baseline={baseline}
									>
										{currentValue}
									</TypographyStyle>
								</div>
							</HtmlArea>
						</HtmlArea>
					);
				}
			)}
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
