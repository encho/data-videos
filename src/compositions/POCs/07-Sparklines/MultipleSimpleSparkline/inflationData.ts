import {
	TimeSeries,
	mapTimeSeries,
} from '../../../../acetti-ts-utils/timeSeries/timeSeries';

// Slide Title and Data Source
const slideTitle: string = 'United States Leads in Reducing Inflation Rates';

const slideSubtitle: string =
	'Comparative Inflation Rates Across Countries (2022-2023)';

const dataSource: string =
	'Data sourced from official statistics bureaus of each country.';

const usInflationTimeseries: TimeSeries = [
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

const ukInflationTimeseries: TimeSeries = [
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

const germanyInflationTimeseries: TimeSeries = [
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

const japanInflationTimeseries: TimeSeries = [
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
const sparklines: {title: string; timeseries: TimeSeries}[] = [
	{
		title: 'United States',
		timeseries: mapTimeSeries(usInflationTimeseries, (it) => it / 100),
	},
	{
		title: 'United Kingdom',
		timeseries: mapTimeSeries(ukInflationTimeseries, (it) => it / 100),
	},
	{
		title: 'Germany',
		timeseries: mapTimeSeries(germanyInflationTimeseries, (it) => it / 100),
	},
	{
		title: 'Japan',
		timeseries: mapTimeSeries(japanInflationTimeseries, (it) => it / 100),
	},
];

type TSparklineProps = {
	title: string;
	subtitle: string;
	dataSource: string;
	sparklines: {title: string; timeseries: TimeSeries}[];
	formatString: string;
};

// Component Props
export const data: TSparklineProps = {
	title: slideTitle,
	subtitle: slideSubtitle,
	dataSource,
	sparklines,
	formatString: '$ 0.00',
};
