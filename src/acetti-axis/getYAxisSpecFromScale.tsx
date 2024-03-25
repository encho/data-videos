import {
	// scaleLinear, scaleTime,
	// ScaleTime,
	ScaleLinear,
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

type TTickSpecMapped = {
	id: string;
	type: 'MAPPED_VALUE';
	value: number;
};

type TTickSpecNormal = {
	id: string;
	type: 'DOMAIN_VALUE';
	value: Date;
};

type TTickSpec = TTickSpecNormal | TTickSpecMapped;

type TLabelSpecNormal = {
	id: string;
	value: Date;
	label: string;
	type: 'DOMAIN_VALUE';
	textAnchor?: 'start' | 'middle' | 'end';
};

type TLabelSpecMapped = {
	id: string;
	value: number;
	label: string;
	type: 'MAPPED_VALUE';
	textAnchor?: 'start' | 'middle' | 'end';
};

type TLabelSpec = TLabelSpecNormal | TLabelSpecMapped;

export type TAxisSpec_Linear_Numeric = {
	domain: [number, number];
	range: [number, number];
	scale: ScaleLinear<number, number>;
	ticks: TTickSpec[];
	labels: TLabelSpec[];
};

// export type TAxisSpecType = 'STANDARD' | 'INTER_MONTHS';

export function getYAxisSpecFromScale(
	scale: ScaleLinear<number, number>
	// type?: TAxisSpecType
) {
	// FOR NOW WE HAVE ONLY STANDARD

	const yAxis_tickValues = scale.ticks(4);

	const yAxis_ticks = yAxis_tickValues.map((num) => {
		// const id = date.getTime().toString();
		return {
			id: 'id-' + num,
			value: num,
			type: 'DOMAIN_VALUE' as const,
		};
	});

	const axisSpec: TAxisSpec_Linear_Numeric = {
		domain: scale.domain() as [number, number],
		range: scale.range() as [number, number],
		scale,
		ticks: yAxis_ticks,
		// labels: xAxis_labels,
		labels: [],
	};

	return axisSpec;
}
