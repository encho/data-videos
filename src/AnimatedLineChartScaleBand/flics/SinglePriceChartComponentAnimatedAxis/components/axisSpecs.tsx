import {TPeriodsScale} from '../../../periodsScale/periodsScale';

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

export type TXAxisSpec = {
	// scale: TODO BandScale here?
	ticks: TTickSpec[];
	labels: TLabelSpec[];
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
		return {
			id: `daysTick-label-${tickIndex + 0.5}`,
			textAnchor: 'middle' as const,
			label: `${tickIndex}`,
			periodFloatIndex: tickIndex + 0.5,
		};
	});

	console.log('asdfasfasdfasfasdf');
	console.log({ticks, labels});
	return {ticks, labels};
}

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

	return {ticks, labels};
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

	return {ticks, labels};
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
