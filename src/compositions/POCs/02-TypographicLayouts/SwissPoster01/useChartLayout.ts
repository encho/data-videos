import {
	TGridLayoutAreaSpec,
	TGridRailSpec,
	useGridLayout,
} from '../../../../acetti-layout';

export function useChartLayout({
	width,
	height,
	baseline,
	titleWidthInPixel,
	titleHeightInBaselines,
	aboveTitleInBaselines,
	belowTitleInBaselines,
	horizontalMarginInBaselines,
}: {
	baseline: number;
	width: number;
	height: number;
	titleWidthInPixel: number;
	titleHeightInBaselines: number;
	aboveTitleInBaselines: number;
	belowTitleInBaselines: number;
	horizontalMarginInBaselines: number;
}) {
	// TODO define in ibcs theme
	// *************************************
	const MARGIN_BOTTOM = baseline * 1;
	const MARGIN_TOP = baseline * 1;
	const MARGIN_LEFT = baseline * horizontalMarginInBaselines;
	const MARGIN_RIGHT = baseline * horizontalMarginInBaselines;

	const TITLE_HEIGHT = titleHeightInBaselines * baseline;
	const ABOVE_TITLE = aboveTitleInBaselines * baseline;
	const BELOW_TITLE = belowTitleInBaselines * baseline;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: MARGIN_TOP, name: 'space'},
		{type: 'pixel', value: ABOVE_TITLE, name: 'above-title'},
		{type: 'pixel', value: TITLE_HEIGHT, name: 'title-row'},
		// {type: 'pixel', value: BELOW_TITLE], name: 'below-title'},
		{type: 'pixel', value: BELOW_TITLE, name: 'below-title'},
		{type: 'pixel', value: MARGIN_BOTTOM, name: 'space'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: MARGIN_LEFT, name: 'space'},
		{type: 'fr', value: 1, name: 'left-col'},
		{type: 'pixel', value: titleWidthInPixel, name: 'title-col'},
		{type: 'fr', value: 1, name: 'right-col'},
		{type: 'pixel', value: MARGIN_RIGHT, name: 'space'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			title: [
				{name: 'title-row'},
				{name: 'title-col'},
				{name: 'title-row'},
				{name: 'title-col'},
			] as TGridLayoutAreaSpec,
		},
	};

	const chartLayout = useGridLayout({
		width,
		height,
		gridLayoutSpec: chartGridLayoutSpec,
	});

	return chartLayout;
}
