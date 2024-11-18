import {extent} from 'd3-array';
import {isNumber} from 'lodash';
import invariant from 'tiny-invariant';
import {ScaleLinear, scaleLinear} from 'd3-scale';

// import {getGridLayoutArea} from '../../../../acetti-layout/gridLayout';
import {
	// useGridLayout,
	createGridLayout,
	TGridRailSpec,
	// TGridRailElementSpec,
	// TGridLayoutArea,
	TGridLayout,
	// TGridAreasSpec,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../acetti-layout';

// import {TGr} from '../../../../acetti-layout';
// import {useDynamicListLayout} from './useDynamicListLayout';
import {TDynamicListTransitionContext} from './useDynamicListTransition';
import {interpolate} from 'remotion';

// type Item = {id: string};

export type TDynamicBarChartTransitionContext = {
	// getLabelAreaFrom: (i: number | string) => TGridLayoutArea;
	// getBarAreaFrom: (i: number | string) => TGridLayoutArea;
	// getValueLabelAreaFrom: (i: number | string) => TGridLayoutArea;
	// getLabelAreaTo: (i: number | string) => TGridLayoutArea;
	// getBarAreaTo: (i: number | string) => TGridLayoutArea;
	// getValueLabelAreaTo: (i: number | string) => TGridLayoutArea;
	//
	// getUpdateInfos: () => {area: TGridLayoutArea; id: string};
	// getEnterInfos: () => {area: TGridLayoutArea; id: string};
	// getExitInfos: () => {area: TGridLayoutArea; id: string};
	// getAppearInfos: () => {area: TGridLayoutArea; id: string};
	// getDisappearInfos: () => {area: TGridLayoutArea; id: string};
	//
	// yScaleFrom: LinearScale<>;
	// yScaleTo: LinearScale<>;
	// yScale: LinearScale<>;
	//
	extentFrom: [number, number];
	extentTo: [number, number];
	//
	xScaleFrom: ScaleLinear<number, number>;
	xScaleTo: ScaleLinear<number, number>;
	xScale: ScaleLinear<number, number>;
	//
	barChartItemLayout: TBarChartItemLayout;
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useDynamicBarChartTransition({
	context,
	baseline,
}: {
	context: TDynamicListTransitionContext<{
		id: string;
		value: number;
		label: string;
		valueLabel: string;
	}>;
	baseline: number;
}): TDynamicBarChartTransitionContext {
	const {visibleItemsFrom, visibleItemsTo, width, itemHeight} = context;

	const extentFrom = extent(visibleItemsFrom, (it) => it.value) as [
		number,
		number
	];
	invariant(isNumber(extentFrom[0]) && isNumber(extentFrom[1]));

	const extentTo = extent(visibleItemsTo, (it) => it.value) as [number, number];
	invariant(isNumber(extentTo[0]) && isNumber(extentTo[1]));

	const barChartItemLayout = getBarChartItemLayout({
		height: itemHeight,
		width,
		baseline,
	});

	const xScaleFrom: ScaleLinear<number, number> = scaleLinear()
		.domain(extentFrom)
		.range([0, barChartItemLayout.barArea.width]);

	const xScaleTo: ScaleLinear<number, number> = scaleLinear()
		.domain(extentTo)
		.range([0, barChartItemLayout.barArea.width]);

	const interpolatedExtent_0 = interpolate(
		context.frame,
		[0, context.durationInFrames - 1],
		[extentFrom[0], extentTo[0]],
		{}
	);
	const interpolatedExtent_1 = interpolate(
		context.frame,
		[0, context.durationInFrames - 1],
		[extentFrom[1], extentTo[1]],
		{}
	);

	const xScale: ScaleLinear<number, number> = scaleLinear()
		.domain([interpolatedExtent_0, interpolatedExtent_1] as [number, number])
		.range([0, barChartItemLayout.barArea.width]);

	return {
		extentFrom,
		extentTo,
		xScaleFrom,
		xScaleTo,
		xScale,
		barChartItemLayout,
	};
}

export function getIbcsSizes(baseline: number) {
	// TODO from theme
	const ibcsSizes = {
		// rows
		marginTop: baseline * 0.75,
		barHeight: baseline * 2,
		marginBottom: baseline * 0.75,
		// columns
		labelMarginRight: baseline * 0.9,
		valueLabelMarginRight: baseline * 0.9,
	};

	return ibcsSizes;
}

// TODO account for flag includeSecondaryBars
export function getBarChartItemHeight({baseline}: {baseline: number}) {
	const ibcsSizes = getIbcsSizes(baseline);

	// TODO also upperBar and lowerBar should be taken into consideration
	const barChartItemHeight =
		ibcsSizes.marginTop + ibcsSizes.barHeight + ibcsSizes.marginBottom;

	return barChartItemHeight;
}

export type TBarChartItemLayout = {
	gridLayout: TGridLayout;
	barArea: TGridLayoutArea;
	labelArea: TGridLayoutArea;
	// width: number;
	// height: number;
	// getListItemArea: (i: number | string) => TGridLayoutArea;
	// getListItemPaddedArea: (i: number | string) => TGridLayoutArea;
	// getVisibleIndicesRange: (
	// 	visibleIndices: [number, number]
	// ) => [number, number];
};

export function getBarChartItemLayout({
	height,
	width,
	baseline,
}: {
	height: number;
	width: number;
	baseline: number;
}): TBarChartItemLayout {
	const ibcsSizes = getIbcsSizes(baseline);

	const rows: TGridRailSpec = [
		{
			type: 'pixel',
			value: ibcsSizes.marginTop,
			name: 'marginTop',
		},
		{
			type: 'pixel',
			value: ibcsSizes.barHeight,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: ibcsSizes.marginBottom,
			name: 'marginBottom',
		},
	];

	const columns: TGridRailSpec = [
		{
			type: 'pixel',
			value: 200,
			name: 'label',
		},
		{
			type: 'pixel',
			value: 20,
			name: 'labelMarginRight',
		},
		{
			type: 'fr',
			value: 1,
			name: 'bar',
		},
		{
			type: 'pixel',
			value: 20,
			name: 'valueLabelMarginLeft',
		},
		{
			type: 'pixel',
			value: 100,
			name: 'valueLabel',
		},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		// rows: paddedRows,
		rows,
		columns,
		areas: {
			bar: [
				{name: 'bar'},
				{name: 'bar'},
				{name: 'bar'},
				{name: 'bar'},
			] as TGridLayoutAreaSpec,
			label: [
				{name: 'bar'},
				{name: 'label'},
				{name: 'bar'},
				{name: 'label'},
			] as TGridLayoutAreaSpec,
		},
	};

	const gridLayout = createGridLayout(gridLayoutSpec, {
		width,
		height,
	});

	// const gridLayout = useGridLayout({
	// 	width: area.width,
	// 	height: area.height,
	// 	gridLayoutSpec,
	// });

	return {
		gridLayout,
		barArea: gridLayout.areas.bar,
		labelArea: gridLayout.areas.label,
		// width: gridLayout.width,
		// height: gridLayout.height,
		// getListItemArea,
		// getListItemPaddedArea,
		// getVisibleIndicesRange,
	};
}
