import {getGridLayoutArea} from '../../../../acetti-layout/gridLayout';
import {
	useGridLayout,
	TGridRailSpec,
	TGridRailElementSpec,
	TGridLayoutArea,
	TGridLayout,
} from '../../../../acetti-layout';

export type TDynamicListLayout = {
	gridLayout: TGridLayout;
	width: number;
	height: number;
	getListItemArea: (i: number | string) => TGridLayoutArea;
	getListItemPaddedArea: (i: number | string) => TGridLayoutArea;
	getVisibleIndicesRange: (
		visibleIndices: [number, number]
	) => [number, number];
};

export function useDynamicListLayout({
	width,
	height,
	items,
	itemHeight,
	itemMarginTop,
	itemMarginBottom,
}: {
	height: number;
	width: number;
	items: {id: string}[];
	itemHeight: number;
	itemMarginTop: number;
	itemMarginBottom: number;
}): TDynamicListLayout {
	const nrRows = items.length;

	const rows: TGridRailSpec = Array.from({length: nrRows}, () => {
		const rowItems: TGridRailElementSpec[] = [];

		rowItems.push({
			type: 'pixel',
			value: itemMarginTop,
			name: 'listItemPaddingUpper',
		});

		rowItems.push({
			type: 'pixel',
			value: itemHeight,
			name: 'listItem',
		});

		rowItems.push({
			type: 'pixel',
			value: itemMarginBottom,
			name: 'listItemPaddingLower',
		});

		return rowItems;
	}).flat();

	const columns: TGridRailSpec = [{type: 'fr', value: 1, name: 'fullWidth'}];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows,
		columns,
		areas: {},
	};

	const gridLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec,
	});

	console.log({gridLayout});

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

	console.log({gridLayout});

	return {
		gridLayout,
		width: gridLayout.width,
		height: gridLayout.height,
		getListItemArea,
		getListItemPaddedArea,
		getVisibleIndicesRange,
	};
}
