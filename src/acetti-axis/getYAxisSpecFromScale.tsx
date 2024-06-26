import {ScaleLinear} from 'd3-scale';

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
	value: number;
};

type TTickSpec = TTickSpecNormal | TTickSpecMapped;

type TLabelSpecNormal = {
	id: string;
	value: number;
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
	scale: ScaleLinear<number, number>,
	formatter?: (x: number) => string
	// type?: TAxisSpecType
) {
	// FOR NOW WE HAVE ONLY STANDARD

	// const yAxis_tickValues = scale.ticks(4);
	const yAxis_tickValues = scale.ticks(6);

	const yAxis_ticks = yAxis_tickValues.map((num) => {
		// const id = date.getTime().toString();
		return {
			id: 'id-' + num,
			value: num,
			type: 'DOMAIN_VALUE' as const,
		};
	});

	const yAxis_labels = yAxis_tickValues.map((num) => {
		// const id = date.getTime().toString();
		return {
			id: 'id-' + num,
			value: num,
			type: 'DOMAIN_VALUE' as const,
			// label: num.toString(),
			label: formatter ? formatter(num) : num.toString(),
			textAnchor: 'middle' as const,
		};
	});

	// console.log({yAxis_tickValues, yAxis_labels});

	const axisSpec: TAxisSpec_Linear_Numeric = {
		domain: scale.domain() as [number, number],
		range: scale.range() as [number, number],
		scale,
		ticks: yAxis_ticks,
		labels: yAxis_labels,
	};

	return axisSpec;
}
