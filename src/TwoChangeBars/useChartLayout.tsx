import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-layout';

const chartRowsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 60, name: 'percChangeDisplay'},
	{type: 'pixel', value: 10, name: 'space'},
	{type: 'pixel', value: 40, name: 'valueText'},
	{type: 'pixel', value: 10, name: 'space'},
	{type: 'fr', value: 1, name: 'bars'},
	{type: 'pixel', value: 10, name: 'space'},
	{type: 'pixel', value: 40, name: 'labelText'},
];

const chartColsRailSpec: TGridRailSpec = [
	{type: 'fr', value: 1, name: 'firstBar'},
	{type: 'pixel', value: 40, name: 'space'},
	{type: 'fr', value: 1, name: 'secondBar'},
];

const chartGridLayoutSpec = {
	padding: 0,
	columnGap: 0,
	rowGap: 0,
	rows: chartRowsRailSpec,
	columns: chartColsRailSpec,
	areas: {
		percChangeDisplay: [
			{name: 'percChangeDisplay'},
			{name: 'firstBar'},
			{name: 'percChangeDisplay'},
			{name: 'secondBar'},
		] as TGridLayoutAreaSpec,
		firstBar: [
			{name: 'bars'},
			{name: 'firstBar'},
			{name: 'bars'},
			{name: 'firstBar'},
		] as TGridLayoutAreaSpec,
		secondBar: [
			{name: 'bars'},
			{name: 'secondBar'},
			{name: 'bars'},
			{name: 'secondBar'},
		] as TGridLayoutAreaSpec,
		firstBarValueText: [
			{name: 'valueText'},
			{name: 'firstBar'},
			{name: 'valueText'},
			{name: 'firstBar'},
		] as TGridLayoutAreaSpec,
		secondBarValueText: [
			{name: 'valueText'},
			{name: 'secondBar'},
			{name: 'valueText'},
			{name: 'secondBar'},
		] as TGridLayoutAreaSpec,
		firstBarLabelText: [
			{name: 'labelText'},
			{name: 'firstBar'},
			{name: 'labelText'},
			{name: 'firstBar'},
		] as TGridLayoutAreaSpec,
		secondBarLabelText: [
			{name: 'labelText'},
			{name: 'secondBar'},
			{name: 'labelText'},
			{name: 'secondBar'},
		] as TGridLayoutAreaSpec,
		// yAxis: [
		// 	{name: 'plot'},
		// 	{name: 'yAxis'},
		// 	{name: 'plot'},
		// 	{name: 'yAxis'},
		// ] as TGridLayoutAreaSpec,
		// plot: [
		// 	{name: 'plot'},
		// 	{name: 'plot'},
		// 	{name: 'plot'},
		// 	{name: 'plot'},
		// ] as TGridLayoutAreaSpec,
		// subPlot: [
		// 	{name: 'subPlot'},
		// 	{name: 'plot'},
		// 	{name: 'subPlot'},
		// 	{name: 'plot'},
		// ] as TGridLayoutAreaSpec,
		// minimapPlot: [
		// 	{name: 'minimapPlot'},
		// 	{name: 'plot'},
		// 	{name: 'minimapPlot'},
		// 	{name: 'plot'},
		// ] as TGridLayoutAreaSpec,
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
