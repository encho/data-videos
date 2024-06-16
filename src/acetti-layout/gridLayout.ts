import {find, fromPairs, sumBy, toPairs} from 'lodash';

import {
	TGridLayout,
	TGridLayoutArea,
	TGridLayoutAreaSpec,
	TGridLayoutSpec,
	TGridRail,
	TGridRailElement,
	TGridRailElementSpec,
	TGridRailSpec,
	TGridSize,
} from './types2';

function getReservedSpace(
	spec: TGridRailSpec,
	{padding, gap}: {padding: number; gap: number}
) {
	if (spec.length === 0) {
		throw new Error(
			'Invariant violation: expected spec to have at least one element'
		);
	}

	const fixedSpace = sumBy(
		spec.filter((it) => it.type === 'pixel'),
		'value'
	);
	const padSpace = 2 * padding;
	const gapSpace = (spec.length - 1) * gap;

	return fixedSpace + padSpace + gapSpace;
}

function getTotalFractions(spec: TGridRailSpec) {
	return sumBy(
		spec.filter((it) => it.type === 'fr'),
		'value'
	);
}

function getCellSize(
	cell: TGridRailElementSpec,
	freeSpace: number,
	totalFractions: number
) {
	return cell.type === 'pixel'
		? cell.value
		: (cell.value / totalFractions) * freeSpace;
}

function getGridRail(
	spec: TGridRailSpec,
	freeSpace: number,
	totalFractions: number,
	{gap, padding}: {gap: number; padding: number}
): TGridRail {
	return spec.reduce<TGridRail>((memo, current, index) => {
		const lastCell = memo[index - 1];
		const start = lastCell ? lastCell.end + gap : padding;
		const cellSize = getCellSize(current, freeSpace, totalFractions);
		const end = start + cellSize;
		return [...memo, {...current, position: index, start, end}];
	}, []);
}

type TCreateGridRail = {
	spec: TGridRailSpec;
	gap: number;
	padding: number;
	size: number;
};

export function createGridRail({spec, gap, padding, size}: TCreateGridRail) {
	const freeSpace = size - getReservedSpace(spec, {padding, gap});
	const totalFractions = getTotalFractions(spec);
	return getGridRail(spec, freeSpace, totalFractions, {padding, gap});
}

type TCreateArea = {
	rows: TGridRail;
	columns: TGridRail;
	areaSpec: TGridLayoutAreaSpec;
};

export function createArea({
	rows,
	columns,
	areaSpec,
}: TCreateArea): TGridLayoutArea {
	const startRow = find<TGridRailElement>(rows, areaSpec[0]);
	const startColumn = find<TGridRailElement>(columns, areaSpec[1]);
	const endRow = find<TGridRailElement>(rows, areaSpec[2]);
	const endColumn = find<TGridRailElement>(columns, areaSpec[3]);

	if (!(startRow && startColumn && endRow && endColumn)) {
		throw new Error('Did not find some elements in the grid rails!');
	}

	return {
		y1: startRow.start,
		y2: endRow.end,
		x1: startColumn.start,
		x2: endColumn.end,
		height: endRow.end - startRow.start,
		width: endColumn.end - startColumn.start,
	};
}

export function createGridLayout(
	gridSpec: TGridLayoutSpec,
	size: TGridSize
): TGridLayout {
	const {width, height} = size;

	const columns = createGridRail({
		spec: gridSpec.columns,
		gap: gridSpec.columnGap,
		padding: gridSpec.padding,
		size: width,
	});

	const rows = createGridRail({
		spec: gridSpec.rows,
		gap: gridSpec.rowGap,
		padding: gridSpec.padding,
		size: height,
	});

	const grid = {
		width: columns[columns.length - 1].end + gridSpec.padding,
		height: rows[rows.length - 1].end + gridSpec.padding,
		columns,
		rows,
		areas: fromPairs(
			toPairs<TGridLayoutAreaSpec>(gridSpec.areas).map(
				// ([areaKey, areaSpec]: [string, TGridLayoutAreaSpec]) => {
				([areaKey, areaSpec]) => {
					const area = createArea({rows, columns, areaSpec});
					return [areaKey, area];
				}
			)
		),
	};

	return grid;
}
