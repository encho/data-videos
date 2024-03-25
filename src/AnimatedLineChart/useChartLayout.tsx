import {TGridLayoutAreaSpec, TGridRailSpec, useGridLayout} from '../acetti-viz';

const chartRowsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 60, name: 'space'},
	{type: 'fr', value: 1, name: 'plot'},
	{type: 'pixel', value: 20, name: 'space'},
	{type: 'pixel', value: 100, name: 'xAxis'},
];

const chartColsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 100, name: 'space'},
	{type: 'fr', value: 1, name: 'plot'},
	{type: 'pixel', value: 20, name: 'space'},
	{type: 'pixel', value: 100, name: 'yAxis'},
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
		yAxis: [
			{name: 'plot'},
			{name: 'yAxis'},
			{name: 'plot'},
			{name: 'yAxis'},
		] as TGridLayoutAreaSpec,
		plot: [
			{name: 'plot'},
			{name: 'plot'},
			{name: 'plot'},
			{name: 'plot'},
		] as TGridLayoutAreaSpec,
	},
};

export function useChartLayout({
	width,
	height,
}: {
	width: number;
	height: number;
}) {
	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: chartGridLayoutSpec,
	});
	return chartLayout;
}
