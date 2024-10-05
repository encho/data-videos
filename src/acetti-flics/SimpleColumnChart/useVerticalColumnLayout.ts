import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../acetti-layout';

const makeHorizontalBarGridLayoutSpec = ({
	labelWidth,
	valueLabelWidth,
	spaceWidth,
}: {
	labelWidth: number;
	valueLabelWidth: number;
	spaceWidth: number;
}) => {
	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'barRow'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: labelWidth, name: 'labelColumn'},
		{type: 'pixel', value: spaceWidth, name: 'space'},
		{type: 'fr', value: 1, name: 'barColumn'},
		{type: 'pixel', value: spaceWidth, name: 'space'},
		{type: 'pixel', value: valueLabelWidth, name: 'valueLabelColumn'},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			label: [
				{name: 'barRow'},
				{name: 'labelColumn'},
				{name: 'barRow'},
				{name: 'labelColumn'},
			] as TGridLayoutAreaSpec,
			valueLabel: [
				{name: 'barRow'},
				{name: 'valueLabelColumn'},
				{name: 'barRow'},
				{name: 'valueLabelColumn'},
			] as TGridLayoutAreaSpec,
			bar: [
				{name: 'barRow'},
				{name: 'barColumn'},
				{name: 'barRow'},
				{name: 'barColumn'},
			] as TGridLayoutAreaSpec,
		},
	};
	return gridLayoutSpec;
};

export function useVerticalColumnLayout({
	width,
	height,
	labelHeight,
	valueLabelHeight,
	spaceHeight,
}: {
	width: number;
	height: number;
	labelHeight: number;
	valueLabelHeight: number;
	spaceHeight: number;
}) {
	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: valueLabelHeight, name: 'valueLabelRow'},
		{type: 'pixel', value: spaceHeight, name: 'space'},
		{type: 'fr', value: 1, name: 'barRow'},
		{type: 'pixel', value: spaceHeight, name: 'space'},
		{type: 'pixel', value: labelHeight, name: 'labelRow'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'fr', value: 1, name: 'barColumn'},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			label: [
				{name: 'labelRow'},
				{name: 'barColumn'},
				{name: 'labelRow'},
				{name: 'barColumn'},
			] as TGridLayoutAreaSpec,
			valueLabel: [
				{name: 'valueLabelRow'},
				{name: 'barColumn'},
				{name: 'valueLabelRow'},
				{name: 'barColumn'},
			] as TGridLayoutAreaSpec,
			bar: [
				{name: 'barRow'},
				{name: 'barColumn'},
				{name: 'barRow'},
				{name: 'barColumn'},
			] as TGridLayoutAreaSpec,
		},
	};

	const gridLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec,
	});

	return gridLayout;
}
