import {TPeriodsScale} from '../../../periodsScale/periodsScale';

type TTickSpec = {
	id: string;
	value: number;
};

type TLabelSpec = {
	id: string;
	value: number;
	label: string;
	textAnchor?: 'start' | 'middle' | 'end';
};

export type TXAxisSpec = {
	// scale: TODO BandScale here?
	ticks: TTickSpec[];
	labels: TLabelSpec[];
};

// TODO pass more info, e.g. area width?
export function getMonthStartsAxisSpec(
	periodsScale: TPeriodsScale,
	dates: Date[]
): TXAxisSpec {
	const ticksDates = generateMonthStartsNearestDates(dates);

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1,
		};
	});

	const PADDING = 10;

	const labels = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1 + PADDING,
			textAnchor: 'start' as const,
			label: getMonthName(date),
		};
	});

	return {ticks, labels};
}

export function getQuarterStartsAxisSpec(
	periodsScale: TPeriodsScale,
	dates: Date[]
): TXAxisSpec {
	const ticksDates = generateQuarterStartsNearestDates(dates);

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1,
		};
	});

	const PADDING = 10;

	const labels = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1 + PADDING,
			textAnchor: 'start' as const,
			label: getMonthName(date),
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
