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
	ibcsSizesObject: ThemeType['ibcsSizes']['barChartItem']
): ThemeType['ibcsSizes']['barChartItem'] {
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
export function getBarChartItemHeight({
	baseline,
	ibcsSizesSpec,
}: {
	baseline: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['barChartItem'];
}) {
	const ibcsSizes = getIbcsSizes(baseline, ibcsSizesSpec);

	// TODO also upperBar and lowerBar should be taken into consideration
	const barChartItemHeight =
		ibcsSizes.rows.barMarginTop +
		ibcsSizes.rows.barHeight +
		ibcsSizes.rows.barMarginBottom;

	return barChartItemHeight;
}

export function getAllBarChartItemsHeight({
	baseline,
	nrItems,
	ibcsSizesSpec,
}: {
	baseline: number;
	nrItems: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['barChartItem'];
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
	ibcsSizesSpec,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	negativeValueLabelWidthPercentage: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['barChartItem'];
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
