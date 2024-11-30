import {ThemeType} from '../../../../../../acetti-themes/themeTypes';
import {
	getXAxisHeight,
	getXAxisMarginTop,
} from './XAxisTransition/getStyles_XAxis';
import {getAllBarChartItemsHeight} from './useBarChartTransition/getBarChartItemLayout';

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

// // TODO think about top bar and bottom bar too....
// const THEME_IBCS_SIZES_HORIZONTAL_BARCHART_ITEM: IBCS_Sizes_HorizontalBarChartItem =
// 	{
// 		rows: {
// 			barMarginTop: 0.3,
// 			barHeight: 2,
// 			barMarginBottom: 0.3,
// 		},
// 		columns: {
// 			labelMargin: 1,
// 			valueLabelMargin: 0.75,
// 		},
// 	};

export function getPerfectBaselineForHeight({
	height,
	nrItems,
	theme,
	hideAxis,
	ibcsSizesSpec,
}: {
	height: number;
	nrItems: number;
	theme: ThemeType;
	hideAxis: boolean;
	ibcsSizesSpec: IBCS_Sizes_HorizontalBarChartItem;
}) {
	const referenceBaseline = 10;

	const xAxisHeight = hideAxis
		? 0
		: getXAxisHeight({theme, baseline: referenceBaseline});

	const xAxisMarginTop = hideAxis
		? 0
		: getXAxisMarginTop({baseline: referenceBaseline});

	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline: referenceBaseline,
		nrItems,
		ibcsSizesSpec,
	});

	const totalHeight = xAxisHeight + xAxisMarginTop + ibcsBarsHeight;
	const factor = height / totalHeight;

	return referenceBaseline * factor;
}

export function getPerfectHeightForBaseline({
	baseline,
	nrItems,
	theme,
	hideAxis,
	ibcsSizesSpec,
}: {
	baseline: number;
	nrItems: number;
	theme: ThemeType;
	hideAxis: boolean;
	ibcsSizesSpec: IBCS_Sizes_HorizontalBarChartItem;
}) {
	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline,
		nrItems,
		ibcsSizesSpec,
	});

	const xAxisHeight = hideAxis ? 0 : getXAxisHeight({theme, baseline});
	const xAxisMarginTop = hideAxis ? 0 : getXAxisMarginTop({baseline});

	return ibcsBarsHeight + xAxisHeight + xAxisMarginTop;
}
