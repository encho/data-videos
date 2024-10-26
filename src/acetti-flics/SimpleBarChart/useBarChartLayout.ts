import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {getGridLayoutArea} from '../../acetti-layout/gridLayout';
import {
	useGridLayout,
	TGridRailSpec,
	TGridRailElementSpec,
	TGridLayoutArea,
	TGridLayout,
} from '../../acetti-layout';
import {TSimpleBarChartData} from './SimpleBarChart';
import {getTextDimensions} from '../../acetti-typography/CapSizeTextNew';
import {ThemeType} from '../../acetti-themes/themeTypes';

type TBarChartLayout = {
	gridLayout: TGridLayout;
	width: number;
	height: number;
	getLabelArea: (i: number) => TGridLayoutArea;
	getBarArea: (i: number) => TGridLayoutArea;
	getValueLabelArea: (i: number) => TGridLayoutArea;
};

export function useBarChartLayout({
	theme,
	baseline,
	width,
	data,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
}: {
	theme: ThemeType;
	baseline: number;
	width: number;
	data: TSimpleBarChartData;
	labelWidth?: number;
	valueLabelWidth?: number;
}): TBarChartLayout {
	// TODO from theme
	const ibcsSizes = {
		barHeight: baseline * 2,
		rowSpace: baseline * 0.5,
		barMarginLeft: baseline * 0.5,
		barMarginRight: baseline * 0.5,
	};

	const nrRows = data.length;

	// =========================================
	const barChartHeight =
		nrRows * ibcsSizes.barHeight + (nrRows - 1) * ibcsSizes.rowSpace;
	// + 2 * ROW_PADDING;

	const labelWidths = data.map(
		(it) =>
			getTextDimensions({key: 'datavizLabel', theme, baseline, text: it.label})
				.width
	);

	const labelWidth = labelWidthProp || Math.max(...labelWidths) * 1.1;

	// TODO use valueLabelTextStyleProps after we use that text style!!!
	// determine valueLabelWidth from all valueLabelWidth's
	// ------------------------------------------
	const valueLabelWidths = data.map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = valueLabelWidthProp || Math.max(...valueLabelWidths);

	const barChartRowsRailSpec: TGridRailSpec = Array.from(
		{length: nrRows},
		(_, index) => {
			const items: TGridRailElementSpec[] = [
				{
					type: 'pixel',
					value: ibcsSizes.barHeight,
					name: 'dataItem',
				},
			];

			// Add 'space' after each 'dataItem' except the last one
			if (index < nrRows - 1) {
				items.push({
					type: 'pixel',
					value: ibcsSizes.rowSpace,
					name: 'space',
				});
			}

			return items;
		}
	).flat();
	// the above generates a structure like, e.g.:
	// const barChartRowsRailSpec: TGridRailSpec = [
	// 	{type: 'pixel', value: ibcsSizes.barHeight, name: 'dataItem'},
	// 	{type: 'pixel', value: ibcsSizes.rowSpace, name: 'space'},
	// 	{type: 'pixel', value: ibcsSizes.barHeight, name: 'dataItem'},
	// 	{type: 'pixel', value: ibcsSizes.rowSpace, name: 'space'},
	// 	{type: 'pixel', value: ibcsSizes.barHeight, name: 'dataItem'},
	// 	{type: 'pixel', value: ibcsSizes.rowSpace, name: 'space'},
	// 	{type: 'pixel', value: ibcsSizes.barHeight, name: 'dataItem'},
	// ];

	const barChartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: labelWidth, name: 'label'},
		{type: 'pixel', value: ibcsSizes.barMarginLeft, name: 'barMarginLeft'},
		{type: 'fr', value: 1, name: 'bar'},
		{type: 'pixel', value: ibcsSizes.barMarginRight, name: 'barMarginRight'},
		{type: 'pixel', value: valueLabelWidth, name: 'valueLabel'},
	];

	const barChartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: barChartRowsRailSpec,
		columns: barChartColsRailSpec,
		areas: {},
	};

	const chartLayout = useGridLayout({
		width,
		height: barChartHeight,
		gridLayoutSpec: barChartGridLayoutSpec,
	});

	const getLabelArea = (i: number) => {
		const labelArea = getGridLayoutArea(chartLayout, [
			{positionOfType: i, name: 'dataItem'}, // start-row
			{name: 'label'}, // start-column
			{positionOfType: i, name: 'dataItem'}, // end-row
			{name: 'label'}, // end-column
		]);
		return labelArea;
	};

	const getBarArea = (i: number) => {
		const labelArea = getGridLayoutArea(chartLayout, [
			{positionOfType: i, name: 'dataItem'}, // start-row
			{name: 'bar'}, // start-column
			{positionOfType: i, name: 'dataItem'}, // end-row
			{name: 'bar'}, // end-column
		]);
		return labelArea;
	};

	const getValueLabelArea = (i: number) => {
		const labelArea = getGridLayoutArea(chartLayout, [
			{positionOfType: i, name: 'dataItem'}, // start-row
			{name: 'valueLabel'}, // start-column
			{positionOfType: i, name: 'dataItem'}, // end-row
			{name: 'valueLabel'}, // end-column
		]);
		return labelArea;
	};

	return {
		gridLayout: chartLayout,
		width: chartLayout.width,
		height: chartLayout.height,
		getLabelArea,
		getBarArea,
		getValueLabelArea,
	};
}
