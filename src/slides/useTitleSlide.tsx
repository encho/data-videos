import {TGridLayoutAreaSpec, TGridRailSpec, useGridLayout} from '../acetti-viz';

export function useTitleSlide({
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
		{type: 'pixel', value: baselines(12), name: 'topSpaceRow'},
		{type: 'fr', value: 1, name: 'titleRow'},
		{type: 'pixel', value: baselines(20), name: 'bottomSpaceRow'},
	];

	const colsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: baselines(5), name: 'leftSpaceCol'},
		{type: 'fr', value: 1, name: 'fullWidthCol'},
		{type: 'pixel', value: baselines(5), name: 'rightSpaceCol'},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: rowsRailSpec,
		columns: colsRailSpec,
		areas: {
			title: [
				{name: 'titleRow'},
				{name: 'fullWidthCol'},
				{name: 'titleRow'},
				{name: 'fullWidthCol'},
			] as TGridLayoutAreaSpec,
		},
	};

	const layout = useGridLayout({width, height, gridLayoutSpec});

	return {layout, baselines};
}
