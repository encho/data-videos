import {
	TGridLayoutArea,
	TGridRailSpec,
	useGridLayout,
	TGridLayout,
} from '../../../acetti-layout';

// TODO pass padding sizes and space sizes in pixels?!
const makeChartGridLayoutSpec = ({
	nrColumns,
	nrRows,
}: {
	nrColumns: number;
	nrRows: number;
}) => {
	const chartRowsRailSpec: TGridRailSpec = [];
	const chartColsRailSpec: TGridRailSpec = [];

	const rowSpaceSizeInPixels = 20;
	const colSpaceSizeInPixels = 20;

	for (let i = 0; i < nrRows; i++) {
		if (i === 0) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: 20,
				name: 'padding',
			});
		}
		chartRowsRailSpec.push({
			type: 'fr',
			value: 1,
			name: 'cell',
		});
		if (i < nrRows - 1) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: rowSpaceSizeInPixels,
				name: 'space',
			});
		}
		if (i === nrRows - 1) {
			chartRowsRailSpec.push({
				type: 'pixel',
				value: 20,
				name: 'padding',
			});
		}
	}

	for (let i = 0; i < nrColumns; i++) {
		if (i === 0) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: 20,
				name: 'padding',
			});
		}
		chartColsRailSpec.push({
			type: 'fr',
			value: 1,
			name: 'cell',
		});
		if (i < nrColumns - 1) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: colSpaceSizeInPixels,
				name: 'space',
			});
		}
		if (i === nrColumns - 1) {
			chartColsRailSpec.push({
				type: 'pixel',
				value: 20,
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

// TODO put into layout library, and rename to e.g useMatrixLayout
export function useChartLayout({
	width,
	height,
	nrColumns,
	nrRows,
}: {
	width: number;
	height: number;
	nrColumns: number;
	nrRows: number;
}) {
	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: makeChartGridLayoutSpec({
			nrColumns,
			nrRows,
		}),
	});
	return chartLayout;
}

// TODO put into layout library, and rename to e.g getMatrixLayoutCell
export function getMatrixLayoutCellArea(
	layout: TGridLayout,
	cellName: string, // TODO evtl. just use "cell" as default
	row: number,
	column: number
): TGridLayoutArea {
	const rowGridCell = layout.rows.find((cell) => {
		return cell.name === cellName && cell.positionOfType === row;
	});
	const colGridCell = layout.columns.find((cell) => {
		return cell.name === cellName && cell.positionOfType === column;
		// cell.name === cellName;
	});
	console.log({cellName, row, column});
	console.log(layout.columns);
	console.log(layout.rows);
	// console.log()
	console.log({rowGridCell, colGridCell});

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
