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

import {TDynamicListTransitionContext} from './useListTransition/useListTransition';
import {interpolate} from 'remotion';

type BarChartTransitionContext_Common = {
	xScale: ScaleLinear<number, number>;
	barChartItemLayout: TBarChartItemLayout; // TODO deprecate??? or average the from and to??
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
		xScale: ScaleLinear<number, number>;
		barChartItemLayout: TBarChartItemLayout;
	};
};

type BarChartTransitionContext_Exit = BarChartTransitionContext_Common & {
	transitionType: 'exit';
	from: {
		xScale: ScaleLinear<number, number>;
		barChartItemLayout: TBarChartItemLayout;
	};
};

type BarChartTransitionContext_Update = BarChartTransitionContext_Common & {
	transitionType: 'update';
	from: {
		xScale: ScaleLinear<number, number>;
		barChartItemLayout: TBarChartItemLayout;
	};
	to: {
		xScale: ScaleLinear<number, number>;
		barChartItemLayout: TBarChartItemLayout;
	};
};

export type TBarChartTransitionContext =
	| BarChartTransitionContext_Enter
	| BarChartTransitionContext_Exit
	| BarChartTransitionContext_Update;

export type TBarChartItem = {
	id: string;
	label: string;
	valueLabel: string;
	value: number;
};

export function useBarChartTransition({
	listTransitionContext,
	baseline,
	labelWidth,
	valueLabelWidth,
	negativeValueLabelWidth,
}: {
	listTransitionContext: TDynamicListTransitionContext<TBarChartItem>;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
}): TBarChartTransitionContext {
	const {width, itemHeight} = listTransitionContext;

	// TODO we need a barChartItemLayout for from and to, and an averaged one for the 'update' case
	// const barChartItemLayout = getBarChartItemLayout({
	// 	height: itemHeight,
	// 	width,
	// 	baseline,
	// 	labelWidth,
	// 	valueLabelWidth,
	// 	negativeValueLabelWidth,
	// });

	// ***********************************************************************
	// return context for 'update' transitionType
	// ***********************************************************************
	if (listTransitionContext.transitionType === 'update') {
		const hasNegativeValuesFrom = listTransitionContext.from.visibleItems.some(
			(it) => it.value < 0
		);
		const hasNegativeValuesTo = listTransitionContext.to.visibleItems.some(
			(it) => it.value < 0
		);

		const barChartItemLayoutFrom = getBarChartItemLayout({
			height: itemHeight, // TODO will be specific to current "from" spec.
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth: hasNegativeValuesFrom
				? negativeValueLabelWidth
				: 0,
		});

		const barChartItemLayoutTo = getBarChartItemLayout({
			height: itemHeight, // TODO will be specific to current "from" spec.
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth: hasNegativeValuesTo
				? negativeValueLabelWidth
				: 0,
		});

		const xScaleFrom = getXScale({
			visibleItems: listTransitionContext.from.visibleItems,
			xAxisWidth: barChartItemLayoutFrom.barArea.width,
		});

		const xScaleTo = getXScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayoutTo.barArea.width,
		});

		const interpolatedExtent_0 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[xScaleFrom.domain()[0], xScaleTo.domain()[0]],
			{}
		);
		const interpolatedExtent_1 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[xScaleFrom.domain()[1], xScaleTo.domain()[1]],
			{}
		);

		// TODO interpolateBarChartItemLayouts(from, to, easingPerc...?)
		const barChartItemLayout = barChartItemLayoutTo;

		const xScale: ScaleLinear<number, number> = scaleLinear()
			.domain([interpolatedExtent_0, interpolatedExtent_1] as [number, number])
			.range([0, barChartItemLayout.barArea.width]);

		return {
			transitionType: 'update',
			barChartItemLayout,
			xScale,
			from: {xScale: xScaleFrom, barChartItemLayout: barChartItemLayoutFrom},
			to: {xScale: xScaleTo, barChartItemLayout: barChartItemLayoutTo},
		};
	}

	// ***********************************************************************
	// return context for 'enter' transitionType
	// ***********************************************************************
	if (listTransitionContext.transitionType === 'enter') {
		const hasNegativeValuesTo = listTransitionContext.to.visibleItems.some(
			(it) => it.value < 0
		);

		const barChartItemLayoutTo = getBarChartItemLayout({
			height: itemHeight, // TODO will be specific to current "from" spec.
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth: hasNegativeValuesTo
				? negativeValueLabelWidth
				: 0,
		});

		const xScaleTo = getXScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayoutTo.barArea.width,
		});

		return {
			transitionType: 'enter',
			barChartItemLayout: barChartItemLayoutTo,
			xScale: xScaleTo,
			to: {xScale: xScaleTo, barChartItemLayout: barChartItemLayoutTo},
		};
	}

	// ***********************************************************************
	// return context for 'exit' transitionType
	// ***********************************************************************
	invariant(listTransitionContext.transitionType === 'exit');
	const hasNegativeValuesFrom = listTransitionContext.from.visibleItems.some(
		(it) => it.value < 0
	);

	const barChartItemLayoutFrom = getBarChartItemLayout({
		height: itemHeight, // TODO will be specific to current "from" spec.
		width,
		baseline,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth: hasNegativeValuesFrom
			? negativeValueLabelWidth
			: 0,
	});

	const xScaleFrom = getXScale({
		visibleItems: listTransitionContext.from.visibleItems,
		xAxisWidth: barChartItemLayoutFrom.barArea.width,
	});

	return {
		transitionType: 'exit',
		barChartItemLayout: barChartItemLayoutFrom,
		xScale: xScaleFrom,
		from: {xScale: xScaleFrom, barChartItemLayout: barChartItemLayoutFrom},
	};
}

function getXScale({
	visibleItems,
	xAxisWidth,
}: {
	visibleItems: TBarChartItem[];
	xAxisWidth: number;
}): ScaleLinear<number, number> {
	const dataExtent = extent(visibleItems, (it) => it.value) as [number, number];

	invariant(isNumber(dataExtent[0]) && isNumber(dataExtent[1]));
	const domain =
		dataExtent[0] > 0 ? ([0, dataExtent[1]] as [number, number]) : dataExtent;

	const xScale: ScaleLinear<number, number> = scaleLinear()
		.domain(domain)
		.range([0, xAxisWidth]);

	// return {domain, xScale};
	// return {xScale};
	return xScale;
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

// export function getBarChartItemHeight({baseline}: {baseline: number}) {
// 	const layout = getBarChartItemLayout({baseline, height});
// }

export type TBarChartItemLayout = {
	gridLayout: TGridLayout;
	barArea: TGridLayoutArea;
	labelArea: TGridLayoutArea;
	valueLabelArea: TGridLayoutArea;
	negativeValueLabelArea: TGridLayoutArea;
};

export function getBarChartItemLayout({
	height,
	width,
	baseline,
	labelWidth,
	negativeValueLabelWidth,
	valueLabelWidth,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
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
		{type: 'pixel', value: negativeValueLabelWidth, name: 'negativeValueLabel'},
		{
			type: 'pixel',
			value: negativeValueLabelWidth ? 20 : 0,
			name: 'negativeValueLabelMarginRight',
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
			negativeValueLabel: [
				{name: 'bar'},
				{name: 'negativeValueLabel'},
				{name: 'bar'},
				{name: 'negativeValueLabel'},
			] as TGridLayoutAreaSpec,
		},
	};

	const gridLayout = createGridLayout(gridLayoutSpec, {
		width,
		height,
	});

	return {
		gridLayout,
		barArea: gridLayout.areas.bar,
		labelArea: gridLayout.areas.label,
		valueLabelArea: gridLayout.areas.valueLabel,
		negativeValueLabelArea: gridLayout.areas.negativeValueLabel,
	};
}
