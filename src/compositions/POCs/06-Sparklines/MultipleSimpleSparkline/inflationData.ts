// Slide Title and Data Source
const slideTitle: string =
	// 'Comparative Inflation Rates Across Countries (2022-2023)';
	'Comparative Inflation';

const dataSource: string =
	'Data sourced from official statistics bureaus of each country.';

type Timeseries = {date: Date; value: number}[];

const usInflationTimeseries: Timeseries = [
	{date: new Date('2022-01-31'), value: 7.5},
	{date: new Date('2022-02-28'), value: 7.9},
	{date: new Date('2022-03-31'), value: 8.5},
	{date: new Date('2022-04-30'), value: 8.3},
	{date: new Date('2022-05-31'), value: 8.6},
	{date: new Date('2022-06-30'), value: 9.1},
	{date: new Date('2022-07-31'), value: 8.5},
	{date: new Date('2022-08-31'), value: 8.3},
	{date: new Date('2022-09-30'), value: 8.2},
	{date: new Date('2022-10-31'), value: 7.7},
	{date: new Date('2022-11-30'), value: 7.1},
	{date: new Date('2022-12-31'), value: 6.5},
	{date: new Date('2023-01-31'), value: 6.4},
	{date: new Date('2023-02-28'), value: 6.0},
	{date: new Date('2023-03-31'), value: 5.0},
	{date: new Date('2023-04-30'), value: 4.9},
	{date: new Date('2023-05-31'), value: 4.0},
	{date: new Date('2023-06-30'), value: 3.0},
	{date: new Date('2023-07-31'), value: 3.2},
	{date: new Date('2023-08-31'), value: 3.7},
];

const ukInflationTimeseries: Timeseries = [
	{date: new Date('2022-01-31'), value: 5.5},
	{date: new Date('2022-02-28'), value: 6.2},
	{date: new Date('2022-03-31'), value: 7.0},
	{date: new Date('2022-04-30'), value: 9.0},
	{date: new Date('2022-05-31'), value: 9.1},
	{date: new Date('2022-06-30'), value: 9.4},
	{date: new Date('2022-07-31'), value: 10.1},
	{date: new Date('2022-08-31'), value: 9.9},
	{date: new Date('2022-09-30'), value: 10.1},
	{date: new Date('2022-10-31'), value: 11.1},
	{date: new Date('2022-11-30'), value: 10.7},
	{date: new Date('2022-12-31'), value: 10.5},
	{date: new Date('2023-01-31'), value: 10.1},
	{date: new Date('2023-02-28'), value: 10.4},
	{date: new Date('2023-03-31'), value: 10.1},
	{date: new Date('2023-04-30'), value: 8.7},
	{date: new Date('2023-05-31'), value: 8.7},
	{date: new Date('2023-06-30'), value: 7.9},
	{date: new Date('2023-07-31'), value: 6.8},
	{date: new Date('2023-08-31'), value: 6.7},
];

const germanyInflationTimeseries: Timeseries = [
	{date: new Date('2022-01-31'), value: 4.9},
	{date: new Date('2022-02-28'), value: 5.1},
	{date: new Date('2022-03-31'), value: 7.3},
	{date: new Date('2022-04-30'), value: 7.4},
	{date: new Date('2022-05-31'), value: 7.9},
	{date: new Date('2022-06-30'), value: 7.6},
	{date: new Date('2022-07-31'), value: 7.5},
	{date: new Date('2022-08-31'), value: 7.9},
	{date: new Date('2022-09-30'), value: 10.0},
	{date: new Date('2022-10-31'), value: 10.4},
	{date: new Date('2022-11-30'), value: 10.0},
	{date: new Date('2022-12-31'), value: 8.6},
	{date: new Date('2023-01-31'), value: 8.7},
	{date: new Date('2023-02-28'), value: 8.7},
	{date: new Date('2023-03-31'), value: 7.4},
	{date: new Date('2023-04-30'), value: 7.2},
	{date: new Date('2023-05-31'), value: 6.1},
	{date: new Date('2023-06-30'), value: 6.4},
	{date: new Date('2023-07-31'), value: 6.2},
	{date: new Date('2023-08-31'), value: 6.1},
];

const japanInflationTimeseries: Timeseries = [
	{date: new Date('2022-01-31'), value: 0.5},
	{date: new Date('2022-02-28'), value: 0.9},
	{date: new Date('2022-03-31'), value: 1.2},
	{date: new Date('2022-04-30'), value: 2.5},
	{date: new Date('2022-05-31'), value: 2.5},
	{date: new Date('2022-06-30'), value: 2.4},
	{date: new Date('2022-07-31'), value: 2.6},
	{date: new Date('2022-08-31'), value: 3.0},
	{date: new Date('2022-09-30'), value: 3.0},
	{date: new Date('2022-10-31'), value: 3.7},
	{date: new Date('2022-11-30'), value: 3.8},
	{date: new Date('2022-12-31'), value: 4.0},
	{date: new Date('2023-01-31'), value: 4.3},
	{date: new Date('2023-02-28'), value: 3.3},
	{date: new Date('2023-03-31'), value: 3.2},
	{date: new Date('2023-04-30'), value: 3.5},
	{date: new Date('2023-05-31'), value: 3.2},
	{date: new Date('2023-06-30'), value: 3.3},
	{date: new Date('2023-07-31'), value: 3.1},
	{date: new Date('2023-08-31'), value: 3.2},
];

// Sparklines Array
const sparklines: {title: string; timeseries: Timeseries}[] = [
	{
		// title: 'United States Inflation Rate',
		title: 'United States',
		timeseries: usInflationTimeseries,
	},
	{
		title: 'United Kingdom',
		timeseries: ukInflationTimeseries,
	},
	{
		title: 'Germany',
		timeseries: germanyInflationTimeseries,
	},
	{
		title: 'Japan',
		timeseries: japanInflationTimeseries,
	},
];

type TSparklineProps = {
	title: string;
	dataSource: string;
	sparklines: {title: string; timeseries: Timeseries}[];
};

// Component Props
export const data: TSparklineProps = {
	title: slideTitle,
	dataSource: dataSource,
	sparklines: sparklines,
};
