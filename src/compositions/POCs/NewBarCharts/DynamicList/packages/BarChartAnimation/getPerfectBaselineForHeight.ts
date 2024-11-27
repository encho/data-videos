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
}: {
	height: number;
	nrItems: number;
	theme: ThemeType;
}) {
	const referenceBaseline = 10;

	const xAxisHeight = getXAxisHeight({theme, baseline: referenceBaseline});
	const xAxisMarginTop = getXAxisMarginTop({baseline: referenceBaseline});
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
}: {
	baseline: number;
	nrItems: number;
	theme: ThemeType;
}) {
	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline,
		nrItems,
	});
	const xAxisHeight = getXAxisHeight({theme, baseline});
	const xAxisMarginTop = getXAxisMarginTop({baseline});

	return ibcsBarsHeight + xAxisHeight + xAxisMarginTop;
}
