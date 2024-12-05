import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../../acetti-layout';

const ROW_SPACE_IN_PIXEL = 70;

// TODO make xaxis height dependant on theme and baseline
const chartRowsRailSpec: TGridRailSpec = [
	{type: 'pixel', value: 55, name: 'xAxis'},
	{type: 'pixel', value: ROW_SPACE_IN_PIXEL, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis_days'},
	{type: 'pixel', value: ROW_SPACE_IN_PIXEL, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis_monthStarts'},
	{type: 'pixel', value: ROW_SPACE_IN_PIXEL, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis_quarterStarts'},
	{type: 'pixel', value: ROW_SPACE_IN_PIXEL, name: 'space'},
	{type: 'pixel', value: 55, name: 'xAxis_semesterStarts'},
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
		xAxis_days: [
			{name: 'xAxis_days'},
			{name: 'plot'},
			{name: 'xAxis_days'},
			{name: 'plot'},
		] as TGridLayoutAreaSpec,
		xAxis_monthStarts: [
			{name: 'xAxis_monthStarts'},
			{name: 'plot'},
			{name: 'xAxis_monthStarts'},
			{name: 'plot'},
		] as TGridLayoutAreaSpec,
		xAxis_quarterStarts: [
			{name: 'xAxis_quarterStarts'},
			{name: 'plot'},
			{name: 'xAxis_quarterStarts'},
			{name: 'plot'},
		] as TGridLayoutAreaSpec,
		xAxis_semesterStarts: [
			{name: 'xAxis_semesterStarts'},
			{name: 'plot'},
			{name: 'xAxis_semesterStarts'},
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
