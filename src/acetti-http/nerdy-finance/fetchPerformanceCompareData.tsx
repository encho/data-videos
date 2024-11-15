import {z} from 'zod';

export const zNerdyFinancePriceChartDataResult = z.object({
	title: z.string(),
	subtitle: z.string(),
	ticker: z.string(),
	tickerMetadata: z.object({
		ticker: z.string(),
		quote: z.string(),
		name: z.string(),
		type: z.string(),
	}),
	percentageChange: z.number(),
	timePeriod: z.string(),
	data: z.array(
		z.object({
			value: z.number(),
			index: z.date(),
		})
	),
});

export const zMultiSeries = z.object({
	meta: z.array(
		z.object({
			ticker: z.string(),
		})
	),
	index: z.array(z.date()),
	series: z.array(z.array(z.number())),
});

export type TMultiSeries = z.infer<typeof zMultiSeries>;

// export type TMultiSeries = {
// 	meta: {ticker: string}[];
// 	series: number[][];
// 	index: Date[];
// };

export const zNerdyFinancePerformanceCompareChartDataResult = z.object({
	title: z.string(),
	subtitle: z.string(),
	ticker: z.string(),
	tickerMetadata: z.object({
		ticker: z.string(),
		quote: z.string(),
		name: z.string(),
		type: z.string(),
	}),
	percentageChange: z.number(),
	timePeriod: z.string(),
	data: zMultiSeries,
});

export type TNerdyFinancePerformanceCompareChartDataResult = z.infer<
	typeof zNerdyFinancePerformanceCompareChartDataResult
>;

// export type TNerdyFinancePerformanceCompareChartDataResult = {
// 	title: string;
// 	subtitle: string;
// 	ticker: string;
// 	tickerMetadata: {
// 		ticker: string;
// 		quote: string;
// 		name: string;
// 		type: string;
// 	};
// 	percentageChange: number;
// 	timePeriod: string;
// 	// data: {value: number; index: Date}[];
// 	data: TMultiSeries;
// };

type NerdyFinancePerformanceCompareArgs = {
	ticker: string;
	ticker2: string;
	endDate: string;
	timePeriod: '1M' | '3M' | '1Y' | '2Y' | 'YTD' | 'QTD';
};

// https://www.notion.so/Infrastructure-e7e97661104a4dbba99d3a648c8f3228
export const fetchNerdyFinancePerformanceCompareData = async (
	{ticker, ticker2, endDate, timePeriod}: NerdyFinancePerformanceCompareArgs,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinancePerformanceCompareChartDataResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	console.log({endDate, timePeriod});

	// const apiUrl = `${apiBase}/flics/simple-price-chart?ticker=${ticker}&&endDate=${endDate}&timePeriod=${timePeriod}`;

	// const apiUrl = `${apiBase}/analytics-tools/performance-compare?firstAsset=${ticker}&secondAsset=${ticker2}&endDate=${endDate}&timePeriod=${timePeriod}`;
	// const apiUrl =
	// 	apiBase +
	// 	'/analytics-tools/performance-compare?firstAsset=XAU-USD&secondAsset=BTC-USD&endDate=2024-07-03T13:51:28.917Z&timePeriod=2Y';
	const apiUrl = `${apiBase}/analytics-tools/performance-compare?firstAsset=${ticker}&secondAsset=${ticker2}&endDate=2024-07-03T13:51:28.917Z&timePeriod=2Y`;
	// const apiUrl =  "https://nerdy.finance/analytics/performance-compare?firstAsset=BTC-USD&secondAsset=COIN&endDate=2024-07-02T13%3A43%3A55.406Z&timePeriod=1Y&_data=root";
	// const apiUrl =
	// 	apiBase +
	// 	'/analytics/performance-compare?firstAsset=BTC-USD&secondAsset=COIN&endDate=2024-07-02T13%3A43%3A55.406Z&timePeriod=1Y&_data=root';

	const data = await fetch(apiUrl);

	const json = await data.json();

	const seriesData = JSON.parse(json.series);

	const series1: number[] = [];
	const series2: number[] = [];
	const dates: Date[] = [];

	for (const it of seriesData) {
		// console.log(num);
		series1.push(it.firstAsset);
		series2.push(it.secondAsset);
		dates.push(new Date(it.date));
	}

	const parsedMultiSeries = {
		meta: [{ticker: json.first_asset}, {ticker: json.second_asset}],
		series: [series1, series2],
		index: dates,
	};

	console.log(json);
	console.log({seriesData});
	console.log({parsedMultiSeries});

	// TODO validate a specific return type
	// maybe with zod it is possible?

	return {
		data: parsedMultiSeries,
		title: json.title,
		ticker: json.ticker,
		timePeriod: json.time_period,
		percentageChange: json.percentage_change,
		subtitle: json.subtitle,
		tickerMetadata: json.ticker_metadata,
	};
};
