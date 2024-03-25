import {
	// scaleLinear, scaleTime,
	ScaleTime,
	// ScaleLinear
} from 'd3-scale';
// import {TGridLayoutArea} from '../acetti-viz';
import {
	// getXAxisSpecStandard,
	getXAxisSpecStandardFromScale,
} from './getXAxisSpecStandard';
import {getXAxisSpecInterMonthsFromScale} from './getXAxisSpecInterMonths';

// ************************************************************
// TODO possibly use this
// import {getDateSpanCategory} from './utils';
// ************************************************************

export type TAxisSpecType = 'STANDARD' | 'INTER_MONTHS';

export function getXAxisSpecFromScale(
	scale: ScaleTime<Date, number>,
	type?: TAxisSpecType
) {
	if (!type || type === 'STANDARD') {
		return getXAxisSpecStandardFromScale(scale);
	}
	// return getXAxisSpecStandardFromScale(scale);
	return getXAxisSpecInterMonthsFromScale(scale);
}
