import {max, min} from 'd3-array';

export function getTimeSeriesDateSpan(
	timeSeries: {date: Date; value: number}[]
): [Date, Date] {
	if (timeSeries.length === 0) {
		throw new Error('Time series is empty');
	}

	// Extract dates from time series
	const dates = timeSeries.map((dataPoint) => dataPoint.date);

	// Find minimum and maximum dates
	// const minDate = new Date(Math.min(...dates));
	// const maxDate = new Date(Math.max(...dates));

	const minDate = min(dates) as Date;
	const maxDate = max(dates) as Date;
	// const maxDate = max(data.map((it) => it.index)) as Date;

	return [minDate, maxDate];
}

// Example usage:
// const startDate = new Date('2024-01-01');
// const endDate = new Date('2024-01-10');
// const timeSeries = generateBrownianMotionTimeSeries(startDate, endDate);
// const dateSpan = getTimeSeriesDateSpan(timeSeries);
// console.log(dateSpan); // Output: [minDate, maxDate]
