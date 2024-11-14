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

export function getIbcsSizes(baseline: number) {
	// TODO from theme
	const ibcsSizes = {
		barHeight: baseline * 2,
		// rowSpace: baseline * 0.5,
		rowSpace: baseline * 0.75,
		barMarginLeft: baseline * 0.9, // TODO rename to labelMarginRight
		// barMarginRight: baseline * 0.5,
		valueLabelMargin: baseline * 0.6,
		topPadding: baseline * 0.25,
		bottomPadding: baseline * 0.25,
	};

	return ibcsSizes;
}

// TODO account for flag includeSecondaryBars
export function getBarChartHeight({
	baseline,
	nrRows,
}: {
	baseline: number;
	nrRows: number;
}) {
	const ibcsSizes = getIbcsSizes(baseline);

	const barChartHeight =
		nrRows * ibcsSizes.barHeight +
		(nrRows - 1) * ibcsSizes.rowSpace +
		ibcsSizes.topPadding +
		ibcsSizes.bottomPadding;

	return barChartHeight;
}

// TODO account for flag includeSecondaryBars
export const getBarChartBaseline = (
	targetHeight: number,
	data: TSimpleBarChartData
) => {
	const testBaseline = 10;
	const heightForTestBaseline = getBarChartHeight({
		baseline: testBaseline,
		nrRows: data.length,
	});

	const perfectBaseline = (testBaseline * targetHeight) / heightForTestBaseline;
	return perfectBaseline;
};

export type TBarChartLayout = {
	gridLayout: TGridLayout;
	width: number;
	height: number;
	getLabelArea: (i: number | string) => TGridLayoutArea;
	getBarArea: (i: number | string) => TGridLayoutArea;
	getValueLabelArea: (i: number | string) => TGridLayoutArea;
	getNegativeValueLabelArea: (i: number | string) => TGridLayoutArea;
	getZeroLineArea: () => TGridLayoutArea;
};

export function getMaxValueLabelWidth({
	data,
	theme,
	baseline,
}: {
	data: TSimpleBarChartData;
	theme: ThemeType;
	baseline: number;
}) {
	if (data.length === 0) {
		return 0;
	}

	const valueLabelWidths = data.map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline,
				text: it.valueLabel,
			}).width
	);

	return Math.max(...valueLabelWidths);
}

export function useBarChartLayout({
	theme,
	baseline,
	width,
	data,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	negativeValueLabelWidth: negativeValueLabelWidthProp,
	hideLabels = false,
}: {
	theme: ThemeType;
	baseline: number;
	width: number;
	data: TSimpleBarChartData;
	labelWidth?: number;
	valueLabelWidth?: number;
	negativeValueLabelWidth?: number;
	hideLabels?: boolean;
}): TBarChartLayout {
	// TODO from theme
	const ibcsSizes = getIbcsSizes(baseline);

	const nrRows = data.length;

	const barChartHeight = getBarChartHeight({baseline, nrRows});

	const hasNegativeValues = data.some((item) => item.value < 0);

	// TODO evtl. useCallback to improve performance
	const getLabelWidth = () => {
		const labelWidths = data.map(
			(it) =>
				getTextDimensions({
					key: 'datavizLabel',
					theme,
					baseline,
					text: it.label,
				}).width
		);

		return labelWidthProp || Math.max(...labelWidths);
	};

	// layout sizes contingent on whether labels are shown
	const labelWidth = hideLabels ? 0 : getLabelWidth();
	const barMarginLeft = hideLabels ? 0 : ibcsSizes.barMarginLeft;

	const valueLabelWidth =
		valueLabelWidthProp ||
		getMaxValueLabelWidth({
			data: data.filter((it) => it.value >= 0),
			baseline,
			theme,
		});

	const negativeValueLabelWidth =
		negativeValueLabelWidthProp ||
		getMaxValueLabelWidth({
			data: data.filter((it) => it.value < 0),
			baseline,
			theme,
		});

	const negativeValueLabelMargin = hasNegativeValues
		? ibcsSizes.valueLabelMargin
		: 0;

	const barChartRowsRailSpec: TGridRailSpec = Array.from(
		{length: nrRows},
		(_, index) => {
			const items: TGridRailElementSpec[] = [];

			// Add top padding, if first index
			if (index === 0) {
				items.push({
					type: 'pixel',
					value: ibcsSizes.topPadding,
					name: 'topPadding',
				});
			}

			items.push({
				type: 'pixel',
				value: ibcsSizes.barHeight,
				name: 'dataItem',
			});

			// Add 'space' after each 'dataItem' except the last one
			if (index < nrRows - 1) {
				items.push({
					type: 'pixel',
					value: ibcsSizes.rowSpace,
					name: 'space',
				});
			}

			// Add bottom padding, if last index
			if (index === nrRows - 1) {
				items.push({
					type: 'pixel',
					value: ibcsSizes.bottomPadding,
					name: 'bottomPadding',
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
		{type: 'pixel', value: barMarginLeft, name: 'barMarginLeft'}, // TODO rename to labelMargin
		{type: 'pixel', value: negativeValueLabelWidth, name: 'negativeValueLabel'},
		{
			type: 'pixel',
			value: negativeValueLabelMargin,
			name: 'negativeValueLabelMargin',
		},
		{type: 'fr', value: 1, name: 'bar'},
		{
			type: 'pixel',
			value: ibcsSizes.valueLabelMargin,
			name: 'valueLabelMargin',
		},
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

	const getLabelArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const labelArea = getGridLayoutArea(chartLayout, [
				{positionOfType: i, name: 'dataItem'}, // start-row
				{name: 'label'}, // start-column
				{positionOfType: i, name: 'dataItem'}, // end-row
				{name: 'label'}, // end-column
			]);
			return labelArea;
		}

		const stringToIx = data.findIndex((it) => it.id === i);
		return getLabelArea(stringToIx);
	};

	const getBarArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const labelArea = getGridLayoutArea(chartLayout, [
				{positionOfType: i, name: 'dataItem'}, // start-row
				{name: 'bar'}, // start-column
				{positionOfType: i, name: 'dataItem'}, // end-row
				{name: 'bar'}, // end-column
			]);
			return labelArea;
		}

		const stringToIx = data.findIndex((it) => it.id === i);
		return getBarArea(stringToIx);
	};

	const getValueLabelArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const labelArea = getGridLayoutArea(chartLayout, [
				{positionOfType: i, name: 'dataItem'}, // start-row
				{name: 'valueLabel'}, // start-column
				{positionOfType: i, name: 'dataItem'}, // end-row
				{name: 'valueLabel'}, // end-column
			]);
			return labelArea;
		}

		const stringToIx = data.findIndex((it) => it.id === i);
		return getValueLabelArea(stringToIx);
	};

	const getNegativeValueLabelArea = (i: number | string): TGridLayoutArea => {
		if (typeof i === 'number') {
			const labelArea = getGridLayoutArea(chartLayout, [
				{positionOfType: i, name: 'dataItem'}, // start-row
				{name: 'negativeValueLabel'}, // start-column
				{positionOfType: i, name: 'dataItem'}, // end-row
				{name: 'negativeValueLabel'}, // end-column
			]);
			return labelArea;
		}

		const stringToIx = data.findIndex((it) => it.id === i);
		return getNegativeValueLabelArea(stringToIx);
	};

	const getZeroLineArea = () => {
		const zeroLineArea = getGridLayoutArea(chartLayout, [
			{name: 'topPadding'}, // start-row
			{name: 'bar'}, // start-column
			{name: 'bottomPadding'}, // end-row
			{name: 'bar'}, // end-column
		]);
		return zeroLineArea;
	};

	return {
		gridLayout: chartLayout,
		width: chartLayout.width,
		height: chartLayout.height,
		getLabelArea,
		getBarArea,
		getValueLabelArea,
		getNegativeValueLabelArea,
		getZeroLineArea,
	};
}
