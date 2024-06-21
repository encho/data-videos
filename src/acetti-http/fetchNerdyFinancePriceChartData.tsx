export type TNerdyFinancePriceChartDataResult = {
	title: string;
	subtitle: string;
	ticker: string;
	tickerMetadata: {
		ticker: string;
		quote: string;
		name: string;
		type: string;
	};
	percentageChange: number;
	timePeriod: string;
	data: {value: number; index: Date}[];
};

type NerdyFinancePriceChartsArgs = {
	ticker: string;
	endDate: string;
	timePeriod: '1M' | '3M' | '1Y' | '2Y' | 'YTD' | 'QTD';
};

export const fetchNerdyFinancePriceChartData = async (
	{ticker, endDate, timePeriod}: NerdyFinancePriceChartsArgs,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinancePriceChartDataResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	const apiUrl = `${apiBase}/flics/simple-price-chart?ticker=${ticker}&&endDate=${endDate}&timePeriod=${timePeriod}`;

	console.log(apiUrl);

	const data = await fetch(apiUrl);

	const json = await data.json();

	// TODO validate a specific return type
	// maybe with zod it is possible?
	// TODO parse within the component!
	const parsedData = json.data.map((it: {value: number; index: string}) => ({
		value: it.value,
		index: new Date(it.index),
	}));

	return {
		data: parsedData,
		title: json.title,
		ticker: json.ticker,
		timePeriod: json.time_period,
		percentageChange: json.percentage_change,
		subtitle: json.subtitle,
		tickerMetadata: json.ticker_metadata,
	};
};
