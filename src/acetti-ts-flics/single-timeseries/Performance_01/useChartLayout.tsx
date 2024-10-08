import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../acetti-layout';

const chartRowsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 50, name: 'space'},
	{type: 'fr', value: 1, name: 'plot'},
	{type: 'pixel', value: 20, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis'},
	{type: 'pixel', value: 40, name: 'space'},
];

const chartColsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 50, name: 'space'},
	{type: 'fr', value: 1, name: 'plot'},
	{type: 'pixel', value: 40, name: 'space'},
	{type: 'pixel', value: 135, name: 'yAxis'},
	{type: 'pixel', value: 50, name: 'space'},
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
