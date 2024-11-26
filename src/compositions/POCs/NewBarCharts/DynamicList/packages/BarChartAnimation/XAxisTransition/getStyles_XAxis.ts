import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

export function getStyles({
	theme,
	baseline,
}: {
	theme: ThemeType;
	baseline: number;
}) {
	const tickLabelStyle = getTickLabelStyle({theme});
	const tickLabelTop = getTickLabelPositionTop({baseline, theme});

	return {
		tick: {
			size: getTickSize({theme, baseline}),
			// strokeWidth: theme.sizes.axisLineStrokeWidths.medium * baseline, TODO
			strokeWidth: theme.sizes.lineWidths.medium * baseline,
			color: theme.xAxis.tickColor,
		},
		tickLabel: {
			typographyStyle: tickLabelStyle,
			top: tickLabelTop,
		},
		line: {
			color: theme.xAxis.color,
			strokeWidth: theme.sizes.lineWidths.medium * baseline,
		},
	};
}

export function getXAxisHeight({
	theme,
	baseline,
}: {
	theme: ThemeType;
	baseline: number;
}) {
	const tickLabelStyle = getTickLabelStyle({theme});
	const tickLabelTop = getTickLabelPositionTop({baseline, theme});
	const tickLabelCapHeight = tickLabelStyle.capHeightInBaselines * baseline;

	return tickLabelTop + tickLabelCapHeight;
}

export function getXAxisMarginTop({
	// theme,
	baseline,
}: {
	// theme: ThemeType;
	baseline: number;
}) {
	const marginTopInBaselines = 1; // TODO from theme
	const marginTop = marginTopInBaselines * baseline;
	return marginTop;
}

function getTickSize({theme, baseline}: {theme: ThemeType; baseline: number}) {
	const tickSizeMedium = theme.sizes.axisTicks.medium;
	return baseline * tickSizeMedium;
}

function getTickLabelStyle({theme}: {theme: ThemeType}) {
	const tickLabelStyle = theme.typography.textStyles.datavizTickLabel;
	return tickLabelStyle;
}

function getTickLabelPositionTop({
	theme,
	baseline,
}: {
	theme: ThemeType;
	baseline: number;
}) {
	const marginInBaselines = 0.5; // TODO somewhere from theme

	const tickSize = getTickSize({baseline, theme});
	const marginToTick = marginInBaselines * baseline;

	const positionTop = tickSize + marginToTick;

	return positionTop;
}
