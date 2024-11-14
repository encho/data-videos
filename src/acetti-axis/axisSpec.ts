import {ScaleTime} from 'd3-scale';
import invariant from 'tiny-invariant';
import {findItemById} from './utils';

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

export type TAxisSpec = {
	domain: [Date, Date];
	range: [number, number];
	scale: ScaleTime<Date, number>;
	ticks: TTickSpec[];
	labels: TLabelSpec[];
};

export function getTickValue(axisSpec: TAxisSpec, tickId: string): Date {
	const tick = findItemById(axisSpec.ticks, tickId);
	invariant(tick);

	if (tick.type === 'DOMAIN_VALUE') {
		return tick.value;
	} 
		return axisSpec.scale.invert(tick.value);
	
}

export function getTickMappedValue(
	axisSpec: TAxisSpec,
	tickId: string
): number {
	const tick = findItemById(axisSpec.ticks, tickId);
	invariant(tick);

	if (tick.type === 'DOMAIN_VALUE') {
		return axisSpec.scale(tick.value);
	} 
		return tick.value;
	
}

export function getLabelValue(axisSpec: TAxisSpec, labelId: string): Date {
	const label = findItemById(axisSpec.labels, labelId);
	invariant(label);

	if (label.type === 'DOMAIN_VALUE') {
		return label.value;
	} 
		return axisSpec.scale.invert(label.value);
	
}

export function getLabelMappedValue(
	axisSpec: TAxisSpec,
	labelId: string
): number {
	const label = findItemById(axisSpec.labels, labelId);
	invariant(label);

	if (label.type === 'DOMAIN_VALUE') {
		return axisSpec.scale(label.value);
	} 
		return label.value;
	
}
