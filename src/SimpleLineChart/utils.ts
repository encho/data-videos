export function getDateDifferenceInMonths(
	startDate: Date,
	endDate: Date
): number {
	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth();
	const endYear = endDate.getFullYear();
	const endMonth = endDate.getMonth();
	return (endYear - startYear) * 12 + (endMonth - startMonth);
}

export type TDateSpan = '<1M' | '1M-3M' | '3M-6M' | '6M-1Y' | '>1Y';

export function getDateSpanCategory(startDate: Date, endDate: Date): TDateSpan {
	const differenceInMonths = getDateDifferenceInMonths(startDate, endDate);

	if (differenceInMonths < 1) {
		return '<1M';
	} else if (differenceInMonths >= 1 && differenceInMonths <= 3) {
		return '1M-3M';
	} else if (differenceInMonths >= 4 && differenceInMonths <= 6) {
		return '3M-6M';
	} else if (differenceInMonths >= 7 && differenceInMonths <= 18) {
		return '6M-1Y';
	} else {
		return '>1Y';
	}
}
