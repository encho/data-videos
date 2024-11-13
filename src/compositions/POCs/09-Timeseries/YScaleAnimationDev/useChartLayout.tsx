import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../../acetti-layout';

// const ROW_SPACE_IN_PIXEL = 70;

// TODO make xaxis height dependant on theme and baseline
export function useChartLayout({
	width,
	height,
	yAxisWidth,
}: {
	width: number;
	height: number;
	yAxisWidth: number;
}) {
	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 30, name: 'space'},
		{type: 'pixel', value: 55, name: 'xAxis'},

		{type: 'pixel', value: 30, name: 'space'},
		{type: 'fr', value: 0.33, name: 'plot2'},
		{type: 'pixel', value: 30, name: 'space'},
		{type: 'pixel', value: 55, name: 'xAxis2'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: 30, name: 'space'},
		{type: 'pixel', value: yAxisWidth, name: 'yAxis'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			yAxis: [
				{name: 'plot'},
				{name: 'yAxis'},
				{name: 'plot'},
				{name: 'yAxis'},
			] as TGridLayoutAreaSpec,
			yAxis2: [
				{name: 'plot2'},
				{name: 'yAxis'},
				{name: 'plot2'},
				{name: 'yAxis'},
			] as TGridLayoutAreaSpec,
			plot: [
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			xAxis: [
				{name: 'xAxis'},
				{name: 'plot'},
				{name: 'xAxis'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			plot2: [
				{name: 'plot2'},
				{name: 'plot'},
				{name: 'plot2'},
				{name: 'plot'},
			] as TGridLayoutAreaSpec,
			xAxis2: [
				{name: 'xAxis2'},
				{name: 'plot'},
				{name: 'xAxis2'},
				{name: 'plot'},
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
