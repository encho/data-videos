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
	baseline,
}: {
	baseline: number;
	width: number;
	height: number;
	leftValueLabelWidth: number;
	rightValueLabelWidth: number;
}) {
	// TODO define in ibcs theme
	// *************************************
	const SPACE_ABOVE_XAXIS = baseline * 2;
	const SPACE_FOR_XAXIS = baseline * 1.5;
	const VERTICAL_SPACE = baseline * 1;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: SPACE_ABOVE_XAXIS, name: 'space'},
		{type: 'pixel', value: SPACE_FOR_XAXIS, name: 'xAxis'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: leftValueLabelWidth, name: 'leftValueLabel'},
		{type: 'pixel', value: VERTICAL_SPACE, name: 'space'},
		{type: 'fr', value: 1, name: 'plot'},
		{type: 'pixel', value: VERTICAL_SPACE, name: 'space'},
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
