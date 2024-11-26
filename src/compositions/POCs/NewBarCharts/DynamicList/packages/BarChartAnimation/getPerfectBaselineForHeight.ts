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
	const remainingSpaceForBars =
		height -
		getXAxisHeight({theme, baseline: referenceBaseline}) -
		getXAxisMarginTop({baseline: referenceBaseline});

	const ibcsBarsHeight = getAllBarChartItemsHeight({
		baseline: referenceBaseline,
		nrItems,
	});

	const baselineFactor = remainingSpaceForBars / ibcsBarsHeight;

	return referenceBaseline * baselineFactor;
}
