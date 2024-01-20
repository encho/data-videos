import {TGridLayoutAreaSpec, TGridRailSpec, useGridLayout} from '../acetti-viz';

export function useFullBodySlide({
	width,
	height,
}: {
	width: number;
	height: number;
}) {
	// TODO should be passed to a provider, s.t. we can use within all deeply nested children
	// const {baseline, baselines, ...} = useTypographyicLayout
	const baseline = height / 50;
	const baselines = (amount: number) => {
		return amount * baseline;
	};

	const rowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: baselines(8), name: 'topPaddingRow'},
		{type: 'fr', value: 1, name: 'bodyRow'},
		{type: 'pixel', value: baselines(8), name: 'bottomPaddingRow'},
	];

	const colsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: baselines(6), name: 'leftPaddingCol'},
		{type: 'fr', value: 1, name: 'bodyCol'},
		{type: 'pixel', value: baselines(6), name: 'rightPaddingCol'},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: rowsRailSpec,
		columns: colsRailSpec,
		areas: {
			body: [
				{name: 'bodyRow'},
				{name: 'bodyCol'},
				{name: 'bodyRow'},
				{name: 'bodyCol'},
			] as TGridLayoutAreaSpec,
		},
	};

	const layout = useGridLayout({width, height, gridLayoutSpec});

	return {layout, baselines};
}
