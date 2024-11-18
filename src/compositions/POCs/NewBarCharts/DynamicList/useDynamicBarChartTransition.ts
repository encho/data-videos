import {extent} from 'd3-array';
import {isNumber} from 'lodash';
import invariant from 'tiny-invariant';

// import {TGridLayoutArea} from '../../../../acetti-layout';
// import {useDynamicListLayout} from './useDynamicListLayout';
import {TDynamicListTransitionContext} from './useDynamicListTransition';

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
};

// TODO, this actually represents only 1 animation step. the useDynamicListTransition will have to
// deliver potentially multiple info on transiioons,  but at least the current one...
export function useDynamicBarChartTransition({
	context,
}: {
	context: TDynamicListTransitionContext<{
		id: string;
		value: number;
		label: string;
		valueLabel: string;
	}>;
	// yDomainFrom: [number,number];
	// yDomainTo: [number,number];
}): TDynamicBarChartTransitionContext {
	const {visibleItemsFrom, visibleItemsTo} = context;

	// const visibleValuesFrom = visibleItemsFrom.map(it => it.value);
	// const visibleValuesTo = visibleItemsTo.map(it => it.value);

	const extentFrom = extent(visibleItemsFrom, (it) => it.value) as [
		number,
		number
	];
	invariant(isNumber(extentFrom[0]) && isNumber(extentFrom[1]));

	const extentTo = extent(visibleItemsTo, (it) => it.value) as [number, number];
	invariant(isNumber(extentTo[0]) && isNumber(extentTo[1]));

	return {
		extentFrom,
		extentTo,
		// frame,
		// durationInFrames,
		// transitionTypes,
		// layoutFrom,
		// layoutTo,
		// itemsFrom,
		// itemsTo,
		// visibleItemsFrom,
		// visibleItemsTo,
		// visibleIndicesFrom,
		// visibleIndicesTo,
		// visibleIndicesRangeFrom,
		// visibleIndicesRangeSizeFrom,
		// visibleIndicesRangeTo,
		// visibleIndicesRangeSizeTo,
		// getListItemAreaFrom: (x) => {
		// 	const area = layoutFrom.getListItemArea(x);
		// 	const shiftedArea = {
		// 		...area,
		// 		y1: area.y1 + justifyContentShiftFrom,
		// 		y2: area.y2 + justifyContentShiftFrom,
		// 	};
		// 	return shiftedArea;
		// },
		// getListItemAreaTo: (x) => {
		// 	const area = layoutTo.getListItemArea(x);
		// 	const shiftedArea = {
		// 		...area,
		// 		y1: area.y1 + justifyContentShiftTo,
		// 		y2: area.y2 + justifyContentShiftTo,
		// 	};
		// 	return shiftedArea;
		// },
		// justifyContentShiftFrom,
		// justifyContentShiftTo,
	};
}
