// import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {max, min} from 'd3-array';
import {scaleTime, ScaleTime} from 'd3-scale';

import {TAxisSpec} from './axisSpec';

import {TGridLayoutArea} from '../acetti-viz';

// TODO bring here
import {formatDate} from '../AxisTransition/utils';

export function getXAxisSpecStandard(
	datesArray: Date[],
	area: TGridLayoutArea
) {
	const minDate = min(datesArray) as Date;
	const maxDate = max(datesArray) as Date;

	const xAxis_domain = [minDate, maxDate] as [Date, Date];

	const XAXIS_RANGE = [area.x1, area.x2] as [number, number];
	const xAxis_range = XAXIS_RANGE;

	// QUICK-FIX determine why we have to cast to any here
	const xAxis_xScale: ScaleTime<Date, number> = scaleTime()
		.domain(xAxis_domain)
		.range(xAxis_range) as any;

	const xAxis_tickValues = xAxis_xScale.ticks(4);
	const xAxis_ticks = xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		return {id, value: date, type: 'DOMAIN_VALUE' as const};
	});
	const xAxis_labels = xAxis_tickValues.map((date) => {
		const id = date.getTime().toString();
		const label = formatDate(date);
		return {id, label, value: date, type: 'DOMAIN_VALUE' as const};
	});

	const axisSpec: TAxisSpec = {
		domain: xAxis_domain,
		range: xAxis_range,
		scale: xAxis_xScale,
		ticks: xAxis_ticks,
		labels: xAxis_labels,
	};

	return axisSpec;
}
