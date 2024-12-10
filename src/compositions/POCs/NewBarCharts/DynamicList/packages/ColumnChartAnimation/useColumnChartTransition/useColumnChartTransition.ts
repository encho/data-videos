import {extent} from 'd3-array';
import {isNumber} from 'lodash';
import {z} from 'zod';
import invariant from 'tiny-invariant';
import {ScaleLinear, scaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../../../../acetti-layout';
import {
	getColumnChartItemLayout,
	TColumnChartItemLayout,
} from './getColumnChartItemLayout';
import {TDynamicListTransitionContext} from '../../ListAnimation/useListTransition/useListTransition';
import {interpolate} from 'remotion';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';
import {zColor} from '@remotion/zod-types';

type ColumnChartTransitionContext_Common = {
	yScale: ScaleLinear<number, number>;
	columnChartItemLayout: TColumnChartItemLayout; // deprecate??? or average the from and to??
	plotArea: TGridLayoutArea;
};

export type ColumnChartTransitionContext_Enter =
	ColumnChartTransitionContext_Common & {
		transitionType: 'enter';
		to: {
			yScale: ScaleLinear<number, number>;
			columnChartItemLayout: TColumnChartItemLayout;
		};
	};

export type ColumnChartTransitionContext_Exit =
	ColumnChartTransitionContext_Common & {
		transitionType: 'exit';
		from: {
			yScale: ScaleLinear<number, number>;
			columnChartItemLayout: TColumnChartItemLayout;
		};
	};

export type ColumnChartTransitionContext_Update =
	ColumnChartTransitionContext_Common & {
		transitionType: 'update';
		from: {
			yScale: ScaleLinear<number, number>;
			columnChartItemLayout: TColumnChartItemLayout;
		};
		to: {
			yScale: ScaleLinear<number, number>;
			columnChartItemLayout: TColumnChartItemLayout;
		};
	};

export type TColumnChartTransitionContext =
	| ColumnChartTransitionContext_Enter
	| ColumnChartTransitionContext_Exit
	| ColumnChartTransitionContext_Update;

export const zColumnChartItem = z.object({
	label: z.string(),
	value: z.number(),
	id: z.string(),
	color: zColor(),
});

export const zColumnChartItems = z.array(zColumnChartItem);

export type TColumnChartItem = z.infer<typeof zColumnChartItem>;

export type TColumnChartItems = z.infer<typeof zColumnChartItems>;

export function useColumnChartTransition({
	listTransitionContext,
	baseline,
	labelHeight,
	valueLabelHeight,
	negativeValueLabelHeight,
	forceNegativeValueLabelHeight = false,
	globalCustomDomain,
	ibcsSizesSpec,
}: {
	listTransitionContext: TDynamicListTransitionContext<TColumnChartItem>;
	baseline: number;
	ibcsSizesSpec: ThemeType['ibcsSizes']['columnChartItem'];
	labelHeight: number;
	valueLabelHeight: number;
	negativeValueLabelHeight: number;
	forceNegativeValueLabelHeight?: boolean;
	globalCustomDomain?: [number, number]; // TODO would also be good to pass transition specific custom domains...
}): TColumnChartTransitionContext {
	const {height, easingPercentage} = listTransitionContext;

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
		const itemWidthFrom = listTransitionContext.from.itemSize;
		const negativeValueLabelHeightFrom =
			hasNegativeValuesFrom || forceNegativeValueLabelHeight
				? negativeValueLabelHeight
				: 0;
		const negativeValueLabelHeightPercentageFrom =
			negativeValueLabelHeightFrom / negativeValueLabelHeight;

		// TODO will be specific to current "to" transition spec.
		const itemWidthTo = listTransitionContext.to.itemSize;
		const negativeValueLabelHeightTo =
			hasNegativeValuesTo || forceNegativeValueLabelHeight
				? negativeValueLabelHeight
				: 0;
		const negativeValueLabelHeightPercentageTo =
			negativeValueLabelHeightTo / negativeValueLabelHeight;

		const currentItemWidth = interpolate(
			easingPercentage,
			[0, 1],
			[itemWidthFrom, itemWidthTo]
		);
		const currentNegativeValueLabelHeight = interpolate(
			easingPercentage,
			[0, 1],
			[negativeValueLabelHeightFrom, negativeValueLabelHeightTo]
		);

		const currentNegativeValueLabelHeightPercentage =
			negativeValueLabelHeight === 0
				? negativeValueLabelHeight
				: currentNegativeValueLabelHeight / negativeValueLabelHeight;

		const columnChartItemLayoutFrom = getColumnChartItemLayout({
			height,
			width: itemWidthFrom,
			baseline,
			labelHeight,
			valueLabelHeight,
			negativeValueLabelHeight,
			negativeValueLabelHeightPercentage:
				negativeValueLabelHeightPercentageFrom,
			ibcsSizesSpec,
		});

		const columnChartItemLayoutTo = getColumnChartItemLayout({
			height,
			width: itemWidthTo,
			baseline,
			labelHeight,
			valueLabelHeight,
			negativeValueLabelHeight,
			negativeValueLabelHeightPercentage: negativeValueLabelHeightPercentageTo,
			ibcsSizesSpec,
		});

		const columnChartItemLayout = getColumnChartItemLayout({
			height,
			width: currentItemWidth,
			baseline,
			labelHeight,
			valueLabelHeight,
			negativeValueLabelHeight,
			negativeValueLabelHeightPercentage:
				currentNegativeValueLabelHeightPercentage,
			ibcsSizesSpec,
		});

		const yScaleFrom = getYScale({
			visibleItems: listTransitionContext.from.visibleItems,
			yAxisHeight: columnChartItemLayoutFrom.columnArea.height,
			customDomain: globalCustomDomain,
		});

		const yScaleTo = getYScale({
			visibleItems: listTransitionContext.to.visibleItems,
			yAxisHeight: columnChartItemLayoutTo.columnArea.height,
			customDomain: globalCustomDomain,
		});

		const interpolatedExtent_0 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[yScaleFrom.domain()[0], yScaleTo.domain()[0]],
			{}
		);
		const interpolatedExtent_1 = interpolate(
			listTransitionContext.frame,
			[0, listTransitionContext.durationInFrames - 1],
			[yScaleFrom.domain()[1], yScaleTo.domain()[1]],
			{}
		);

		const yScale: ScaleLinear<number, number> = scaleLinear()
			.domain([interpolatedExtent_0, interpolatedExtent_1] as [number, number])
			.range([columnChartItemLayout.columnArea.height, 0]);

		// determine plotArea
		// ----------------------------------------------------------------------
		const firstListItemAreaFrom = listTransitionContext.from.getListItemArea(0);
		const lastListItemAreaFrom = listTransitionContext.from.getListItemArea(
			listTransitionContext.from.visibleItems.length - 1
		);
		const plotAreaWidthFrom =
			lastListItemAreaFrom.x2 - firstListItemAreaFrom.x1;

		const firstListItemAreaTo = listTransitionContext.to.getListItemArea(0);
		const lastListItemAreaTo = listTransitionContext.to.getListItemArea(
			listTransitionContext.to.visibleItems.length - 1
		);
		const plotAreaWidthTo = lastListItemAreaTo.x2 - firstListItemAreaTo.x1;

		const plotArea_width = interpolate(
			easingPercentage,
			[0, 1],
			[plotAreaWidthFrom, plotAreaWidthTo]
		);

		const plotArea_x1 = interpolate(
			easingPercentage,
			[0, 1],
			[firstListItemAreaFrom.x1, firstListItemAreaTo.x1]
		);

		const plotArea_x2 = interpolate(
			easingPercentage,
			[0, 1],
			[lastListItemAreaFrom.x2, lastListItemAreaTo.x2]
		);

		const plotArea = {
			y1: columnChartItemLayout.columnArea.y1,
			y2: columnChartItemLayout.columnArea.y2,
			x1: plotArea_x1,
			x2: plotArea_x2,
			height: columnChartItemLayout.columnArea.height,
			width: plotArea_width,
		};

		return {
			transitionType: 'update',
			columnChartItemLayout,
			yScale,
			plotArea,
			from: {
				yScale: yScaleFrom,
				columnChartItemLayout: columnChartItemLayoutFrom,
			},
			to: {yScale: yScaleTo, columnChartItemLayout: columnChartItemLayoutTo},
		};
	}

	// ***********************************************************************
	// return context for 'enter' transitionType
	// ***********************************************************************
	if (listTransitionContext.transitionType === 'enter') {
		const hasNegativeValuesTo = listTransitionContext.to.visibleItems.some(
			(it) => it.value < 0
		);

		const columnChartItemLayoutTo = getColumnChartItemLayout({
			height,
			width: listTransitionContext.to.itemSize,
			baseline,
			labelHeight,
			valueLabelHeight,
			negativeValueLabelHeight,
			negativeValueLabelHeightPercentage:
				hasNegativeValuesTo || forceNegativeValueLabelHeight ? 1 : 0,
			ibcsSizesSpec,
		});

		const yScaleTo = getYScale({
			visibleItems: listTransitionContext.to.visibleItems,
			yAxisHeight: columnChartItemLayoutTo.columnArea.height,
			customDomain: globalCustomDomain,
		});

		// determine plotArea
		const firstListItemAreaTo = listTransitionContext.to.getListItemArea(0);
		const lastListItemAreaTo = listTransitionContext.to.getListItemArea(
			listTransitionContext.to.visibleItems.length - 1
		);

		const plotAreaTo_x1 = firstListItemAreaTo.x1;
		const plotAreaTo_x2 = lastListItemAreaTo.x2;
		const plotAreaTo_width = plotAreaTo_x2 - plotAreaTo_x1;

		const plotAreaTo = {
			y1: columnChartItemLayoutTo.columnArea.y1,
			y2: columnChartItemLayoutTo.columnArea.y2,
			x1: plotAreaTo_x1,
			x2: plotAreaTo_x2,
			height: columnChartItemLayoutTo.columnArea.height,
			width: plotAreaTo_width,
		};

		return {
			transitionType: 'enter',
			columnChartItemLayout: columnChartItemLayoutTo,
			yScale: yScaleTo,
			plotArea: plotAreaTo,
			to: {yScale: yScaleTo, columnChartItemLayout: columnChartItemLayoutTo},
		};
	}

	// ***********************************************************************
	// return context for 'exit' transitionType
	// ***********************************************************************
	invariant(listTransitionContext.transitionType === 'exit');
	const hasNegativeValuesFrom = listTransitionContext.from.visibleItems.some(
		(it) => it.value < 0
	);

	const columnChartItemLayoutFrom = getColumnChartItemLayout({
		height,
		width: listTransitionContext.from.itemSize,
		baseline,
		labelHeight,
		valueLabelHeight,
		negativeValueLabelHeight,
		negativeValueLabelHeightPercentage:
			hasNegativeValuesFrom || forceNegativeValueLabelHeight ? 1 : 0,
		ibcsSizesSpec,
	});

	const yScaleFrom = getYScale({
		visibleItems: listTransitionContext.from.visibleItems,
		yAxisHeight: columnChartItemLayoutFrom.columnArea.height,
		customDomain: globalCustomDomain,
	});

	// determine plotArea
	const firstListItemAreaFrom = listTransitionContext.from.getListItemArea(0);
	const lastListItemAreaFrom = listTransitionContext.from.getListItemArea(
		listTransitionContext.from.visibleItems.length - 1
	);

	const plotAreaFrom_x1 = firstListItemAreaFrom.x1;
	const plotAreaFrom_x2 = lastListItemAreaFrom.x2;
	const plotAreaFrom_width = plotAreaFrom_x2 - plotAreaFrom_x1;

	const plotAreaFrom = {
		y1: columnChartItemLayoutFrom.columnArea.y1,
		y2: columnChartItemLayoutFrom.columnArea.y2,
		x1: plotAreaFrom_x1,
		x2: plotAreaFrom_x2,
		height: columnChartItemLayoutFrom.columnArea.height,
		width: plotAreaFrom_width,
	};

	return {
		transitionType: 'exit',
		columnChartItemLayout: columnChartItemLayoutFrom,
		yScale: yScaleFrom,
		plotArea: plotAreaFrom,
		from: {
			yScale: yScaleFrom,
			columnChartItemLayout: columnChartItemLayoutFrom,
		},
	};
}

function getYScale({
	visibleItems,
	yAxisHeight,
	customDomain,
}: {
	visibleItems: TColumnChartItem[];
	yAxisHeight: number;
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
			const calculatedDomain =
				dataExtent[0] > 0
					? ([0, dataExtent[1]] as [number, number])
					: dataExtent[1] < 0
					? ([dataExtent[0], 0] as [number, number])
					: dataExtent;

			return calculatedDomain;
		})();

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(domain)
		.range([yAxisHeight, 0]);

	return yScale;
}
