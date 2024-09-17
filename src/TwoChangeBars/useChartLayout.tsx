import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../acetti-layout';

const makeChartGridLayoutSpec = ({
	labelTextSize,
	labelMarginTop,
	valueTextSize,
	valueMarginTop,
	valueMarginBottom,
}: {
	labelTextSize: number;
	labelMarginTop: number;
	valueTextSize: number;
	valueMarginTop: number;
	valueMarginBottom: number;
}) => {
	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: 60, name: 'percChangeDisplay'},
		{type: 'pixel', value: valueMarginTop, name: 'space'},
		{type: 'pixel', value: valueTextSize, name: 'valueText'},
		{type: 'pixel', value: valueMarginBottom, name: 'space'},
		{type: 'fr', value: 1, name: 'bars'},
		{type: 'pixel', value: labelMarginTop, name: 'space'},
		{type: 'pixel', value: labelTextSize, name: 'labelText'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'firstBar'},
		{type: 'pixel', value: 60, name: 'space'},
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
		},
	};
	return chartGridLayoutSpec;
};

export function useChartLayout({
	width,
	height,
	//
	labelTextSize,
	labelMarginTop,
	valueTextSize,
	valueMarginTop,
	valueMarginBottom,
}: {
	width: number;
	height: number;
	//
	labelTextSize: number;
	labelMarginTop: number;
	valueTextSize: number;
	valueMarginTop: number;
	valueMarginBottom: number;
}) {
	const chartLayout = useGridLayout({
		width,
		height,
		// TODO pass label text size
		gridLayoutSpec: makeChartGridLayoutSpec({
			labelTextSize,
			labelMarginTop,
			valueTextSize,
			valueMarginTop,
			valueMarginBottom,
		}),
	});
	return chartLayout;
}
