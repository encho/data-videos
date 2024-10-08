import {getYear} from 'date-fns';
import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';

type TTickSpec = {
	id: string;
	periodFloatIndex: number;
};

type TLabelSpec = {
	id: string;
	// value: number;
	periodFloatIndex: number;
	label: string;
	padding?: number;
	textAnchor?: 'start' | 'middle' | 'end';
	marginLeft?: number;
};

export type TAxisLabelSpec = TLabelSpec;

export type TXAxisSpec = {
	// scale: TODO BandScale here?
	ticks: TTickSpec[];
	labels: TLabelSpec[];
	secondaryLabels: TLabelSpec[];
};

function rangeBetween(numbers: [number, number]): number[] {
	const [start, end] = numbers;
	const length = end - start + 1;
	return Array.from({length}, (_, index) => start + index);
}
// Example usage:
// const input: [number, number] = [4, 8];
// const output: number[] = rangeBetween(input);
// console.log(output); // Output: [4, 5, 6, 7, 8]

export function getIndicesAxisSpec(periodsScale: TPeriodsScale): TXAxisSpec {
	const visibleDomainIndices = periodsScale.getRoundedVisibleDomainIndices();
	const tickIndices = rangeBetween(visibleDomainIndices);

	const ticks = tickIndices.map((tickIndex) => {
		return {
			id: `daysTick-index-${tickIndex}`,
			periodFloatIndex: tickIndex,
		};
	});

	const labels = tickIndices.map((tickIndex) => {
		return {
			id: `daysTick-label-${tickIndex + 0.5}`,
			textAnchor: 'middle' as const,
			label: `${tickIndex}`,
			periodFloatIndex: tickIndex + 0.5,
		};
	});

	const secondaryLabels: TLabelSpec[] = [];

	return {ticks, labels, secondaryLabels};
}

// TODO pass more info, e.g. area width?
export function getDaysAxisSpec(periodsScale: TPeriodsScale): TXAxisSpec {
	const visibleDomainIndices = periodsScale.getRoundedVisibleDomainIndices();
	const tickIndices = rangeBetween(visibleDomainIndices);

	const ticks = tickIndices.map((tickIndex) => {
		return {
			id: `daysTick-index-${tickIndex}`,
			periodFloatIndex: tickIndex,
		};
	});

	const labels = tickIndices.map((tickIndex) => {
		const date = periodsScale.getDateFromIndex(tickIndex);
		const dayNumberString = getDayNumber(date);
		return {
			id: `daysTick-label-${tickIndex + 0.5}`,
			textAnchor: 'middle' as const,
			label: dayNumberString,
			periodFloatIndex: tickIndex + 0.5,
		};
	});

	const visibleDates = periodsScale.getAllVisibleDates();

	const firstDatesOfMonths = getFirstDateOfEachMonth(visibleDates);

	const secondaryLabels = firstDatesOfMonths.map((d) => {
		const index = periodsScale.getIndexFromDate(d);

		return {
			id: `secondaryLabel-month-${d.toISOString()}}`,
			textAnchor: 'start' as const,
			label: `${getMonthName(d)}`,
			periodFloatIndex: index,
		};
	});

	return {ticks, labels, secondaryLabels};
}

// TODO use/ test out
function getFirstDateOfEachMonth(dates: Date[]): Date[] {
	if (dates.length === 0) {
		return [];
	}

	const result: Date[] = [];
	let currentMonth = dates[0].getMonth();
	let currentYear = dates[0].getFullYear();

	// Add the first date to the result array
	result.push(dates[0]);

	for (let i = 1; i < dates.length; i++) {
		const date = dates[i];
		const month = date.getMonth();
		const year = date.getFullYear();

		// Check if the month or year has changed
		if (month !== currentMonth || year !== currentYear) {
			result.push(date);
			currentMonth = month;
			currentYear = year;
		}
	}

	return result;
}
// // Example usage:
// const dates = [
// 	new Date('2024-12-01'),
// 	new Date('2024-12-05'),
// 	new Date('2024-12-10'),
// 	new Date('2025-01-01'),
// 	new Date('2025-01-15'),
// 	new Date('2025-02-01')
// ];
// const firstDatesOfEachMonth = getFirstDateOfEachMonth(dates);
// console.log(firstDatesOfEachMonth);
// // Output: [
// //   2024-12-01T00:00:00.000Z,
// //   2025-01-01T00:00:00.000Z,
// //   2025-02-01T00:00:00.000Z
// // ]

interface MonthInfo {
	month: number;
	year: number;
	firstIndex: number;
	lastIndex: number;
}

function getMonthYearInfo(dates: Date[]): MonthInfo[] {
	const result: MonthInfo[] = [];
	if (dates.length === 0) {
		return result;
	}

	let currentMonth = dates[0].getMonth() + 1;
	let currentYear = dates[0].getFullYear();
	let firstIndex = 0;

	for (let i = 1; i < dates.length; i++) {
		const date = dates[i];
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		if (month !== currentMonth || year !== currentYear) {
			result.push({
				month: currentMonth,
				year: currentYear,
				firstIndex,
				lastIndex: i - 1,
			});

			currentMonth = month;
			currentYear = year;
			firstIndex = i;
		}
	}

	// Add the last month/year info
	result.push({
		month: currentMonth,
		year: currentYear,
		firstIndex,
		lastIndex: dates.length - 1,
	});

	return result;
}
// // Example usage:
// const dates = [
// 	new Date('2024-12-01'),
// 	new Date('2024-12-05'),
// 	new Date('2024-12-10'),
// 	new Date('2025-01-01'),
// 	new Date('2025-01-15'),
// 	new Date('2025-02-01')
// ];
// const monthYearInfo = getMonthYearInfo(dates);
// console.log(monthYearInfo);
// // Output: [
// //   { month: 12, year: 2024, firstIndex: 0, lastIndex: 2 },
// //   { month: 1, year: 2025, firstIndex: 3, lastIndex: 4 },
// //   { month: 2, year: 2025, firstIndex: 5, lastIndex: 5 }
// // ]

function averageWithPrevious(arr: number[]): number[] {
	// Check if the array has fewer than 2 elements
	if (arr.length < 2) {
		// return [];
		throw new Error('Input array must have at least 2 elements.');
	}

	// Initialize the result array
	let result: number[] = [];

	// Iterate through the array starting from the second element
	for (let i = 1; i < arr.length; i++) {
		// Calculate the average of the current and previous element
		let average = (arr[i] + arr[i - 1]) / 2;
		// Add the average to the result array
		result.push(average);
	}

	return result;
}
// // Example usage:
// const inputArray = [1, 2, 3, 5];
// const outputArray = averageWithPrevious(inputArray);
// console.log(outputArray); // Output: [1.5, 2.5, 4]

// TODO pass more info, e.g. area width?
export function getMonthStartsAxisSpec(
	periodsScale: TPeriodsScale
): TXAxisSpec {
	const visibleDates = periodsScale.getAllVisibleDates();

	const ticksDates = generateMonthStartsNearestDates(visibleDates);

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			periodFloatIndex: periodsScale.getBandFromDate(date).index,
		};
	});

	const MARGIN_LEFT = 8;

	const labels = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			textAnchor: 'start' as const,
			label: getMonthName(date),
			periodFloatIndex: periodsScale.getBandFromDate(date).index,
			marginLeft: MARGIN_LEFT,
		};
	});

	const firstDatesOfYears = getFirstDateOfEachYear(visibleDates);

	const secondaryLabels = firstDatesOfYears.map((d) => {
		const index = periodsScale.getIndexFromDate(d);
		const year = getYear(d);
		return {
			id: `secondaryLabel-year-${year}}`,
			textAnchor: 'start' as const,
			label: `${year}`,
			periodFloatIndex: index,
		};
	});

	return {ticks, labels, secondaryLabels};
}

function getFirstDateOfEachYear(dates: Date[]): Date[] {
	if (dates.length === 0) {
		return [];
	}

	const result: Date[] = [];
	let currentYear = dates[0].getFullYear();

	// Add the first date to the result array
	result.push(dates[0]);

	for (let i = 1; i < dates.length; i++) {
		const date = dates[i];
		const year = date.getFullYear();

		// Check if the year has changed
		if (year !== currentYear) {
			result.push(date);
			currentYear = year;
		}
	}

	return result;
}
// // Example usage:
// const dates = [
// 	new Date('2024-12-01'),
// 	new Date('2024-12-05'),
// 	new Date('2024-12-10'),
// 	new Date('2025-01-01'),
// 	new Date('2025-01-15'),
// 	new Date('2026-02-01')
// ];
// const firstDatesOfEachYear = getFirstDateOfEachYear(dates);
// console.log(firstDatesOfEachYear);
// // Output: [
// //   2024-12-01T00:00:00.000Z,
// //   2025-01-01T00:00:00.000Z,
// //   2026-02-01T00:00:00.000Z
// // ]

export function getQuarterStartsAxisSpec(
	periodsScale: TPeriodsScale
): TXAxisSpec {
	const visibleDates = periodsScale.getAllVisibleDates();

	const ticksDates = generateQuarterStartsNearestDates(visibleDates);

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			periodFloatIndex: periodsScale.getBandFromDate(date).index,
		};
	});

	const MARGIN_LEFT = 8;

	const labels = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			periodFloatIndex: periodsScale.getBandFromDate(date).index,
			textAnchor: 'start' as const,
			label: getMonthName(date),
			marginLeft: MARGIN_LEFT,
		};
	});

	const firstDatesOfYears = getFirstDateOfEachYear(periodsScale.dates);

	const secondaryLabels = firstDatesOfYears.map((d) => {
		const index = periodsScale.getIndexFromDate(d);
		const year = getYear(d);
		return {
			id: `secondaryLabel-year-xx-${year}}`,
			textAnchor: 'start' as const,
			label: `${year}`,
			periodFloatIndex: index,
		};
	});

	return {ticks, labels, secondaryLabels};
}

function generateMonthStartsNearestDates(dates: Date[]): Date[] {
	const datesList: Date[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const isFirstDayOfMonth = currentDate.getDate() === 1;

		// Check if previous date is from a different month
		const isPrecedingMonth =
			i > 0 && dates[i - 1].getMonth() !== currentDate.getMonth();

		// If it's the first day of the month or the previous date is from a different month, mark as 1
		if (isPrecedingMonth || isFirstDayOfMonth) {
			datesList.push(currentDate);
		}
	}
	return datesList;
}

function generateQuarterStartsNearestDates(dates: Date[]): Date[] {
	const datesList: Date[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const monthNumber = currentDate.getMonth() + 1;

		const isFirstMonthOfQuarter =
			monthNumber === 1 ||
			monthNumber === 4 ||
			monthNumber === 7 ||
			monthNumber === 10;

		if (i !== 0) {
			const previousDate = dates[i - 1];
			const previousMonthNumber = previousDate.getMonth() + 1;
			const prevDateNoQuarterStartMonth =
				previousMonthNumber != 1 &&
				previousMonthNumber != 4 &&
				previousMonthNumber != 7 &&
				previousMonthNumber != 10;

			if (isFirstMonthOfQuarter && prevDateNoQuarterStartMonth) {
				datesList.push(currentDate);
			}
		}
	}

	return datesList;
}

function getMonthName(date: Date): string {
	// Use options to get the month name in the desired language
	// const monthName = date.toLocaleString('default', {month: 'long'});
	const monthName = date.toLocaleString('default', {month: 'short'});
	return monthName;
}

function getDayNumber(date: Date): string {
	// Get the day of the month (1-31)
	const day = date.getDate();
	// Convert the day number to a string and pad it with a leading zero if necessary
	const dayString = day.toString().padStart(2, '0');
	return dayString;
}
// Example usage:
// const date = new Date();
// console.log(getDayNumber(date)); // Output will be something like "07" if the current day is the 7th

// TODO rename to getJustFirstAndLastYearsAxisSpec
export function getJustFirstAndLastAxisSpec(
	periodsScale: TPeriodsScale
): TXAxisSpec {
	const visibleDomainIndices = periodsScale.getRoundedVisibleDomainIndices();

	// const ticks = [];

	// ticks.push({
	// 	id: 'start-0.5-tick',
	// 	periodFloatIndex: visibleDomainIndices[0] + 0.5,
	// });

	// ticks.push({
	// 	id: 'last-0.5-tick',
	// 	periodFloatIndex: visibleDomainIndices[1] - 0.5,
	// });

	const labels = [];

	const startDate = periodsScale.getDateFromIndex(visibleDomainIndices[0]);
	const startYearNumberString = `${getYear(startDate)}`;

	const endDate = periodsScale.getDateFromIndex(visibleDomainIndices[1] - 1);
	const endYearNumberString = `${getYear(endDate)}`;

	labels.push({
		id: 'start-0.5-label',
		// textAnchor: 'middle' as const,
		textAnchor: 'start' as const,
		label: startYearNumberString,
		periodFloatIndex: visibleDomainIndices[0] + 0.5,
	});

	labels.push({
		id: 'last-0.5-label',
		textAnchor: 'end' as const,
		label: endYearNumberString,
		periodFloatIndex: visibleDomainIndices[1] - 0.5,
	});

	return {ticks: [], labels, secondaryLabels: []};
}
