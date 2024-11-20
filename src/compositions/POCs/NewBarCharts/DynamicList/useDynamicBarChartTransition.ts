import {extent} from 'd3-array';
import {isNumber} from 'lodash';
import invariant from 'tiny-invariant';
import {ScaleLinear, scaleLinear} from 'd3-scale';

import {
	createGridLayout,
	TGridRailSpec,
	TGridLayout,
	TGridLayoutAreaSpec,
	TGridLayoutArea,
} from '../../../../acetti-layout';

import {TDynamicListTransitionContext} from './useListTransition';
import {interpolate} from 'remotion';

type BarChartTransitionContext_Common = {
	xScale: ScaleLinear<number, number>;
	barChartItemLayout: TBarChartItemLayout;
	// TODO
	// barChartMotherLayoutAreas: {
	// 	labelsArea:
	// 	barsArea:
	// 	valueLabelsArea:
	// }
};

type BarChartTransitionContext_Enter = BarChartTransitionContext_Common & {
	transitionType: 'enter';
	to: {
		domain: [number, number]; // TODO deprecate, as present in xScale
		xScale: ScaleLinear<number, number>;
	};
};

type BarChartTransitionContext_Exit = BarChartTransitionContext_Common & {
	transitionType: 'exit';
	from: {
		domain: [number, number]; // TODO deprecate, as present in xScale
		xScale: ScaleLinear<number, number>;
	};
};

type BarChartTransitionContext_Update = BarChartTransitionContext_Common & {
	transitionType: 'update';
	from: {
		domain: [number, number]; // TODO deprecate, as present in xScale
		xScale: ScaleLinear<number, number>;
	};
	to: {
		domain: [number, number]; // TODO deprecate, as present in xScale
		xScale: ScaleLinear<number, number>;
	};
};

export type TDynamicBarChartTransitionContext =
	| BarChartTransitionContext_Enter
	| BarChartTransitionContext_Exit
	| BarChartTransitionContext_Update;

export type TBarChartItem = {
	id: string;
	label: string;
	valueLabel: string;
	value: number;
};

function getExtentAndScale({
	visibleItems,
	xAxisWidth,
}: {
	visibleItems: TBarChartItem[];
	xAxisWidth: number;
}): {
	domain: [number, number]; // TODO we could dprecate domain, as it is in xScale anyway
	xScale: ScaleLinear<number, number>;
} {
	const dataExtent = extent(visibleItems, (it) => it.value) as [number, number];

	invariant(isNumber(dataExtent[0]) && isNumber(dataExtent[1]));
	const domain =
		dataExtent[0] > 0 ? ([0, dataExtent[1]] as [number, number]) : dataExtent;

	const xScale: ScaleLinear<number, number> = scaleLinear()
		.domain(domain)
		.range([0, xAxisWidth]);

	return {domain, xScale};
}

// TODO, this actually represents only 1 animation step. the useListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useDynamicBarChartTransition({
	listTransitionContext, // TODO rename to listTransitionContext
	baseline,
	labelWidth,
	valueLabelWidth,
}: {
	listTransitionContext: TDynamicListTransitionContext<TBarChartItem>;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
}): TDynamicBarChartTransitionContext {
	const {width, itemHeight} = listTransitionContext;

	const barChartItemLayout = getBarChartItemLayout({
		height: itemHeight,
		width,
		baseline,
		labelWidth,
		valueLabelWidth,
	});

	// ***********************************************************************
	// return context for 'update' transitionType
	// ***********************************************************************
	if (listTransitionContext.transitionType === 'update') {
		const infoFrom = getExtentAndScale({
			visibleItems: listTransitionContext.from.visibleItems,
			xAxisWidth: barChartItemLayout.barArea.width,
		});

		const infoTo = getExtentAndScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayout.barArea.width,
		});

		const interpolatedExtent_0 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[infoFrom.domain[0], infoTo.domain[0]],
			{}
		);
		const interpolatedExtent_1 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[infoFrom.domain[1], infoTo.domain[1]],
			{}
		);

		const xScale: ScaleLinear<number, number> = scaleLinear()
			.domain([interpolatedExtent_0, interpolatedExtent_1] as [number, number])
			.range([0, barChartItemLayout.barArea.width]);

		return {
			transitionType: 'update',
			barChartItemLayout,
			xScale,
			from: infoFrom,
			to: infoTo,
		};
	}

	// ***********************************************************************
	// return context for 'enter' transitionType
	// ***********************************************************************
	if (listTransitionContext.transitionType === 'enter') {
		const infoTo = getExtentAndScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayout.barArea.width,
		});

		return {
			transitionType: 'enter',
			barChartItemLayout,
			xScale: infoTo.xScale,
			to: infoTo,
		};
	}

	invariant(listTransitionContext.transitionType === 'exit');
	const infoFrom = getExtentAndScale({
		visibleItems: listTransitionContext.from.visibleItems,
		xAxisWidth: barChartItemLayout.barArea.width,
	});

	// ***********************************************************************
	// return context for 'exit' transitionType
	// ***********************************************************************
	return {
		transitionType: 'exit',
		barChartItemLayout,
		xScale: infoFrom.xScale,
		from: infoFrom,
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
	valueLabelArea: TGridLayoutArea;
};

export function getBarChartItemLayout({
	height,
	width,
	baseline,
	labelWidth,
	valueLabelWidth,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
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
			value: labelWidth,
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
			value: valueLabelWidth,
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
			valueLabel: [
				{name: 'bar'},
				{name: 'valueLabel'},
				{name: 'bar'},
				{name: 'valueLabel'},
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
		valueLabelArea: gridLayout.areas.valueLabel,
		// width: gridLayout.width,
		// height: gridLayout.height,
		// getListItemArea,
		// getListItemPaddedArea,
		// getVisibleIndicesRange,
	};
}
