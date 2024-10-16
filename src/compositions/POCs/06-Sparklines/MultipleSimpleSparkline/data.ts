const timeSeries = [
	{value: 150, date: new Date('2010-12-31')},
	{value: 57, date: new Date('2011-12-31')},
	{value: 58, date: new Date('2012-12-31')},
	{value: 65, date: new Date('2013-12-31')},
	{value: 77, date: new Date('2014-12-31')},
	{value: 94, date: new Date('2015-12-31')},
	{value: 91, date: new Date('2016-12-31')},
	{value: 65, date: new Date('2017-12-31')},
	{value: 114, date: new Date('2018-12-31')},
];

export const data = {
	title: 'Wohnungskosten in D',
	dataSource: 'kalsjfklasfjlkadsfkjadklsfj',
	sparklines: [
		{
			title: 'Berlin',
			timeseries: timeSeries.map((it) => ({...it, value: it.value * 4})),
		},
		{title: 'Hamburg', timeseries: timeSeries},
		{title: 'London', timeseries: timeSeries},
		{title: 'New York', timeseries: timeSeries},
	],
};
