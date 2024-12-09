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
	direction,
	width,
	height,
	items,
	itemSize,
	itemMarginBefore,
	itemMarginAfter,
}: {
	direction: 'vertical' | 'horizontal';
	height: number;
	width: number;
	items: {id: string}[];
	itemSize: number;
	itemMarginBefore: number;
	itemMarginAfter: number;
}): TListLayout {
	if (direction === 'vertical') {
		return getVerticalListLayout({
			width,
			height,
			items,
			itemSize,
			itemMarginBefore,
			itemMarginAfter,
		});
	}

	return getHorizontalListLayout({
		width,
		height,
		items,
		itemSize,
		itemMarginBefore,
		itemMarginAfter,
	});
}

function getVerticalListLayout({
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
				name: 'listItemMarginBefore',
			});

			rowItems.push({
				type: 'pixel',
				value: itemSize,
				name: 'listItem',
			});

			rowItems.push({
				type: 'pixel',
				value: itemMarginAfter,
				name: 'listItemMarginAfter',
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
				{positionOfType: i, name: 'listItemMarginBefore'}, // start-row
				{name: 'fullWidth'}, // start-column
				{positionOfType: i, name: 'listItemMarginAfter'}, // end-row
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

export function getHorizontalListLayout({
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
	const columns: TGridRailSpec = items
		.map(() => {
			const columnItems: TGridRailElementSpec[] = [];

			columnItems.push({
				type: 'pixel',
				value: itemMarginBefore,
				name: 'listItemMarginBefore',
			});

			columnItems.push({
				type: 'pixel',
				value: itemSize,
				name: 'listItem',
			});

			columnItems.push({
				type: 'pixel',
				value: itemMarginAfter,
				name: 'listItemMarginAfter',
			});

			return columnItems;
		})
		.flat();

	const rows: TGridRailSpec = [{type: 'fr', value: 1, name: 'fullHeight'}];

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
				{name: 'fullHeight'}, // start-row
				{positionOfType: i, name: 'listItem'}, // start-column
				{name: 'fullHeight'}, // end-row
				{positionOfType: i, name: 'listItem'}, // end-column
			]);

			return labelArea;
		}

		const stringToIx = items.findIndex((it) => it.id === i);
		return getListItemArea(stringToIx);
	};

	const getListItemPaddedArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const area = getGridLayoutArea(gridLayout, [
				{name: 'fullHeight'}, // start-row
				{positionOfType: i, name: 'listItemMarginBefore'}, // start-column
				{name: 'fullHeight'}, // end-row
				{positionOfType: i, name: 'listItemMarginAfter'}, // end-column
			]);
			return area;
		}

		const stringToIx = items.findIndex((it) => it.id === i);
		return getListItemPaddedArea(stringToIx);
	};

	const getVisibleIndicesRange = (visibleIndices: [number, number]) => {
		const paddedAreaStart = getListItemPaddedArea(visibleIndices[0]);
		const paddedAreaEnd = getListItemPaddedArea(visibleIndices[1] - 1);

		return [paddedAreaStart.x1, paddedAreaEnd.x2] as [number, number];
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
