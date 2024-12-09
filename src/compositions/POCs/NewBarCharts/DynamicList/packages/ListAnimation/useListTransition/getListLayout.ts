import {
	createGridLayout,
	getGridLayoutArea,
} from '../../../../../../../acetti-layout/gridLayout';
import {
	TGridRailSpec,
	TGridRailElementSpec,
	TGridLayoutArea,
	TGridLayout,
} from '../../../../../../../acetti-layout';

export type TListLayout = {
	gridLayout: TGridLayout;
	width: number;
	height: number;
	getListItemArea: (i: number | string) => TGridLayoutArea;
	getListItemPaddedArea: (i: number | string) => TGridLayoutArea;
	getVisibleIndicesRange: (
		visibleIndices: [number, number]
	) => [number, number];
};

export function getListLayout({
	width,
	height,
	items,
	itemSize,
	itemMarginBefore,
	itemMarginAfter,
}: {
	height: number;
	width: number;
	items: {id: string}[];
	itemSize: number;
	itemMarginBefore: number;
	itemMarginAfter: number;
}): TListLayout {
	const rows: TGridRailSpec = items
		.map(() => {
			const rowItems: TGridRailElementSpec[] = [];

			rowItems.push({
				type: 'pixel',
				value: itemMarginBefore,
				name: 'listItemPaddingUpper', // TODO change naming
			});

			rowItems.push({
				type: 'pixel',
				value: itemSize,
				name: 'listItem',
			});

			rowItems.push({
				type: 'pixel',
				value: itemMarginAfter,
				name: 'listItemPaddingLower', // TODO change naming
			});

			return rowItems;
		})
		.flat();

	const columns: TGridRailSpec = [{type: 'fr', value: 1, name: 'fullWidth'}];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows,
		columns,
		areas: {},
	};

	const gridLayout = createGridLayout(gridLayoutSpec, {
		width,
		height,
	});

	const getListItemArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const labelArea = getGridLayoutArea(gridLayout, [
				{positionOfType: i, name: 'listItem'}, // start-row
				{name: 'fullWidth'}, // start-column
				{positionOfType: i, name: 'listItem'}, // end-row
				{name: 'fullWidth'}, // end-column
			]);

			return labelArea;
		}

		const stringToIx = items.findIndex((it) => it.id === i);
		return getListItemArea(stringToIx);
	};

	const getListItemPaddedArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const area = getGridLayoutArea(gridLayout, [
				{positionOfType: i, name: 'listItemPaddingUpper'}, // start-row
				{name: 'fullWidth'}, // start-column
				{positionOfType: i, name: 'listItemPaddingLower'}, // end-row
				{name: 'fullWidth'}, // end-column
			]);
			return area;
		}

		const stringToIx = items.findIndex((it) => it.id === i);
		return getListItemPaddedArea(stringToIx);
	};

	const getVisibleIndicesRange = (visibleIndices: [number, number]) => {
		const paddedAreaStart = getListItemPaddedArea(visibleIndices[0]);
		const paddedAreaEnd = getListItemPaddedArea(visibleIndices[1] - 1);

		return [paddedAreaStart.y1, paddedAreaEnd.y2] as [number, number];
	};

	return {
		gridLayout,
		width: gridLayout.width,
		height: gridLayout.height,
		getListItemArea,
		getListItemPaddedArea,
		getVisibleIndicesRange,
	};
}
