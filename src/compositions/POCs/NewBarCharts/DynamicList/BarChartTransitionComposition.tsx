import {z} from 'zod';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {useDynamicListTransition} from './useDynamicListTransition';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {AnimateAreas} from './AnimateAreas';
import {useDynamicBarChartTransition} from './useDynamicBarChartTransition';

export const barChartTransitionCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartTransitionComposition: React.FC<
	z.infer<typeof barChartTransitionCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	return (
		<PageContext
			margin={50}
			nrBaselines={50}
			width={width}
			height={height}
			theme={theme}
		>
			<DynamicListPage />
		</PageContext>
	);
};

export const DynamicListPage: React.FC = () => {
	const {theme, baseline, contentWidth, contentHeight} = usePage();
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const matrixLayout = useMatrixLayout({
		width: contentWidth,
		height: contentHeight - 120,
		nrColumns: 4,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
	});
	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});
	const area_2 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});
	const area_3 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 2,
	});
	const area_4 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 3,
	});

	const visibleIndicesFrom = [0, 8] as [number, number];
	const visibleIndicesTo = [0, 4] as [number, number];

	const context = useDynamicListTransition({
		frame,
		durationInFrames,
		itemsFrom,
		itemsTo,
		visibleIndicesFrom,
		visibleIndicesTo,
		width: area_1.width,
		height: area_1.height,
		justifyContent: 'start',
	});

	const barChartTransitionContext = useDynamicBarChartTransition({context});

	return (
		<Page>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				marginBottom={2}
			>
				Bar Chart Transition
			</TypographyStyle>

			<div style={{position: 'relative'}}>
				<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
					<AnimateAreas context={context} />
				</HtmlArea>

				<HtmlArea area={area_2} fill="rgba(255,0,255,0.15)">
					<AnimateAreas context={context} />
				</HtmlArea>

				<HtmlArea area={area_3} fill="rgba(255,0,255,0.15)">
					<AnimateAreas context={context} />
				</HtmlArea>

				<HtmlArea area={area_4} fill="rgba(255,0,255,0.15)">
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.body}
						baseline={baseline}
					>
						{JSON.stringify(barChartTransitionContext, undefined, 2)}
					</TypographyStyle>
				</HtmlArea>
			</div>
		</Page>
	);
};

const itemsFrom = [
	{id: 'Id-001', label: 'Item 001', valueLabel: '$10.00', value: 10},
	{id: 'Id-002', label: 'Item 002', valueLabel: '$20.50', value: 20.5},
	{id: 'Id-003', label: 'Item 003', valueLabel: '$30.75', value: 30.75},
	{id: 'Id-004', label: 'Item 004', valueLabel: '$40.25', value: 40.25},
	{id: 'Id-011', label: 'Item 011', valueLabel: '$55.10', value: 55.1},
	{id: 'Id-005', label: 'Item 005', valueLabel: '$25.30', value: 25.3},
	{id: 'Id-006', label: 'Item 006', valueLabel: '$60.60', value: 60.6},
	{id: 'Id-007', label: 'Item 007', valueLabel: '$35.80', value: 35.8},
	{id: 'Id-010', label: 'Item 010', valueLabel: '$45.90', value: 45.9},
];

const itemsTo = [
	{id: 'Id-009', label: 'Item 009', valueLabel: '$70.00', value: 70},
	{id: 'Id-003', label: 'Item 003', valueLabel: '$30.75', value: 30.75},
	{id: 'Id-007', label: 'Item 007', valueLabel: '$35.80', value: 35.8},
	{id: 'Id-002', label: 'Item 002', valueLabel: '$20.50', value: 20.5},
	{id: 'Id-005', label: 'Item 005', valueLabel: '$25.30', value: 25.3},
	{id: 'Id-001', label: 'Item 001', valueLabel: '$10.00', value: 10},
];

// const itemsFrom = [
// 	{id: 'Id-001'},
// 	{id: 'Id-002'},
// 	{id: 'Id-003'},
// 	{id: 'Id-004'},
// 	{id: 'Id-011'},
// 	{id: 'Id-005'},
// 	{id: 'Id-006'},
// 	{id: 'Id-007'},
// 	{id: 'Id-010'},
// ];

// const itemsTo = [
// 	{id: 'Id-009'},
// 	{id: 'Id-003'},
// 	{id: 'Id-007'},
// 	{id: 'Id-002'},
// 	{id: 'Id-005'},
// 	{id: 'Id-001'},
// ];

type Item = {id: string};

/**
 * Checks if a given string is an `id` in the provided array of items.
 * @param items - Array of Item objects.
 * @param id - The string to check.
 * @returns `true` if the string is found as an `id` in the items, otherwise `false`.
 */
function isIdInItems(id: string, items: Item[]): boolean {
	return items.some((item) => item.id === id);
}
// // Example usage
// const items: Item[] = [
//   { id: "001" },
//   { id: "002" },
//   { id: "003" },
//   { id: "004" },
//   { id: "005" }
// ];
// console.log(isIdInItems("003",items)); // true
// console.log(isIdInItems("007",items)); // false

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
