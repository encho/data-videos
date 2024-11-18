import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

import {TDynamicListLayout} from './useDynamicListLayout';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {useDynamicListLayout} from './useDynamicListLayout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';

export const dynamicListCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const DynamicListComposition: React.FC<
	z.infer<typeof dynamicListCompositionSchema>
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

	const matrixLayout = useMatrixLayout({
		width: contentWidth,
		height: contentHeight - 120,
		nrColumns: 3,
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

	const visibleIndicesFrom = [2, 4] as [number, number];
	const visibleIndicesTo = [0, 1] as [number, number];

	const context = useDynamicListTransition({
		itemsFrom,
		itemsTo,
		visibleIndicesFrom,
		visibleIndicesTo,
		width: area_1.width,
		height: area_1.height,
	});

	return (
		<Page>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				marginBottom={2}
			>
				Dynamic List Demo
			</TypographyStyle>

			<div style={{position: 'relative'}}>
				<DisplayGridRails
					{...context.layoutFrom.gridLayout}
					stroke="rgba(255,0,255,1)"
				/>
				{/* visibleArea */}
				<div
					style={{
						position: 'absolute',
						top: context.visibleIndicesRangeFrom[0],
						left: 0,
						width: area_1.width,
						height: context.visibleIndicesRangeSizeFrom,
						backgroundColor: 'rgba(0,255,0,0.4)',
					}}
				/>
				<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
					{itemsFrom.map((it) => {
						const area = context.layoutFrom.getListItemArea(it.id);
						const idColor = getPredefinedColor(it.id);

						const isVisible = isIdInItems(it.id, context.visibleItemsFrom);

						return (
							<HtmlArea area={area} fill={isVisible ? idColor : 'gray'}>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.body}
									baseline={baseline}
								>
									{it.id}
								</TypographyStyle>
							</HtmlArea>
						);
					})}
				</HtmlArea>

				<HtmlArea area={area_2} fill="rgba(255,0,255,0.15)">
					<DisplayGridRails
						{...context.layoutTo.gridLayout}
						stroke="rgba(255,0,255,1)"
					/>
					{/* visibleArea */}
					<div
						style={{
							position: 'absolute',
							top: context.visibleIndicesRangeTo[0],
							left: 0,
							width: area_2.width,
							height: context.visibleIndicesRangeSizeTo,
							backgroundColor: 'rgba(0,255,0,0.4)',
						}}
					/>
					{itemsTo.map((it) => {
						const area = context.layoutTo.getListItemArea(it.id);
						const idColor = getPredefinedColor(it.id);

						const isVisible = isIdInItems(it.id, context.visibleItemsTo);

						return (
							<HtmlArea area={area} fill={isVisible ? idColor : 'gray'}>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.body}
									baseline={baseline}
								>
									{it.id}
								</TypographyStyle>
							</HtmlArea>
						);
					})}
				</HtmlArea>

				<HtmlArea area={area_3} fill="rgba(255,0,255,0.15)">
					<></>
				</HtmlArea>
			</div>
		</Page>
	);
};

const itemsFrom = [
	{id: 'Id-001'},
	{id: 'Id-002'},
	{id: 'Id-003'},
	{id: 'Id-004'},
	{id: 'Id-005'},
	{id: 'Id-006'},
	{id: 'Id-007'},
	{id: 'Id-010'},
];

const itemsTo = [
	{id: 'Id-009'},
	{id: 'Id-007'},
	{id: 'Id-003'},
	{id: 'Id-002'},
	{id: 'Id-005'},
	{id: 'Id-001'},
];

type Item = {id: string};

type TDynamicListAnimationContext = {
	layoutFrom: TDynamicListLayout;
	layoutTo: TDynamicListLayout;
	itemsFrom: Item[];
	itemsTo: Item[];
	visibleItemsTo: Item[];
	visibleItemsFrom: Item[];
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	visibleIndicesRangeFrom: [number, number];
	visibleIndicesRangeTo: [number, number];
	visibleIndicesRangeSizeFrom: number;
	visibleIndicesRangeSizeTo: number;
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
function useDynamicListTransition({
	itemsFrom,
	itemsTo,
	visibleIndicesFrom,
	visibleIndicesTo,
	width,
	height,
}: {
	itemsFrom: Item[];
	itemsTo: Item[];
	width: number;
	height: number;
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
}): TDynamicListAnimationContext {
	const visibleItemsFrom = getVisibleItems(itemsFrom, visibleIndicesFrom);
	const visibleItemsTo = getVisibleItems(itemsTo, visibleIndicesTo);

	const layoutFrom = useDynamicListLayout({
		width,
		height,
		items: itemsFrom,
		// visibleIndices: visibleIndicesFrom,
	});
	const layoutTo = useDynamicListLayout({
		width,
		height,
		items: itemsTo,
		// visibleIndices: visibleIndicesTo,
	});

	const visibleIndicesRangeFrom =
		layoutFrom.getVisibleIndicesRange(visibleIndicesFrom);

	const visibleIndicesRangeTo =
		layoutFrom.getVisibleIndicesRange(visibleIndicesTo);

	return {
		layoutFrom,
		layoutTo,
		itemsFrom,
		itemsTo,
		visibleItemsFrom,
		visibleItemsTo,
		visibleIndicesFrom,
		visibleIndicesTo,
		visibleIndicesRangeFrom,
		visibleIndicesRangeSizeFrom:
			visibleIndicesRangeFrom[1] - visibleIndicesRangeFrom[0],
		visibleIndicesRangeTo,
		visibleIndicesRangeSizeTo:
			visibleIndicesRangeTo[1] - visibleIndicesRangeTo[0],
	};
}

// /**
//  * Returns a subset of items based on the given range.
//  * @param items - Array of items.
//  * @param range - A tuple [start, end] representing the inclusive start and exclusive end of the range.
//  * @returns A subarray of items within the specified range.
//  */
// function getItemsInRange(items: Item[], range: [number, number]): Item[] {
// 	const [start, end] = range;

// 	// const sliceEnd = end - 1;

// 	// Validate that start and end are integers
// 	if (!Number.isInteger(start) || !Number.isInteger(end)) {
// 		throw new Error('Range values must be integers.');
// 	}

// 	// Ensure range is valid and within bounds
// 	if (start < 0 || end > items.length || start >= end) {
// 		throw new Error('Invalid range provided.');
// 	}

// 	return items.slice(start, end);
// }

/**
 * Returns a subset of items based on the visibleIndices range.
 * @param items - Array of Item objects.
 * @param visibleIndices - A tuple [start, end] representing the inclusive start and exclusive end indices.
 * @returns A subarray of items within the specified visible range.
 */
function getVisibleItems(
	items: Item[],
	visibleIndices: [number, number]
): Item[] {
	const [start, end] = visibleIndices;

	// Validate indices: must be integers and within the array bounds
	if (!Number.isInteger(start) || !Number.isInteger(end)) {
		throw new Error('Indices must be integers.');
	}

	if (start < 0 || end > items.length || start >= end) {
		throw new Error(
			'Invalid indices: ensure 0 <= start < end <= items.length.'
		);
	}

	// Return the subarray based on visible indices
	return items.slice(start, end);
}
// // Example usage
// const items: Item[] = [
//   { id: "001" },
//   { id: "002" },
//   { id: "003" },
//   { id: "004" },
//   { id: "005" }
// ];
// console.log(getVisibleItems(items, [0, 1])); // [{ id: "001" }]
// console.log(getVisibleItems(items, [1, 3])); // [{ id: "002" }, { id: "003" }]
// console.log(getVisibleItems(items, [3, 5])); // [{ id: "004" }, { id: "005" }]

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
	'Id-001': '#1f77b4', // Blue
	'Id-002': '#ff7f0e', // Orange
	'Id-003': '#2ca02c', // Green
	'Id-004': '#d62728', // Red
	'Id-005': '#9467bd', // Purple
	'Id-006': '#8c564b', // Brown
	'Id-007': '#e377c2', // Pink
	'Id-008': '#7f7f7f', // Gray
	'Id-009': '#bcbd22', // Yellow-Green
	'Id-010': '#17becf', // Teal
	'Id-011': '#aec7e8', // Light Blue
	'Id-012': '#ffbb78', // Light Orange
	'Id-013': '#98df8a', // Light Green
	'Id-014': '#ff9896', // Light Red
	'Id-015': '#c5b0d5', // Light Purple
	'Id-016': '#c49c94', // Light Brown
	'Id-017': '#f7b6d2', // Light Pink
	'Id-018': '#c7c7c7', // Light Gray
	'Id-019': '#dbdb8d', // Light Yellow-Green
	'Id-020': '#9edae5', // Light Teal
};

/**
 * Returns a unique, predefined color for the given Id.
 * @param id - The string Id (e.g., "Id-001", "Id-002").
 * @returns The hex color as a string.
 */
function getPredefinedColor(id: string): string {
	return idColorMap[id] || 'magenta'; // Default to black if ID is not found
}

export default getPredefinedColor;
