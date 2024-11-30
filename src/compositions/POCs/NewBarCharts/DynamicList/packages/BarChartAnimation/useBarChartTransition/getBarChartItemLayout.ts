import {
	createGridLayout,
	TGridRailSpec,
	TGridLayout,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../../../../acetti-layout';

// TODO into theme
export function getIbcsSizes(baseline: number) {
	// TODO from theme AND from inputs
	const ibcsSizes = {
		// rows
		marginTop: baseline * 0.3,
		barHeight: baseline * 2,
		marginBottom: baseline * 0.3,
		// columns
		labelMargin: baseline,
		valueLabelMargin: baseline * 0.75,
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
	hideLabel = false,
	hideValueLabel = false,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	negativeValueLabelWidthPercentage: number;
	hideLabel: boolean;
	hideValueLabel: boolean;
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
			value: hideLabel ? 0 : labelWidth,
			name: 'label',
		},
		{
			type: 'pixel',
			value: hideLabel ? 0 : ibcsSizes.labelMargin,
			name: 'labelMarginRight',
		},
		{
			type: 'pixel',
			value: hideValueLabel
				? 0
				: negativeValueLabelWidth * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabel',
		},
		{
			type: 'pixel',
			value: hideValueLabel
				? 0
				: ibcsSizes.valueLabelMargin * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabelMarginRight',
		},
		{
			type: 'fr',
			value: 1,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: hideValueLabel ? 0 : ibcsSizes.valueLabelMargin,
			name: 'valueLabelMarginLeft',
		},
		{
			type: 'pixel',
			value: hideValueLabel ? 0 : valueLabelWidth,
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
