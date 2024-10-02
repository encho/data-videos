import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../acetti-layout';

export function useChartLayout({
	width,
	height,
	leftValueLabelWidth,
	rightValueLabelWidth,
}: {
	width: number;
	height: number;
	leftValueLabelWidth: number;
	rightValueLabelWidth: number;
}) {
	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 40, name: 'space'},
		{type: 'pixel', value: 55, name: 'xAxis'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: leftValueLabelWidth, name: 'leftValueLabel'},
		{type: 'pixel', value: 30, name: 'space'},
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 30, name: 'space'},
		{type: 'pixel', value: rightValueLabelWidth, name: 'rightValueLabel'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			xAxis: [
				{name: 'xAxis'},
				{name: 'plot'},
				{name: 'xAxis'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			plot: [
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			leftValueLabel: [
				{name: 'plot'},
				{name: 'leftValueLabel'},
				{name: 'plot'},
				{name: 'leftValueLabel'},
			] as TGridLayoutAreaSpec,
			rightValueLabel: [
				{name: 'plot'},
				{name: 'rightValueLabel'},
				{name: 'plot'},
				{name: 'rightValueLabel'},
			] as TGridLayoutAreaSpec,
		},
	};

	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: chartGridLayoutSpec,
	});
	return chartLayout;
}
