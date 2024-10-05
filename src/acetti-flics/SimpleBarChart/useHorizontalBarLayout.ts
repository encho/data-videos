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

export function useHorizontalBarLayout({
	width,
	height,
	labelWidth,
	valueLabelWidth,
	spaceWidth,
}: {
	width: number;
	height: number;
	labelWidth: number;
	valueLabelWidth: number;
	spaceWidth: number;
}) {
	const gridLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: makeHorizontalBarGridLayoutSpec({
			labelWidth,
			valueLabelWidth,
			spaceWidth,
		}),
	});
	return gridLayout;
}
