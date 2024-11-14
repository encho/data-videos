import invariant from 'tiny-invariant';
import {
	TGridLayoutArea,
	TGridRailSpec,
	useGridLayout,
	TGridLayout,
	TGridRailElementSpec,
} from '..';

const makeMatrixLayoutGridLayoutSpec = ({
	nrColumns,
	nrRows,
	rowSizes: rowSizesProp,
	columnSizes: columnSizesProp,
	rowPaddingPixels = 0,
	columnPaddingPixels = 0,
	rowSpacePixels = 0,
	columnSpacePixels = 0,
}: {
	nrColumns: number;
	nrRows: number;
	rowSizes?: {value: number; type: 'fr' | 'pixel'}[];
	columnSizes?: {value: number; type: 'fr' | 'pixel'}[];
	rowPaddingPixels?: number;
	columnPaddingPixels?: number;
	rowSpacePixels?: number;
	columnSpacePixels?: number;
}) => {
	const chartRowsRailSpec: TGridRailSpec = [];
	const chartColsRailSpec: TGridRailSpec = [];

	const gridRowsElementSpecs: TGridRailElementSpec[] = rowSizesProp
		? rowSizesProp.map((it) => ({...it, name: 'cell'}))
		: Array.from({length: nrRows}).map(() => ({
				type: 'fr' as const,
				value: 1,
				name: 'cell',
		  }));

	const gridColumnsElementSpecs: TGridRailElementSpec[] = columnSizesProp
		? columnSizesProp.map((it) => ({...it, name: 'cell'}))
		: Array.from({length: nrColumns}).map(() => ({
				type: 'fr' as const,
				value: 1,
				name: 'cell',
		  }));

	invariant(gridRowsElementSpecs.length === nrRows);
	invariant(gridColumnsElementSpecs.length === nrColumns);

	for (let i = 0; i < nrRows; i++) {
		if (i === 0) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: rowPaddingPixels,
				name: 'padding',
			});
		}

		chartRowsRailSpec.push(gridRowsElementSpecs[i]);

		if (i < nrRows - 1) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: rowSpacePixels,
				name: 'space',
			});
		}
		if (i === nrRows - 1) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: rowPaddingPixels,
				name: 'padding',
			});
		}
	}

	for (let i = 0; i < nrColumns; i++) {
		if (i === 0) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: columnPaddingPixels,
				name: 'padding',
			});
		}
		// chartColsRailSpec.push({
		// 	type: 'fr',
		// 	value: 1,
		// 	name: 'cell',
		// });

		chartColsRailSpec.push(gridColumnsElementSpecs[i]);

		if (i < nrColumns - 1) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: columnSpacePixels,
				name: 'space',
			});
		}
		if (i === nrColumns - 1) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: columnPaddingPixels,
				name: 'padding',
			});
		}
	}

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {},
	};
	return chartGridLayoutSpec;
};

export function useMatrixLayout({
	width,
	height,
	nrColumns,
	nrRows,
	rowSizes,
	columnSizes,
	rowPaddingPixels = 0,
	columnPaddingPixels = 0,
	rowSpacePixels = 0,
	columnSpacePixels = 0,
}: {
	width: number;
	height: number;
	nrColumns: number;
	nrRows: number;
	rowSizes?: {value: number; type: 'fr' | 'pixel'}[];
	columnSizes?: {value: number; type: 'fr' | 'pixel'}[];
	rowPaddingPixels?: number;
	columnPaddingPixels?: number;
	rowSpacePixels?: number;
	columnSpacePixels?: number;
}) {
	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: makeMatrixLayoutGridLayoutSpec({
			nrColumns,
			nrRows,
			rowSizes,
			columnSizes,
			rowPaddingPixels,
			columnPaddingPixels,
			rowSpacePixels,
			columnSpacePixels,
		}),
	});
	return chartLayout;
}

export function getMatrixLayoutCellArea({
	layout,
	cellName = 'cell',
	row,
	column,
}: {
	layout: TGridLayout;
	cellName?: string;
	row: number;
	column: number;
}): TGridLayoutArea {
	const rowGridCell = layout.rows.find((cell) => {
		return cell.name === cellName && cell.positionOfType === row;
	});
	const colGridCell = layout.columns.find((cell) => {
		return cell.name === cellName && cell.positionOfType === column;
	});

	if (rowGridCell === undefined || colGridCell === undefined) {
		throw new Error(
			'Error in getMatrixLayoutCellArea: could not find row or column cell for passed index'
		);
	}

	return {
		x1: colGridCell.start,
		x2: colGridCell.end,
		y1: rowGridCell.start,
		y2: rowGridCell.end,
		width: colGridCell.end - colGridCell.start,
		height: rowGridCell.end - rowGridCell.start,
	};
}
