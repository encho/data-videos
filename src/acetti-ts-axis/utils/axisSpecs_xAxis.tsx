import {getYear, format} from 'date-fns';
import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';

type TTickSpec = {
	id: string;
	periodFloatIndex: number;
};

type TLabelSpec = {
	id: string;
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

	const allVisibleDates = periodsScale.getAllVisibleDates();

	const labels = allVisibleDates.map((date) => {
		const dayNumberString = getDayNumber(date);
		return {
			id: `daysTick-label-${date.toISOString()}`,
			textAnchor: 'middle' as const,
			label: dayNumberString,
			periodFloatIndex: periodsScale.getIndexFromDate(date) + 0.5,
		};
	});

	const visibleDomainDates = periodsScale.getVisibleDomainDates();
	const firstDatesOfMonths = getFirstDateOfEachMonth(visibleDomainDates);

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

	const visibleDomainDates = periodsScale.getVisibleDomainDates();

	const visibleFirstJanuaryDates = periodsScale.allYearStartDates.filter(
		(date) => {
			const isBiggerEqThanLeft = date >= visibleDomainDates[0];
			const isSmallerEqThanRight = date <= visibleDomainDates[1];
			const isJanuary = date.getMonth() === 0;
			return isBiggerEqThanLeft && isSmallerEqThanRight && isJanuary;
		}
	);

	const secondaryLabels = visibleFirstJanuaryDates.map((d) => {
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

	const visibleDomainDates = periodsScale.getVisibleDomainDates();

	const visibleFirstJanuaryDates = periodsScale.allYearStartDates.filter(
		(date) => {
			const isBiggerEqThanLeft = date >= visibleDomainDates[0];
			const isSmallerEqThanRight = date <= visibleDomainDates[1];
			const isJanuary = date.getMonth() === 0;
			return isBiggerEqThanLeft && isSmallerEqThanRight && isJanuary;
		}
	);

	const secondaryLabels = visibleFirstJanuaryDates.map((d) => {
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

export function getSemesterStartsAxisSpec(
	periodsScale: TPeriodsScale
): TXAxisSpec {
	const visibleDates = periodsScale.getAllVisibleDates();

	const ticksDates = generateSemesterStartsNearestDates(visibleDates);

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

	const visibleDomainDates = periodsScale.getVisibleDomainDates();

	const visibleFirstJanuaryDates = periodsScale.allYearStartDates.filter(
		(date) => {
			const isBiggerEqThanLeft = date >= visibleDomainDates[0];
			const isSmallerEqThanRight = date <= visibleDomainDates[1];
			const isJanuary = date.getMonth() === 0;
			return isBiggerEqThanLeft && isSmallerEqThanRight && isJanuary;
		}
	);

	const secondaryLabels = visibleFirstJanuaryDates.map((d) => {
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

const formatYearWithQuote = (year: number): string => `'${year % 100}`;

export function getYearStartsAxisSpec(periodsScale: TPeriodsScale): TXAxisSpec {
	const visibleDomainDates = periodsScale.getVisibleDomainDates();

	const visibleFirstJanuaryDates = periodsScale.allYearStartDates.filter(
		(date) => {
			const isBiggerEqThanLeft = date >= visibleDomainDates[0];
			const isSmallerEqThanRight = date <= visibleDomainDates[1];
			const isJanuary = date.getMonth() === 0;
			return isBiggerEqThanLeft && isSmallerEqThanRight && isJanuary;
		}
	);

	const ticksDates = visibleFirstJanuaryDates;

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			periodFloatIndex: periodsScale.getBandFromDate(date).index,
		};
	});

	const MARGIN_LEFT = 8;

	const labels = visibleFirstJanuaryDates.map((d) => {
		const index = periodsScale.getIndexFromDate(d);
		const year = getYear(d);
		return {
			id: `secondaryLabel-year-${year}}`,
			textAnchor: 'start' as const,
			// label: `${year}`,
			label: formatYearWithQuote(year),
			periodFloatIndex: index,
			marginLeft: MARGIN_LEFT,
		};
	});

	const secondaryLabels = visibleFirstJanuaryDates
		.filter((date) => getYear(date) % 5 === 0)
		.map((date) => {
			const index = periodsScale.getIndexFromDate(date);
			const year = getYear(date);
			return {
				id: `secondaryLabel-year-${year}}`,
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
				previousMonthNumber !== 1 &&
				previousMonthNumber !== 4 &&
				previousMonthNumber !== 7 &&
				previousMonthNumber !== 10;

			if (isFirstMonthOfQuarter && prevDateNoQuarterStartMonth) {
				datesList.push(currentDate);
			}
		}
	}

	return datesList;
}

function generateSemesterStartsNearestDates(dates: Date[]): Date[] {
	const datesList: Date[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const monthNumber = currentDate.getMonth() + 1;

		const isFirstMonthOfSemester = monthNumber === 1 || monthNumber === 7;

		if (i !== 0) {
			const previousDate = dates[i - 1];
			const previousMonthNumber = previousDate.getMonth() + 1;
			const prevDateNoSemesterStartMonth =
				previousMonthNumber !== 1 && previousMonthNumber !== 7;

			if (isFirstMonthOfSemester && prevDateNoSemesterStartMonth) {
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
	periodsScale: TPeriodsScale,
	formatStringProp?: string
): TXAxisSpec {
	const visibleDomainIndices = periodsScale.getRoundedVisibleDomainIndices();

	const formatString = formatStringProp || 'yyyy';

	const labels = [];

	const startDate = periodsScale.getDateFromIndex(visibleDomainIndices[0]);
	const startYearNumberString = format(startDate, formatString);

	const endDate = periodsScale.getDateFromIndex(visibleDomainIndices[1] - 1);
	const endYearNumberString = format(endDate, formatString);

	labels.push({
		id: 'start-0.5-label',
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
