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
}: {
	height: number;
	nrItems: number;
	theme: ThemeType;
	hideAxis: boolean;
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
}: {
	baseline: number;
	nrItems: number;
	theme: ThemeType;
	hideAxis: boolean;
}) {
	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline,
		nrItems,
	});

	const xAxisHeight = hideAxis ? 0 : getXAxisHeight({theme, baseline});
	const xAxisMarginTop = hideAxis ? 0 : getXAxisMarginTop({baseline});

	return ibcsBarsHeight + xAxisHeight + xAxisMarginTop;
}
