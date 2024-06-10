// import {getYear} from 'date-fns';
// import {TPeriodsScale} from '../../../periodsScale/periodsScale';

import {ScaleLinear} from 'd3-scale';

export type TYAxis = ScaleLinear<number, number>; // TODO deprecate
export type TYAxisScale = ScaleLinear<number, number>;

type TTickSpec_YAxis = {
	id: string;
	domainValue: number;
};

type TLabelSpec_YAxis = {
	id: string;
	domainValue: number;
	label: string;
	textAnchor?: 'start' | 'middle' | 'end';
	marginLeft?: number;
};

export type TYAxisSpec = {
	ticks: TTickSpec_YAxis[];
	labels: TLabelSpec_YAxis[];
};

// TODO continue here implementing the TYAxisSpec generators

// getYAxisSpec(
// 	scale,
// 	nTicks,
// 	formatter,
// )

export function getYAxisSpec(
	scale: TYAxis,
	nTicks: number,
	formatter: (x: number) => string
): TYAxisSpec {
	const tickValues = scale.ticks(nTicks);

	const ticks = tickValues.map((tickValue) => {
		return {
			id: `yTick-id-${tickValue}`,
			domainValue: tickValue,
		};
	});

	const labels = tickValues.map((tickValue) => {
		// const id = date.getTime().toString();
		return {
			id: `yTickLabel-id-${tickValue}`,
			domainValue: tickValue,
			// type: 'DOMAIN_VALUE' as const,
			// label: num.toString(),
			// label: formatter ? formatter(num) : num.toString(),
			label: formatter(tickValue),
			textAnchor: 'middle' as const,
		};
	});

	return {
		ticks,
		// labels: [],
		labels,
	};
}
