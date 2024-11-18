import {z} from 'zod';
import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

import {TGridLayoutArea} from '../../../../acetti-layout';
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
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

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
				{/* <div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: area_1.width,
						height: area_1.height,
						backgroundColor: 'rgba(0,255,0,0.5)',
					}}
				/> */}
				<DisplayGridRails
					{...context.layoutFrom.gridLayout}
					stroke="rgba(255,0,255,1)"
				/>
				{/* visibleArea */}
				{/* <div
					style={{
						position: 'absolute',
						top: context.visibleIndicesRangeFrom[0],
						left: 0,
						width: area_1.width,
						height: context.visibleIndicesRangeSizeFrom,
						backgroundColor: 'rgba(0,255,0,0.4)',
					}}
				/> */}
				<HtmlArea area={area_1} fill="rgba(255,0,255,0.15)">
					{itemsFrom.map((it) => {
						const area = context.getListItemAreaFrom(it.id);
						const idColor = getPredefinedColor(it.id);

						const isVisible = isIdInItems(it.id, context.visibleItemsFrom);

						return (
							<HtmlArea
								area={area}
								fill={isVisible ? idColor : 'rgba(255,255,255,0.3)'}
							>
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
					{/* <div
						style={{
							position: 'absolute',
							top: context.visibleIndicesRangeTo[0],
							left: 0,
							width: area_2.width,
							height: context.visibleIndicesRangeSizeTo,
							backgroundColor: 'rgba(0,255,0,0.4)',
						}}
					/> */}
					{itemsTo.map((it) => {
						const area = context.getListItemAreaTo(it.id);
						const idColor = getPredefinedColor(it.id);

						const isVisible = isIdInItems(it.id, context.visibleItemsTo);

						return (
							<HtmlArea
								area={area}
								fill={isVisible ? idColor : 'rgba(0,0,0,0.3)'}
							>
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
					<AnimateAreas context={context} />
				</HtmlArea>
			</div>
		</Page>
	);
};

export const AnimateAreas: React.FC<{
	context: TDynamicListAnimationContext;
}> = ({context}) => {
	const {theme, baseline} = usePage();
	const {transitionTypes, frame, durationInFrames} = context;

	return (
		<div>
			{/* the updates */}
			{transitionTypes.update.map((id) => {
				const areaFrom = context.getListItemAreaFrom(id);
				const areaTo = context.getListItemAreaTo(id);

				const idColor = getPredefinedColor(id);

				const current_y1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y1, areaTo.y1],
					{
						// easing: xxx
					}
				);

				const current_y2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y2, areaTo.y2],
					{
						// easing: xxx
					}
				);

				const current_x1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x1, areaTo.x1],
					{
						// easing: xxx
					}
				);

				const current_x2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x2, areaTo.x2],
					{
						// easing: xxx
					}
				);

				const currentArea = {
					y1: current_y1,
					y2: current_y2,
					x1: current_x1,
					x2: current_x2,
					width: current_x2 - current_x1,
					height: current_y2 - current_y1,
				};

				return (
					<HtmlArea area={currentArea} fill={idColor}>
						{/* TODO: here instead */}
						{/* <UpdateComponent areaFrom areaTo currentArea easingPercentage id /> */}
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id}
						</TypographyStyle>
					</HtmlArea>
				);
			})}

			{/* the appears */}
			{transitionTypes.appear.map((id) => {
				const areaFrom = context.getListItemAreaFrom(id);
				const areaTo = context.getListItemAreaTo(id);

				const idColor = getPredefinedColor(id);

				const current_y1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y1, areaTo.y1],
					{
						// easing: xxx
					}
				);

				const current_y2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y2, areaTo.y2],
					{
						// easing: xxx
					}
				);

				const current_x1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x1, areaTo.x1],
					{
						// easing: xxx
					}
				);

				const current_x2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x2, areaTo.x2],
					{
						// easing: xxx
					}
				);

				const currentOpacity = interpolate(
					frame,
					[0, durationInFrames - 1],
					[0, 1],
					{
						// easing: xxx
					}
				);

				const currentArea = {
					y1: current_y1,
					y2: current_y2,
					x1: current_x1,
					x2: current_x2,
					width: current_x2 - current_x1,
					height: current_y2 - current_y1,
				};

				return (
					<HtmlArea area={currentArea} fill={idColor} opacity={currentOpacity}>
						{/* TODO: here instead */}
						{/* <UpdateComponent areaFrom areaTo currentArea easingPercentage id /> */}
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id}
						</TypographyStyle>
					</HtmlArea>
				);
			})}

			{/* the disappears */}
			{transitionTypes.disappear.map((id) => {
				const areaFrom = context.getListItemAreaFrom(id);
				const areaTo = context.getListItemAreaTo(id);

				const idColor = getPredefinedColor(id);

				const current_y1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y1, areaTo.y1],
					{
						// easing: xxx
					}
				);

				const current_y2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.y2, areaTo.y2],
					{
						// easing: xxx
					}
				);

				const current_x1 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x1, areaTo.x1],
					{
						// easing: xxx
					}
				);

				const current_x2 = interpolate(
					frame,
					[0, durationInFrames - 1],
					[areaFrom.x2, areaTo.x2],
					{
						// easing: xxx
					}
				);

				const currentOpacity = interpolate(
					frame,
					[0, durationInFrames - 1],
					[1, 0],
					{
						// easing: xxx
					}
				);

				const currentArea = {
					y1: current_y1,
					y2: current_y2,
					x1: current_x1,
					x2: current_x2,
					width: current_x2 - current_x1,
					height: current_y2 - current_y1,
				};

				return (
					<HtmlArea area={currentArea} fill={idColor} opacity={currentOpacity}>
						{/* TODO: here instead */}
						{/* <UpdateComponent areaFrom areaTo currentArea easingPercentage id /> */}
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id}
						</TypographyStyle>
					</HtmlArea>
				);
			})}

			{/* the exits */}
			{transitionTypes.exit.map((id) => {
				const areaFrom = context.getListItemAreaFrom(id);
				// const areaTo = context.getListItemAreaTo(id);

				const idColor = getPredefinedColor(id);

				const currentOpacity = interpolate(
					frame,
					[0, durationInFrames - 1],
					[1, 0],
					{
						// easing: xxx
					}
				);

				return (
					<HtmlArea area={areaFrom} fill={idColor} opacity={currentOpacity}>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.body}
							baseline={baseline}
						>
							{id}
						</TypographyStyle>
					</HtmlArea>
				);
			})}

			{/* the enters */}
			{transitionTypes.enter.map((id) => {
				const areaTo = context.getListItemAreaTo(id);

				const idColor = getPredefinedColor(id);

				const currentOpacity = interpolate(
					frame,
					[0, durationInFrames - 1],
					[0, 1],
					{
						// easing: xxx
					}
				);

				return (
					<HtmlArea area={areaTo} fill={idColor} opacity={currentOpacity}>
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

const itemsFrom = [
	{id: 'Id-001'},
	{id: 'Id-002'},
	{id: 'Id-003'},
	{id: 'Id-004'},
	{id: 'Id-011'},
	{id: 'Id-005'},
	{id: 'Id-006'},
	{id: 'Id-007'},
	{id: 'Id-010'},
];

const itemsTo = [
	{id: 'Id-009'},
	{id: 'Id-003'},
	{id: 'Id-007'},
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
	getListItemAreaFrom: (i: number | string) => TGridLayoutArea;
	getListItemAreaTo: (i: number | string) => TGridLayoutArea;
	justifyContentShiftFrom: number;
	justifyContentShiftTo: number;
	frame: number;
	durationInFrames: number;
	transitionTypes: {
		update: string[];
		enter: string[];
		exit: string[];
		appear: string[];
		disappear: string[];
	};
	// TODO
	// easing: (x:number) => number
	// baseline
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
	justifyContent = 'center',
	frame,
	durationInFrames,
}: {
	itemsFrom: Item[];
	itemsTo: Item[];
	width: number;
	height: number;
	visibleIndicesFrom: [number, number];
	visibleIndicesTo: [number, number];
	justifyContent?: 'center' | 'start';
	frame: number;
	durationInFrames: number;
	// TODO: baseline, to determine the sizes in the layout!!!!!!!!!!!
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

	const visibleIndicesRangeSizeFrom =
		visibleIndicesRangeFrom[1] - visibleIndicesRangeFrom[0];

	const visibleIndicesRangeTo =
		layoutFrom.getVisibleIndicesRange(visibleIndicesTo);

	const visibleIndicesRangeSizeTo =
		visibleIndicesRangeTo[1] - visibleIndicesRangeTo[0];

	// justify content
	const yStartFrom =
		justifyContent === 'center'
			? (height - visibleIndicesRangeSizeFrom) / 2
			: 0;
	const yStartTo =
		justifyContent === 'center' ? (height - visibleIndicesRangeSizeTo) / 2 : 0;

	const yStartUnadjustedFrom = layoutFrom.getListItemPaddedArea(
		visibleItemsFrom[0].id
	).y1;

	const yStartUnadjustedTo = layoutTo.getListItemPaddedArea(
		visibleItemsTo[0].id
	).y1;

	const justifyContentShiftFrom = yStartFrom - yStartUnadjustedFrom;
	const justifyContentShiftTo = yStartTo - yStartUnadjustedTo;

	const transitionTypes = getTransitionTypes({
		allFrom: itemsFrom.map((it) => it.id),
		allTo: itemsTo.map((it) => it.id),
		visibleFrom: visibleItemsFrom.map((it) => it.id),
		visibleTo: visibleItemsTo.map((it) => it.id),
	});

	return {
		frame,
		durationInFrames,
		transitionTypes,
		layoutFrom,
		layoutTo,
		itemsFrom,
		itemsTo,
		visibleItemsFrom,
		visibleItemsTo,
		visibleIndicesFrom,
		visibleIndicesTo,
		visibleIndicesRangeFrom,
		visibleIndicesRangeSizeFrom,
		visibleIndicesRangeTo,
		visibleIndicesRangeSizeTo,
		getListItemAreaFrom: (x) => {
			const area = layoutFrom.getListItemArea(x);
			const shiftedArea = {
				...area,
				y1: area.y1 + justifyContentShiftFrom,
				y2: area.y2 + justifyContentShiftFrom,
			};
			return shiftedArea;
		},
		getListItemAreaTo: (x) => {
			const area = layoutTo.getListItemArea(x);
			const shiftedArea = {
				...area,
				y1: area.y1 + justifyContentShiftTo,
				y2: area.y2 + justifyContentShiftTo,
			};
			return shiftedArea;
		},
		justifyContentShiftFrom,
		justifyContentShiftTo,
	};
}

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

export function getTransitionTypes({
	allFrom,
	visibleFrom,
	allTo,
	visibleTo,
}: {
	allFrom: string[];
	visibleFrom: string[];
	allTo: string[];
	visibleTo: string[];
}): {
	enter: string[];
	exit: string[];
	update: string[];
	appear: string[];
	disappear: string[];
} {
	const update = getIntersection(visibleFrom, visibleTo);
	const appear = getAppearingIds({visibleFrom, visibleTo, allFrom});
	const disappear = getDisappearingIds({visibleFrom, visibleTo, allTo});
	const exit = getExitingIds({visibleFrom, allTo});
	const enter = getEnteringIds({visibleTo, allFrom});

	return {enter, update, exit, appear, disappear};
}

/**
 * Returns the intersection of two arrays of strings.
 * @param array1 - The first array of strings.
 * @param array2 - The second array of strings.
 * @returns An array containing the intersection of the two input arrays.
 */
function getIntersection(array1: string[], array2: string[]): string[] {
	const set1 = new Set(array1);
	const set2 = new Set(array2);

	return Array.from(set1).filter((item) => set2.has(item));
}
// // Example usage
// const array1 = ["001", "002", "003", "004"];
// const array2 = ["003", "004", "005", "006"];
// console.log(getIntersection(array1, array2)); // ["003", "004"]

/**
 * Returns all strings that are present in both `allFrom` and `visibleTo`, but not in `visibleFrom`.
 * @param data - Object containing `allFrom`, `visibleTo`, and `visibleFrom` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getAppearingIds(data: {
	visibleFrom: string[];
	allFrom: string[];
	visibleTo: string[];
}): string[] {
	const {allFrom, visibleTo, visibleFrom} = data;

	const setAllFrom = new Set(allFrom);
	const setVisibleTo = new Set(visibleTo);
	const setVisibleFrom = new Set(visibleFrom);

	// Find elements present in both allFrom and visibleTo
	const intersection = Array.from(setAllFrom).filter((item) =>
		setVisibleTo.has(item)
	);

	// Exclude elements present in visibleFrom
	return intersection.filter((item) => !setVisibleFrom.has(item));
}

// // Example usage
// const input = {
// 	allFrom: ['001', '002', '003', '004'],
// 	visibleTo: ['003', '004', '005'],
// 	visibleFrom: ['003'],
// 	// visibleTo: ['003', '004', '005'],
// 	// allTo: ['003'],
// };
// console.log(getAppearingIds(input)); // ["004"]

/**
 * Returns all strings that are present in both `visibleFrom` and `allTo`, but not in `visibleTo`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getDisappearingIds(data: {
	visibleFrom: string[];
	visibleTo: string[];
	allTo: string[];
}): string[] {
	const {visibleFrom, visibleTo, allTo} = data;

	const setVisibleFrom = new Set(visibleFrom);
	const setAllTo = new Set(allTo);
	const setVisibleTo = new Set(visibleTo);

	// Find elements present in both visibleFrom and allTo
	const intersection = Array.from(setVisibleFrom).filter((item) =>
		setAllTo.has(item)
	);

	// Exclude elements present in visibleTo
	return intersection.filter((item) => !setVisibleTo.has(item));
}
// // Example usage
// const input = {
// 	allFrom: ['001', '002', '003', '004'],
// 	visibleTo: ['003', '004', '005'],
// 	visibleFrom: ['002', '003'],
// 	allTo: ['002', '003', '005'],
// };
// console.log(getDisappearingIds(input)); // ["002"]

/**
 * Returns all strings that are present in `visibleFrom` but not in `allTo`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getExitingIds(data: {
	visibleFrom: string[];
	allTo: string[];
}): string[] {
	const {visibleFrom, allTo} = data;

	const setVisibleFrom = new Set(visibleFrom);
	const setAllTo = new Set(allTo);

	// Find elements present in visibleFrom but not in allTo
	return Array.from(setVisibleFrom).filter((item) => !setAllTo.has(item));
}
// // Example usage
// const input = {
//   allFrom: ["001", "002", "003", "004"],
//   visibleTo: ["003", "004", "005"],
//   visibleFrom: ["002", "003", "004"],
//   allTo: ["003", "005"]
// };
// console.log(getExitingIds(input)); // ["002", "004"]

/**
 * Returns all strings that are present in `visibleTo` but not in `allFrom`.
 * @param data - Object containing `allFrom`, `visibleTo`, `visibleFrom`, and `allTo` arrays.
 * @returns An array of strings meeting the criteria.
 */
function getEnteringIds(data: {
	visibleTo: string[];
	allFrom: string[];
}): string[] {
	const {visibleTo, allFrom} = data;

	const setVisibleTo = new Set(visibleTo);
	const setAllFrom = new Set(allFrom);

	// Find elements present in visibleTo but not in allFrom
	return Array.from(setVisibleTo).filter((item) => !setAllFrom.has(item));
}
// // Example usage
// const input = {
//   allFrom: ["001", "002", "003"],
//   visibleTo: ["003", "004", "005"],
//   visibleFrom: ["002", "003", "004"],
//   allTo: ["003", "005"]
// };
// console.log(getEnteringIds(input)); // ["004", "005"]
