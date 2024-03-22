import {TGridLayoutArea} from '../acetti-viz';
import {getXAxisSpecStandard} from './getXAxisSpecStandard';
import {getXAxisSpecInterMonths} from './getXAxisSpecInterMonths';

// ************************************************************
// TODO possibly use this
// import {getDateSpanCategory} from './utils';
// ************************************************************

export type TAxisSpecType = 'STANDARD' | 'INTER_MONTHS';

export function getXAxisSpec(
	datesArray: Date[],
	area: TGridLayoutArea,
	type?: TAxisSpecType
) {
	if (!type || type === 'STANDARD') {
		return getXAxisSpecStandard(datesArray, area);
	}
	return getXAxisSpecInterMonths(datesArray, area);
}
