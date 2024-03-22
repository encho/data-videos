// import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {max, min} from 'd3-array';
import {scaleTime, ScaleTime} from 'd3-scale';

import {TAxisSpec} from './axisSpec';

import {TGridLayoutArea} from '../acetti-viz';

// ************************************************************
// TODO factor out somewhere to be used also by animated x axis!
// ************************************************************

// ************************************************************
// TODO use this!
// import {getDateSpanCategory} from './utils';
// ************************************************************

export function getXAxisSpecInterMonths(
	datesArray: Date[],
	area: TGridLayoutArea
) {
	const minDate = min(datesArray) as Date;
	const maxDate = max(datesArray) as Date;

	// information to determine looks of x-axis
	// const dateSpanCategory = getDateSpanCategory(minDate, maxDate);

	// TODO this only in specific dateSpanCategories, otherwise keep minDate,maxDate domain
	const xTickValuesMonthBoundaries = generateMonthBoundariesDates(
		minDate,
		maxDate
	);

	const xScaleDomain = [
		xTickValuesMonthBoundaries[0],
		xTickValuesMonthBoundaries[xTickValuesMonthBoundaries.length - 1],
	] as [Date, Date];

	const xScaleRange = [0, area.width] as [number, number];

	// QUICK-FIX determine why we have to cast to any here
	const xScale: ScaleTime<Date, number> = scaleTime()
		.domain(xScaleDomain)
		.range(xScaleRange) as any;

	const monthStrings = getAllButLast(xTickValuesMonthBoundaries).map((it) =>
		// TODO paramterrization from props
		getMonthString(it, 'veryShort')
	);

	const dateIds = getAllButLast(xTickValuesMonthBoundaries).map((it) =>
		it.toISOString()
	);

	// TODO: here we have mapped values already we may need to integrate this in axisSpec
	// these tick values
	const xTickValuesMonthStartsMapped = xTickValuesMonthBoundaries.map((d) =>
		xScale(d)
	);

	const axisTickSpecs = xTickValuesMonthStartsMapped.map(
		(n: number, i: number) => {
			const date = xTickValuesMonthBoundaries[i];
			const id = date.toISOString();
			return {id, value: n, type: 'MAPPED_VALUE' as const};
		}
	);

	// TODO: here we have mapped values already we may need to integrate this in axisSpec
	const xTickValuesMonthCentroids = calculateAveragesBetweenNumbers(
		xTickValuesMonthStartsMapped
	);

	const xAxisLabels = xTickValuesMonthCentroids.map((it, i) => {
		return {
			id: dateIds[i],
			label: monthStrings[i],
			value: it,
			type: 'MAPPED_VALUE' as const,
			textAnchor: 'middle' as const,
		};
	});

	const xAxisSpecFull: TAxisSpec = {
		domain: xScaleDomain,
		range: [area.x1, area.x2],
		scale: xScale,
		ticks: axisTickSpecs,
		labels: xAxisLabels,
	};

	return xAxisSpecFull;
}

function getAllButLast(arr: any[]): any[] {
	if (arr.length <= 1) {
		return [];
	}

	return arr.slice(0, arr.length - 1);
}
function getMonthString(
	date: Date,
	format: 'long' | 'short' | 'veryShort' = 'long'
): string {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const shortMonths = months.map((month) => month.slice(0, 3));
	const veryShortMonths = months.map((month) => month.slice(0, 1));

	switch (format) {
		case 'long':
			return months[date.getMonth()];
		case 'short':
			return shortMonths[date.getMonth()];
		case 'veryShort':
			return veryShortMonths[date.getMonth()];
		default:
			return months[date.getMonth()];
	}
}

function generateMonthBoundariesDates(minDate: Date, maxDate: Date): Date[] {
	const result: Date[] = [];

	// Function to check if a date is the first day of the month
	const isFirstDayOfMonth = (date: Date) => date.getDate() === 1;

	// Function to get the last day of the month
	const getLastDayOfMonth = (date: Date) =>
		new Date(date.getFullYear(), date.getMonth() + 1, 0);

	// Handle the minDate
	if (!isFirstDayOfMonth(minDate)) {
		result.push(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
	} else {
		result.push(minDate);
	}

	// Generate the first day of each month between minDate and maxDate
	let currentDate = new Date(minDate);
	while (currentDate < maxDate) {
		currentDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			1
		);
		if (currentDate <= maxDate) {
			result.push(currentDate);
		}
	}

	// Handle the maxDate as an exception
	if (maxDate <= getLastDayOfMonth(maxDate)) {
		result.push(getLastDayOfMonth(maxDate));
	}

	return result;
}

function calculateAveragesBetweenNumbers(numbers: number[]): number[] {
	const result: number[] = [];

	for (let i = 0; i < numbers.length - 1; i++) {
		const average = (numbers[i] + numbers[i + 1]) / 2;
		result.push(average);
	}

	return result;
}
