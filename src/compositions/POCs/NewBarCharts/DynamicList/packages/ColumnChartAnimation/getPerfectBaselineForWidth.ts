import {ThemeType} from '../../../../../../acetti-themes/themeTypes';
import {
	getXAxisHeight,
	getXAxisMarginTop,
} from './XAxisTransition/getStyles_XAxis';
import {getAllColumnChartItemsWidth} from './useColumnChartTransition/getColumnChartItemLayout';

export function getPerfectBaselineForWidth({
	width,
	nrItems,
	theme,
	hideAxis,
	ibcsSizesSpec,
}: {
	width: number;
	nrItems: number;
	theme: ThemeType;
	hideAxis: boolean;
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
}) {
	const referenceBaseline = 10;

	// const xAxisHeight = hideAxis
	// 	? 0
	// 	: getXAxisHeight({theme, baseline: referenceBaseline});
	// TODO implement fully
	const yAxisWidth = 0;

	// const yAxisMarginSide = hideAxis
	// 	? 0
	// 	: getXAxisMarginTop({baseline: referenceBaseline});
	// TODO implement fully
	const yAxisMarginSide = 0;

	const ibcsColumnsWidth = getAllColumnChartItemsWidth({
		baseline: referenceBaseline,
		nrItems,
		ibcsSizesSpec,
	});

	const totalWidth = yAxisWidth + yAxisMarginSide + ibcsColumnsWidth;
	const factor = width / totalWidth;

	return referenceBaseline * factor;
}

export function getPerfectWidthForBaseline({
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
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
}) {
	const ibcsColumnsWidth = getAllColumnChartItemsWidth({
		baseline,
		nrItems,
		ibcsSizesSpec,
	});

	// const xAxisHeight = hideAxis ? 0 : getXAxisHeight({theme, baseline});
	// const xAxisMarginTop = hideAxis ? 0 : getXAxisMarginTop({baseline});

	// TODO implement fully
	const yAxisWidth = 0;
	const yAxisMarginSide = 0;

	return ibcsColumnsWidth + yAxisMarginSide + yAxisWidth;
}
