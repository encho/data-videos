import {
	createGridLayout,
	TGridRailSpec,
	TGridLayout,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../../../../acetti-layout';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

function getIbcsSizes(
	baseline: number,
	ibcsSizesObject: ThemeType['ibcsSizes']['columnChartItem']
): ThemeType['ibcsSizes']['columnChartItem'] {
	const ibcsSizes = {
		columns: {
			columnMarginLeft: baseline * ibcsSizesObject.columns.columnMarginLeft,
			columnMarginRight: baseline * ibcsSizesObject.columns.columnMarginRight,
			columnWidth: baseline * ibcsSizesObject.columns.columnWidth,
		},
		rows: {
			labelMargin: baseline * ibcsSizesObject.rows.labelMargin,
			valueLabelMargin: baseline * ibcsSizesObject.rows.valueLabelMargin,
		},
	};
	return ibcsSizes;
}

// TODO account for flag includeSecondaryColumns?
export function getColumnChartItemWidth({
	baseline,
	ibcsSizesSpec,
}: {
	baseline: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
}) {
	const ibcsSizes = getIbcsSizes(baseline, ibcsSizesSpec);

	// TODO also upperBar and lowerBar should be taken into consideration
	const columnChartItemWidth =
		ibcsSizes.columns.columnMarginLeft +
		ibcsSizes.columns.columnWidth +
		ibcsSizes.columns.columnMarginRight;

	return columnChartItemWidth;
}

export function getAllColumnChartItemsWidth({
	baseline,
	nrItems,
	ibcsSizesSpec,
}: {
	baseline: number;
	nrItems: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
}) {
	const columnChartItemWidth = getColumnChartItemWidth({
		baseline,
		ibcsSizesSpec,
	});
	const columnChartItemsWidth = nrItems * columnChartItemWidth;

	return columnChartItemsWidth;
}

export type TColumnChartItemLayout = {
	gridLayout: TGridLayout;
	columnArea: TGridLayoutArea;
	labelArea: TGridLayoutArea;
	valueLabelArea: TGridLayoutArea;
	negativeValueLabelArea: TGridLayoutArea;
};

export function getColumnChartItemLayout({
	height,
	width,
	baseline,
	labelHeight,
	valueLabelHeight,
	negativeValueLabelHeight,
	negativeValueLabelHeightPercentage,
	ibcsSizesSpec,
}: {
	height: number;
	width: number;
	baseline: number;
	labelHeight: number;
	valueLabelHeight: number;
	negativeValueLabelHeight: number;
	negativeValueLabelHeightPercentage: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
}): TColumnChartItemLayout {
	const ibcsSizes = getIbcsSizes(baseline, ibcsSizesSpec);

	const columns: TGridRailSpec = [
		{
			type: 'pixel',
			value: ibcsSizes.columns.columnMarginLeft,
			name: 'marginLeft',
		},
		// in this case we fill all remaining space, and do not guarantee ibcs size!
		{
			type: 'fr',
			value: 1,
			name: 'column',
		},
		{
			type: 'pixel',
			value: ibcsSizes.columns.columnMarginRight,
			name: 'marginRight',
		},
	];

	const rows: TGridRailSpec = [
		{
			type: 'pixel',
			// value: hideLabel ? 0 : labelWidth,
			value: valueLabelHeight,
			name: 'valueLabel',
		},
		{
			type: 'pixel',
			value: ibcsSizes.rows.valueLabelMargin,
			name: 'valueLabelMargin',
		},
		{
			type: 'fr',
			value: 1,
			name: 'column',
		},
		{
			type: 'pixel',
			value:
				ibcsSizes.rows.valueLabelMargin * negativeValueLabelHeightPercentage,
			name: 'negativeValueLabelMargin',
		},
		{
			type: 'pixel',
			value: negativeValueLabelHeight * negativeValueLabelHeightPercentage,
			name: 'negativeValueLabel',
		},
		{
			type: 'pixel',
			value: ibcsSizes.rows.labelMargin,
			name: 'labelMargin',
		},
		{
			type: 'pixel',
			value: labelHeight,
			name: 'label',
		},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows,
		columns,
		areas: {
			column: [
				{name: 'column'},
				{name: 'column'},
				{name: 'column'},
				{name: 'column'},
			] as TGridLayoutAreaSpec,
			label: [
				{name: 'label'},
				{name: 'column'},
				{name: 'label'},
				{name: 'column'},
			] as TGridLayoutAreaSpec,
			valueLabel: [
				{name: 'valueLabel'},
				{name: 'column'},
				{name: 'valueLabel'},
				{name: 'column'},
			] as TGridLayoutAreaSpec,
			negativeValueLabel: [
				{name: 'negativeValueLabel'},
				{name: 'column'},
				{name: 'negativeValueLabel'},
				{name: 'column'},
			] as TGridLayoutAreaSpec,
		},
	};

	const gridLayout = createGridLayout(gridLayoutSpec, {
		width,
		height,
	});

	return {
		gridLayout,
		columnArea: gridLayout.areas.column,
		labelArea: gridLayout.areas.label,
		valueLabelArea: gridLayout.areas.valueLabel,
		negativeValueLabelArea: gridLayout.areas.negativeValueLabel,
	};
}
