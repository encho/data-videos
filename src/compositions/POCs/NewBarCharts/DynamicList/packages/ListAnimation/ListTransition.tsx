import React from 'react';
import invariant from 'tiny-invariant';
import {interpolate} from 'remotion';

import {TypographyStyle} from '../../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {usePage} from '../../../../../../acetti-components/PageContext';
import {
	ListTransitionContext_Update,
	ListTransitionContext_Enter,
	ListTransitionContext_Exit,
	getListItems_Enter,
	getListItems_Exit,
	getListItems_Update,
	getListItems_Appear,
	getListItems_Disappear,
} from './useListTransition/useListTransition';
import {HtmlArea} from '../../../../../../acetti-layout';

export const ListTransitionUpdate: React.FC<{
	context: ListTransitionContext_Update<{id: string}>;
}> = ({context}) => {
	const {theme, baseline} = usePage();

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = getListItems_Enter(context);
	const exitAreas = getListItems_Exit(context);
	const appearAreas = getListItems_Appear(context);
	const disappearAreas = getListItems_Disappear(context);
	const updateAreas = getListItems_Update(context);

	return (
		<div>
			{[
				...enterAreas,
				...exitAreas,
				...appearAreas,
				...disappearAreas,
				...updateAreas,
			].map((enterArea) => {
				const {opacity, id} = enterArea;
				const color = getPredefinedColor(id);

				return (
					<HtmlArea area={enterArea.area} fill={color} opacity={opacity}>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id} (UPDATE)
						</TypographyStyle>
					</HtmlArea>
				);
			})}
		</div>
	);
};

export const ListTransitionEnter: React.FC<{
	context: ListTransitionContext_Enter<{id: string}>;
}> = ({context}) => {
	const {theme, baseline} = usePage();

	const visibleItemIds = context.to.visibleItems.map((it) => it.id);

	const areasData = visibleItemIds.map((id) => {
		const areaFrom = context.to.getListItemArea(id);
		const currentOpacity = interpolate(
			context.easingPercentage,
			[0, 1],
			[0, 1]
		);
		const item = context.to.items.find((it) => it.id === id);
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

export const ListTransitionExit: React.FC<{
	context: ListTransitionContext_Exit<{id: string}>;
}> = ({context}) => {
	const {theme, baseline} = usePage();

	const visibleItemIds = context.from.visibleItems.map((it) => it.id);

	const areasData = visibleItemIds.map((id) => {
		const areaFrom = context.from.getListItemArea(id);
		const currentOpacity = interpolate(
			context.easingPercentage,
			[0, 1],
			[1, 0]
		);
		const item = context.from.items.find((it) => it.id === id);
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
