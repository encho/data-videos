import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../acetti-layout';

const chartRowsRailSpec: TGridRailSpec = [
	{type: 'fr', value: 1, name: 'plot'},
	{type: 'pixel', value: 20, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis'},
];

const chartColsRailSpec: TGridRailSpec = [{type: 'fr', value: 1, name: 'plot'}];

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
