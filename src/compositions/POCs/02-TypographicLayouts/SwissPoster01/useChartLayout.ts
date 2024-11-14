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
	titleUpperSegmentInBaselines,
	titleLowerSegmentInBaselines,
	aboveTitleInBaselines,
	belowTitleInBaselines,
	horizontalMarginInBaselines,
	videoLowerSegmentInBaselines,
}: {
	baseline: number;
	width: number;
	height: number;
	titleWidthInPixel: number;
	titleUpperSegmentInBaselines: number;
	titleLowerSegmentInBaselines: number;
	aboveTitleInBaselines: number;
	belowTitleInBaselines: number;
	horizontalMarginInBaselines: number;
	videoLowerSegmentInBaselines: number;
}) {
	// TODO define in ibcs theme
	// *************************************
	const MARGIN_BOTTOM = Number(baseline);
	const MARGIN_TOP = Number(baseline);
	const MARGIN_LEFT = baseline * horizontalMarginInBaselines;
	const MARGIN_RIGHT = baseline * horizontalMarginInBaselines;

	const TITLE_UPPER_HEIGHT = titleUpperSegmentInBaselines * baseline;
	const TITLE_LOWER_HEIGHT = titleLowerSegmentInBaselines * baseline;
	const ABOVE_TITLE = aboveTitleInBaselines * baseline;
	const BELOW_TITLE = belowTitleInBaselines * baseline;
	const VIDEO_LOWER_SEGMENT = videoLowerSegmentInBaselines * baseline;

	const chartRowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: MARGIN_TOP, name: 'space'},
		{type: 'pixel', value: ABOVE_TITLE, name: 'above-title'},
		{type: 'pixel', value: TITLE_UPPER_HEIGHT, name: 'title-upper-row'},
		{type: 'pixel', value: TITLE_LOWER_HEIGHT, name: 'title-lower-row'},
		{type: 'pixel', value: VIDEO_LOWER_SEGMENT, name: 'video-lower-row'},
		// {type: 'pixel', value: BELOW_TITLE], name: 'below-title'},
		{type: 'pixel', value: BELOW_TITLE, name: 'below-title'},
		{type: 'pixel', value: MARGIN_BOTTOM, name: 'space'},
	];

	const chartColsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: MARGIN_LEFT, name: 'space'},
		// {type: 'fr', value: 0.5, name: 'space'},
		{type: 'fr', value: 1, name: 'left-col'},
		{type: 'pixel', value: titleWidthInPixel, name: 'title-col'},
		{type: 'fr', value: 1, name: 'right-col'},
		{type: 'pixel', value: MARGIN_RIGHT, name: 'space'},
		// {type: 'fr', value: 0.5, name: 'space'},
	];

	const chartGridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: chartRowsRailSpec,
		columns: chartColsRailSpec,
		areas: {
			title: [
				{name: 'title-upper-row'},
				{name: 'title-col'},
				{name: 'title-lower-row'},
				{name: 'title-col'},
			] as TGridLayoutAreaSpec,
			video: [
				{name: 'title-lower-row'},
				{name: 'left-col'},
				{name: 'video-lower-row'},
				{name: 'right-col'},
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
