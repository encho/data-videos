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
	// averageAreas,
} from '../../../../acetti-layout';

import {TDynamicListTransitionContext} from './useListTransition/useListTransition';
import {interpolate} from 'remotion';

type BarChartTransitionContext_Common = {
	xScale: ScaleLinear<number, number>;
	barChartItemLayout: TBarChartItemLayout; // TODO deprecate??? or average the from and to??
	plotArea: TGridLayoutArea;
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
		// mappedValue:
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
	value: number;
	color: string;
};

export function useBarChartTransition({
	listTransitionContext,
	baseline,
	labelWidth,
	valueLabelWidth,
	negativeValueLabelWidth,
	globalCustomDomain,
}: {
	listTransitionContext: TDynamicListTransitionContext<TBarChartItem>;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	globalCustomDomain?: [number, number]; // TODO would also be good to pass transition specific custom domains...
}): TBarChartTransitionContext {
	const {
		width,
		// itemHeight,
		easingPercentage,
	} = listTransitionContext;

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

		// TODO will be specific to current "from" transition spec.
		const itemHeightFrom = listTransitionContext.from.itemHeight;
		const negativeValueLabelWidthFrom = hasNegativeValuesFrom
			? negativeValueLabelWidth
			: 0;
		const negativeValueLabelWidthPercentageFrom =
			negativeValueLabelWidthFrom / negativeValueLabelWidth;

		// TODO will be specific to current "to" transition spec.
		const itemHeightTo = listTransitionContext.to.itemHeight;
		const negativeValueLabelWidthTo = hasNegativeValuesTo
			? negativeValueLabelWidth
			: 0;
		const negativeValueLabelWidthPercentageTo =
			negativeValueLabelWidthTo / negativeValueLabelWidth;

		const currentItemHeight = interpolate(
			easingPercentage,
			[0, 1],
			[itemHeightFrom, itemHeightTo]
		);
		const currentNegativeValueLabelWidth = interpolate(
			easingPercentage,
			[0, 1],
			[negativeValueLabelWidthFrom, negativeValueLabelWidthTo]
		);

		const currentNegativeValueLabelWidthPercentage =
			currentNegativeValueLabelWidth / negativeValueLabelWidth;

		const barChartItemLayoutFrom = getBarChartItemLayout({
			height: itemHeightFrom,
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth,
			negativeValueLabelWidthPercentage: negativeValueLabelWidthPercentageFrom,
		});

		const barChartItemLayoutTo = getBarChartItemLayout({
			height: itemHeightTo,
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth,
			negativeValueLabelWidthPercentage: negativeValueLabelWidthPercentageTo,
		});

		const barChartItemLayout = getBarChartItemLayout({
			height: currentItemHeight,
			width,
			baseline,
			labelWidth, // TODO this could also be zero!!!!
			valueLabelWidth,
			negativeValueLabelWidth,
			negativeValueLabelWidthPercentage:
				currentNegativeValueLabelWidthPercentage,
		});

		const xScaleFrom = getXScale({
			visibleItems: listTransitionContext.from.visibleItems,
			xAxisWidth: barChartItemLayoutFrom.barArea.width,
			customDomain: globalCustomDomain,
		});

		const xScaleTo = getXScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayoutTo.barArea.width,
			customDomain: globalCustomDomain,
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

		const xScale: ScaleLinear<number, number> = scaleLinear()
			.domain([interpolatedExtent_0, interpolatedExtent_1] as [number, number])
			.range([0, barChartItemLayout.barArea.width]);

		// determine plotArea
		const topListItemAreaFrom = listTransitionContext.from.getListItemArea(0);
		const bottomListItemAreaFrom = listTransitionContext.from.getListItemArea(
			listTransitionContext.from.visibleItems.length - 1
		);
		const plotAreaHeightFrom =
			bottomListItemAreaFrom.y2 - topListItemAreaFrom.y1;

		const topListItemAreaTo = listTransitionContext.to.getListItemArea(0);
		const bottomListItemAreaTo = listTransitionContext.to.getListItemArea(
			listTransitionContext.to.visibleItems.length - 1
		);
		const plotAreaHeightTo = bottomListItemAreaTo.y2 - topListItemAreaTo.y1;

		const plotArea_height = interpolate(
			easingPercentage,
			[0, 1],
			[plotAreaHeightFrom, plotAreaHeightTo]
		);

		const plotArea_y1 = interpolate(
			easingPercentage,
			[0, 1],
			[topListItemAreaFrom.y1, topListItemAreaTo.y1]
		);

		const plotArea_y2 = interpolate(
			easingPercentage,
			[0, 1],
			[topListItemAreaFrom.y2, topListItemAreaTo.y2]
		);

		const plotArea = {
			x1: barChartItemLayout.barArea.x1,
			x2: barChartItemLayout.barArea.width + barChartItemLayout.barArea.x1,
			y1: plotArea_y1,
			y2: plotArea_y2,
			width: barChartItemLayout.barArea.width,
			height: plotArea_height,
		};

		return {
			transitionType: 'update',
			barChartItemLayout,
			xScale,
			plotArea,
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
			height: listTransitionContext.to.itemHeight,
			width,
			baseline,
			labelWidth,
			valueLabelWidth,
			negativeValueLabelWidth,
			negativeValueLabelWidthPercentage: hasNegativeValuesTo ? 1 : 0,
		});

		const xScaleTo = getXScale({
			visibleItems: listTransitionContext.to.visibleItems,
			xAxisWidth: barChartItemLayoutTo.barArea.width,
			customDomain: globalCustomDomain,
		});

		// determine plotArea
		const topListItemAreaTo = listTransitionContext.to.getListItemArea(0);
		const bottomListItemAreaTo = listTransitionContext.to.getListItemArea(
			listTransitionContext.to.visibleItems.length - 1
		);

		const plotAreaTo_y1 = topListItemAreaTo.y1;
		const plotAreaTo_y2 = bottomListItemAreaTo.y2;
		const plotAreaTo_height = plotAreaTo_y2 - plotAreaTo_y1;

		const plotAreaTo = {
			x1: barChartItemLayoutTo.barArea.x1,
			x2: barChartItemLayoutTo.barArea.x2,
			y1: plotAreaTo_y1,
			y2: plotAreaTo_y2,
			width: barChartItemLayoutTo.barArea.width,
			height: plotAreaTo_height,
		};

		return {
			transitionType: 'enter',
			barChartItemLayout: barChartItemLayoutTo,
			xScale: xScaleTo,
			plotArea: plotAreaTo,
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
		height: listTransitionContext.from.itemHeight,
		width,
		baseline,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth,
		negativeValueLabelWidthPercentage: hasNegativeValuesFrom ? 1 : 0,
	});

	const xScaleFrom = getXScale({
		visibleItems: listTransitionContext.from.visibleItems,
		xAxisWidth: barChartItemLayoutFrom.barArea.width,
		customDomain: globalCustomDomain,
	});

	// determine plotArea
	const topListItemAreaFrom = listTransitionContext.from.getListItemArea(0);
	const bottomListItemAreaFrom = listTransitionContext.from.getListItemArea(
		listTransitionContext.from.visibleItems.length - 1
	);

	const plotAreaFrom_y1 = topListItemAreaFrom.y1;
	const plotAreaFrom_y2 = bottomListItemAreaFrom.y2;
	const plotAreaFrom_height = plotAreaFrom_y2 - plotAreaFrom_y1;

	const plotAreaFrom = {
		x1: barChartItemLayoutFrom.barArea.x1,
		x2: barChartItemLayoutFrom.barArea.x2,
		y1: plotAreaFrom_y1,
		y2: plotAreaFrom_y2,
		width: barChartItemLayoutFrom.barArea.width,
		height: plotAreaFrom_height,
	};

	return {
		transitionType: 'exit',
		barChartItemLayout: barChartItemLayoutFrom,
		xScale: xScaleFrom,
		plotArea: plotAreaFrom,
		from: {xScale: xScaleFrom, barChartItemLayout: barChartItemLayoutFrom},
	};
}

function getXScale({
	visibleItems,
	xAxisWidth,
	customDomain,
}: {
	visibleItems: TBarChartItem[];
	xAxisWidth: number;
	customDomain?: [number, number];
}): ScaleLinear<number, number> {
	const domain =
		customDomain ||
		(() => {
			const dataExtent = extent(visibleItems, (it) => it.value) as [
				number,
				number
			];
			invariant(isNumber(dataExtent[0]) && isNumber(dataExtent[1]));
			return dataExtent[0] > 0
				? ([0, dataExtent[1]] as [number, number])
				: dataExtent;
		})();

	const xScale: ScaleLinear<number, number> = scaleLinear()
		.domain(domain)
		.range([0, xAxisWidth]);

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
	valueLabelWidth,
	negativeValueLabelWidth,
	negativeValueLabelWidthPercentage,
}: {
	height: number;
	width: number;
	baseline: number;
	labelWidth: number;
	valueLabelWidth: number;
	negativeValueLabelWidth: number;
	negativeValueLabelWidthPercentage: number;
}): TBarChartItemLayout {
	const ibcsSizes = getIbcsSizes(baseline);

	const rows: TGridRailSpec = [
		{
			type: 'pixel',
			value: ibcsSizes.marginTop,
			name: 'marginTop',
		},
		// {
		// 	type: 'pixel',
		// 	value: ibcsSizes.barHeight,
		// 	name: 'bar',
		// },
		{
			type: 'fr',
			value: 1,
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
			type: 'pixel',
			value: negativeValueLabelWidth * negativeValueLabelWidthPercentage,
			name: 'negativeValueLabel',
		},
		{
			type: 'pixel',
			value: 20 * negativeValueLabelWidthPercentage,
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
