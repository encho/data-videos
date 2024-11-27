import {
	createGridLayout,
	TGridRailSpec,
	TGridLayout,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../../../../acetti-layout';

// TODO into theme
export function getIbcsSizes(baseline: number) {
	// TODO from theme
	const ibcsSizes = {
		// rows
		marginTop: baseline * 0.75,
		barHeight: baseline * 2,
		marginBottom: baseline * 0.75,
		// columns
		labelMarginRight: baseline * 0.9,
		valueLabelMarginRight: baseline * 0.9,
	};

	return ibcsSizes;
}

// TODO account for flag includeSecondaryBars
// TODO ibcs in the name
export function getBarChartItemHeight({baseline}: {baseline: number}) {
	const ibcsSizes = getIbcsSizes(baseline);

	// TODO also upperBar and lowerBar should be taken into consideration
	const barChartItemHeight =
		ibcsSizes.marginTop + ibcsSizes.barHeight + ibcsSizes.marginBottom;

	return barChartItemHeight;
}

// TODO ibcs in the name
export function getAllBarChartItemsHeight({
	// theme,
	baseline,
	nrItems,
}: {
	// theme: ThemeType;
	baseline: number;
	nrItems: number;
}) {
	// const xAxisMarginTop = getXAxisMarginTop({baseline});
	// const xAxisHeight = getXAxisHeight({baseline, theme});
	const barChartItemHeight = getBarChartItemHeight({baseline});
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
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	negativeValueLabelWidthPercentage: number;
}): TBarChartItemLayout {
	const ibcsSizes = getIbcsSizes(baseline);

	const rows: TGridRailSpec = [
		{
			type: 'pixel',
			value: ibcsSizes.marginTop,
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
			value: ibcsSizes.marginBottom,
			name: 'marginBottom',
		},
	];

	const columns: TGridRailSpec = [
		{
			type: 'pixel',
			value: labelWidth,
			name: 'label',
		},
		{
			type: 'pixel',
			value: 20,
			name: 'labelMarginRight',
		},
		{
			type: 'pixel',
			value: negativeValueLabelWidth * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabel',
		},
		{
			type: 'pixel',
			value: 20 * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabelMarginRight',
		},
		{
			type: 'fr',
			value: 1,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: 20,
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
