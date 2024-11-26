import {extent} from 'd3-array';
import {isNumber} from 'lodash';
import invariant from 'tiny-invariant';
import {ScaleLinear, scaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../../../../acetti-layout';
import {
	getBarChartItemLayout,
	TBarChartItemLayout,
} from './getBarChartItemLayout';
import {TDynamicListTransitionContext} from '../../ListAnimation/useListTransition/useListTransition';
import {interpolate} from 'remotion';

type BarChartTransitionContext_Common = {
	xScale: ScaleLinear<number, number>;
	barChartItemLayout: TBarChartItemLayout; // TODO deprecate??? or average the from and to??
	plotArea: TGridLayoutArea;
};

export type BarChartTransitionContext_Enter =
	BarChartTransitionContext_Common & {
		transitionType: 'enter';
		to: {
			xScale: ScaleLinear<number, number>;
			barChartItemLayout: TBarChartItemLayout;
		};
	};

export type BarChartTransitionContext_Exit =
	BarChartTransitionContext_Common & {
		transitionType: 'exit';
		from: {
			xScale: ScaleLinear<number, number>;
			barChartItemLayout: TBarChartItemLayout;
		};
	};

export type BarChartTransitionContext_Update =
	BarChartTransitionContext_Common & {
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
	//
	const {width, easingPercentage} = listTransitionContext;

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
				: dataExtent[1] < 0
				? ([dataExtent[0], 0] as [number, number])
				: dataExtent;
		})();

	const xScale: ScaleLinear<number, number> = scaleLinear()
		.domain(domain)
		.range([0, xAxisWidth]);

	return xScale;
}
