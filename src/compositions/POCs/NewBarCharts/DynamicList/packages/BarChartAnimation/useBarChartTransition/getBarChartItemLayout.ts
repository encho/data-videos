import {
	createGridLayout,
	TGridRailSpec,
	TGridLayout,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../../../../acetti-layout';

// TODO could be in Theme!
type IBCS_Sizes_HorizontalBarChartItem = {
	rows: {
		barMarginTop: number;
		barHeight: number;
		barMarginBottom: number;
	};
	columns: {
		labelMargin: number;
		valueLabelMargin: number;
	};
};

// TODO think about top bar and bottom bar too....
const THEME_IBCS_SIZES_HORIZONTAL_BARCHART_ITEM: IBCS_Sizes_HorizontalBarChartItem =
	{
		rows: {
			barMarginTop: 0.3,
			barHeight: 2,
			barMarginBottom: 0.3,
		},
		columns: {
			labelMargin: 1,
			valueLabelMargin: 0.75,
		},
	};

// TODO into theme
// export function getIbcsSizes(baseline: number) {
function getIbcsSizes(
	baseline: number,
	ibcsSizesObject: IBCS_Sizes_HorizontalBarChartItem = THEME_IBCS_SIZES_HORIZONTAL_BARCHART_ITEM
): IBCS_Sizes_HorizontalBarChartItem {
	const ibcsSizes = {
		rows: {
			barMarginTop: baseline * ibcsSizesObject.rows.barMarginTop,
			barHeight: baseline * ibcsSizesObject.rows.barHeight,
			barMarginBottom: baseline * ibcsSizesObject.rows.barMarginBottom,
		},
		columns: {
			labelMargin: baseline * ibcsSizesObject.columns.labelMargin,
			valueLabelMargin: baseline * ibcsSizesObject.columns.valueLabelMargin,
		},
	};
	return ibcsSizes;
}

// TODO account for flag includeSecondaryBars
// TODO ibcs in the name
// export function getBarChartItemHeight({
export function getBarChartItemHeight({
	baseline,
	ibcsSizesSpec = THEME_IBCS_SIZES_HORIZONTAL_BARCHART_ITEM,
}: {
	baseline: number;
	ibcsSizesSpec: IBCS_Sizes_HorizontalBarChartItem;
}) {
	const ibcsSizes = getIbcsSizes(baseline, ibcsSizesSpec);

	// TODO also upperBar and lowerBar should be taken into consideration
	const barChartItemHeight =
		ibcsSizes.rows.barMarginTop +
		ibcsSizes.rows.barHeight +
		ibcsSizes.rows.barMarginBottom;

	return barChartItemHeight;
}

// TODO ibcs in the name
export function getAllBarChartItemsHeight({
	// theme,
	baseline,
	nrItems,
	ibcsSizesSpec,
}: {
	// theme: ThemeType;
	baseline: number;
	nrItems: number;
	ibcsSizesSpec: IBCS_Sizes_HorizontalBarChartItem;
}) {
	const barChartItemHeight = getBarChartItemHeight({baseline, ibcsSizesSpec});
	const barChartItemsHeight = nrItems * barChartItemHeight;

	return barChartItemsHeight;
}

export type TBarChartItemLayout = {
	gridLayout: TGridLayout;
	barArea: TGridLayoutArea;
	labelArea: TGridLayoutArea;
	valueLabelArea: TGridLayoutArea;
	negativeValueLabelArea: TGridLayoutArea;
};

export function getBarChartItemLayout({
	height,
	width,
	baseline,
	labelWidth,
	valueLabelWidth,
	negativeValueLabelWidth,
	negativeValueLabelWidthPercentage,
	// hideLabel = false, // TODO deprecate?
	// hideValueLabel = false, // TODO deprecate?
	ibcsSizesSpec = THEME_IBCS_SIZES_HORIZONTAL_BARCHART_ITEM,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	negativeValueLabelWidthPercentage: number;
	// hideLabel: boolean;
	// hideValueLabel: boolean;
	ibcsSizesSpec: IBCS_Sizes_HorizontalBarChartItem;
}): TBarChartItemLayout {
	const ibcsSizes = getIbcsSizes(baseline, ibcsSizesSpec);

	const rows: TGridRailSpec = [
		{
			type: 'pixel',
			value: ibcsSizes.rows.barMarginTop,
			name: 'marginTop',
		},
		// in this case we fill all remaining space, and do not guarantee ibcs size!
		{
			type: 'fr',
			value: 1,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: ibcsSizes.rows.barMarginBottom,
			name: 'marginBottom',
		},
	];

	const columns: TGridRailSpec = [
		{
			type: 'pixel',
			// value: hideLabel ? 0 : labelWidth,
			value: labelWidth,
			name: 'label',
		},
		{
			type: 'pixel',
			value: ibcsSizes.columns.labelMargin,
			name: 'labelMarginRight',
		},
		{
			type: 'pixel',
			value: negativeValueLabelWidth * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabel',
		},
		{
			type: 'pixel',
			value:
				ibcsSizes.columns.valueLabelMargin * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabelMarginRight',
		},
		{
			type: 'fr',
			value: 1,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: ibcsSizes.columns.valueLabelMargin,
			name: 'valueLabelMarginLeft',
		},
		{
			type: 'pixel',
			value: valueLabelWidth,
			name: 'valueLabel',
		},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows,
		columns,
		areas: {
			bar: [
				{name: 'bar'},
				{name: 'bar'},
				{name: 'bar'},
				{name: 'bar'},
			] as TGridLayoutAreaSpec,
			label: [
				{name: 'bar'},
				{name: 'label'},
				{name: 'bar'},
				{name: 'label'},
			] as TGridLayoutAreaSpec,
			valueLabel: [
				{name: 'bar'},
				{name: 'valueLabel'},
				{name: 'bar'},
				{name: 'valueLabel'},
			] as TGridLayoutAreaSpec,
			negativeValueLabel: [
				{name: 'bar'},
				{name: 'negativeValueLabel'},
				{name: 'bar'},
				{name: 'negativeValueLabel'},
			] as TGridLayoutAreaSpec,
		},
	};

	const gridLayout = createGridLayout(gridLayoutSpec, {
		width,
		height,
	});

	return {
		gridLayout,
		barArea: gridLayout.areas.bar,
		labelArea: gridLayout.areas.label,
		valueLabelArea: gridLayout.areas.valueLabel,
		negativeValueLabelArea: gridLayout.areas.negativeValueLabel,
	};
}
