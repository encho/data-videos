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
import {HtmlArea} from '../../../../acetti-layout';

export const AnimateAreas: React.FC<{
	context: TDynamicListTransitionContext;
}> = ({context}) => {
	const {theme, baseline} = usePage();

	// store in namespace useListTransition (useListTransitionEnterAreas, ....)
	const enterAreas = useEnterAreas(context);
	const exitAreas = useExitAreas(context);

	const appearAreas = useAppearAreas(context);
	const disappearAreas = useDisappearAreas(context);
	const updateAreas = useUpdateAreas(context);

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
							{id}
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