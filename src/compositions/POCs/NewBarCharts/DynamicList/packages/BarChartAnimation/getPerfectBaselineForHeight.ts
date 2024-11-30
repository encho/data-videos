import {ThemeType} from '../../../../../../acetti-themes/themeTypes';
import {
	getXAxisHeight,
	getXAxisMarginTop,
} from './XAxisTransition/getStyles_XAxis';
import {getAllBarChartItemsHeight} from './useBarChartTransition/getBarChartItemLayout';

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
	ibcsSizesSpec: ThemeType['ibcsSizes']['barChartItem'];
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
	ibcsSizesSpec: ThemeType['ibcsSizes']['barChartItem'];
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
