import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {TSimpleBarChartData} from './SimpleBarChart';
import {getTextDimensions} from '../../acetti-typography/CapSizeTextNew';
import {ThemeType} from '../../acetti-themes/themeTypes';

// IBCS style baseline driven sizes
function getLayoutSizes({baseline}: {baseline: number}) {
	// TODO columnSpace is wrong term, we need to split it up to
	// labelToLineDistance, lineToBarDistance, barToValueLabelDistance
	return {
		barHeight: baseline * 2,
		rowSpace: baseline * 0.5,
		columnSpace: baseline * 0.7,
	};
}

export function useBarChartLayout2({
	baseline,
	width,
	data,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	theme,
}: {
	theme: ThemeType;
	baseline: number;
	width: number;
	data: TSimpleBarChartData;
	labelWidth?: number;
	valueLabelWidth?: number;
}) {
	const nrColumns = 3;
	const nrRows = data.length;

	const sizes = getLayoutSizes({baseline});

	// TODO eventually use this, to introduce zero-line
	const ROW_PADDING = baseline * 0;

	// =========================================
	const barChartHeight =
		nrRows * sizes.barHeight + (nrRows - 1) * sizes.rowSpace + 2 * ROW_PADDING;

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

	const matrixLayout = useMatrixLayout({
		width,
		height: barChartHeight,
		nrColumns,
		nrRows,
		rowSpacePixels: sizes.rowSpace,
		columnSpacePixels: sizes.columnSpace,
		columnSizes: [
			{type: 'pixel', value: labelWidth},
			{type: 'fr', value: 1},
			{type: 'pixel', value: valueLabelWidth},
		],
		rowPaddingPixels: ROW_PADDING,
	});

	const getLabelArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 0});
	};

	const getBarArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 1});
	};

	const getValueLabelArea = (i: number) => {
		return getMatrixLayoutCellArea({layout: matrixLayout, row: i, column: 2});
	};

	return {
		gridLayout: matrixLayout,
		getLabelArea,
		getBarArea,
		getValueLabelArea,
		width: matrixLayout.width,
		height: matrixLayout.height,
		// getZeroLineArea(); // TODO
	};
}
